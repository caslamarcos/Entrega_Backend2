import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
import productRepository from '../repositories/product.repository.js';

const router = Router();

// Crear producto (solo admin)
router.post(
  '/',
  passport.authenticate('current', { session: false }),
  authorization(['admin']),
  async (req, res) => {
    try {
      const { title, description, price, stock, category, thumbnails } = req.body;

      if (!title || !price || stock == null) {
        return res
          .status(400)
          .send({ status: 'error', error: 'title, price y stock son obligatorios' });
      }

      const product = await productRepository.create({
        title,
        description,
        price,
        stock,
        category,
        thumbnails
      });

      res.status(201).send({ status: 'success', payload: product });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', error: 'Error al crear producto' });
    }
  }
);

// Listar productos
router.get('/', async (req, res) => {
  try {
    const products = await productRepository.getAll();
    res.send({ status: 'success', payload: products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error al obtener productos' });
  }
});

// Obtener producto por id
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productRepository.getById(pid);

    if (!product) {
      return res
        .status(404)
        .send({ status: 'error', error: 'Producto no encontrado' });
    }

    res.send({ status: 'success', payload: product });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error al obtener producto' });
  }
});

export default router;