import { cartModel } from '../dao/models/cart.model.js';

class CartRepository {
  async create() {
    return cartModel.create({ products: [] });
  }

  async getById(id) {
    return cartModel.findById(id).populate('products.product').lean();
  }

  async update(id, data) {
    return cartModel
      .findByIdAndUpdate(id, data, { new: true })
      .populate('products.product');
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await cartModel.findById(cartId);

    if (!cart) return null;

    const index = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index === -1) {
      cart.products.push({ product: productId, quantity });
    } else {
      cart.products[index].quantity += quantity;
    }

    await cart.save();
    return cart.populate('products.product');
  }
}

const cartRepository = new CartRepository();
export default cartRepository;