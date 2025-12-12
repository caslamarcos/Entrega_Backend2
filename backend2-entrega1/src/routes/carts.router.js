import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
import cartRepository from '../repositories/cart.repository.js';
import purchaseService from '../services/purchase.service.js';

const router = Router();

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity) || 1;

    const updatedCart = await cartRepository.addProduct(cid, pid, qty);

    if (!updatedCart) {
      return res
        .status(404)
        .send({ status: 'error', error: 'Carrito no encontrado' });
    }

    res.send({ status: 'success', payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: 'error',
      error: 'Error al agregar producto al carrito'
    });
  }
});


// Crear carrito vacío
router.post('/', async (req, res) => {
  try {
    const newCart = await cartRepository.create();
    res.status(201).send({ status: 'success', payload: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error al crear carrito' });
  }
});

// Obtener carrito por id (útil para probar)
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepository.getById(cid);

    if (!cart) {
      return res
        .status(404)
        .send({ status: 'error', error: 'Carrito no encontrado' });
    }

    res.send({ status: 'success', payload: cart });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error al obtener carrito' });
  }
});

// Purchase: realiza la compra del carrito
router.post(
  '/:cid/purchase',
  passport.authenticate('current', { session: false }),
  authorization(['user']),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const purchaserEmail = req.user.email;

      const result = await purchaseService.purchase(cid, purchaserEmail);

      res.send({
        status: result.status,
        ticket: result.ticket,
        productsNotProcessed: result.productsNotProcessed
      });
    } catch (error) {
      console.error(error);
      const status = error.statusCode || 500;
      res.status(status).send({ status: 'error', error: error.message });
    }
  }
);

export default router;