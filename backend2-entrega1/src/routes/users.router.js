import { Router } from 'express';
import passport from 'passport';
import { userService } from '../services/user.service.js';
import { authorization } from '../middlewares/authorization.js';

const router = Router();

// Obtener todos los usuarios (ruta protegida)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const users = await userService.getUsers();
      res.send({ status: 'success', payload: users });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', error: 'Error al obtener usuarios' });
    }
  }
);

// Obtener un usuario por ID
router.get(
  '/:uid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await userService.getUserById(uid);
      if (!user)
        return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });

      res.send({ status: 'success', payload: user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', error: 'Error al obtener usuario' });
    }
  }
);


// Crear usuario (además del register, opcional para admin)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).send({ status: 'success', payload: user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', error: 'Error al crear usuario' });
    }
  }
);

// Actualizar usuario
router.put(
  '/:uid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const update = req.body;
      const userUpdated = await userService.updateUser(uid, update);

      if (!userUpdated)
        return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });

      res.send({ status: 'success', payload: userUpdated });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', error: 'Error al actualizar usuario' });
    }
  }
);


// Eliminar usuario (ejemplo: solo admin)
router.delete(
  '/:uid',
  passport.authenticate('jwt', { session: false }),
  authorization(['admin']),
  async (req, res) => {
    try {
      const { uid } = req.params;
      const result = await userService.deleteUser(uid);

      if (!result)
        return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });

      res.send({ status: 'success', message: 'Usuario eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', error: 'Error al eliminar usuario' });
    }
  }
);

export default router;