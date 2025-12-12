import cartRepository from '../repositories/cart.repository.js';
import ticketRepository from '../repositories/ticket.repository.js';
import productRepository from '../repositories/product.repository.js'; // lo creamos más abajo
import crypto from 'crypto';

class PurchaseService {
  async purchase(cartId, purchaserEmail) {
    const cart = await cartRepository.getById(cartId);

    if (!cart) {
      const error = new Error('Carrito no encontrado');
      error.statusCode = 404;
      throw error;
    }

    let amount = 0;
    const productsNotProcessed = [];

    // Procesar stock
    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;

      if (product.stock >= quantity) {
        // descontar stock
        await productRepository.update(product._id, {
          stock: product.stock - quantity
        });

        // sumar al total
        amount += product.price * quantity;
      } else {
        // no alcanza el stock → lo anotamos
        productsNotProcessed.push({
          product: product._id,
          name: product.title,
          available: product.stock,
          requested: quantity
        });
      }
    }

    // Crear ticket solo si se procesó algo
    let ticket = null;

    if (amount > 0) {
      const code = crypto.randomBytes(10).toString('hex');

      ticket = await ticketRepository.create({
        code,
        amount,
        purchaser: purchaserEmail
      });
    }

    return {
      status: amount > 0 ? 'success' : 'failed',
      ticket,
      productsNotProcessed
    };
  }
}

const purchaseService = new PurchaseService();
export default purchaseService;