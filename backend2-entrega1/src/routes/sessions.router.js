import { Router } from 'express';
import passport from 'passport';
import { userModel } from '../dao/models/user.model.js';
import { createHash, isValidPassword, generateToken } from '../utils.js';

const router = Router();

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({ status: 'error', error: 'Datos incompletos' });
    }

    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(400).send({ status: 'error', error: 'El usuario ya existe' });
    }

    const hashedPassword = createHash(password);

    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: role || 'user'
    });

    res.send({ status: 'success', payload: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error interno de registro' });
  }
});

// LOGIN: genera JWT y lo guarda en cookie
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send({ status: 'error', error: 'Datos incompletos' });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).send({ status: 'error', error: 'Usuario no encontrado' });

    if (!isValidPassword(user, password))
      return res.status(400).send({ status: 'error', error: 'Credenciales inválidas' });

    const token = generateToken(user);

    res
      .cookie('jwtCookieToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      .send({
        status: 'success',
        message: 'Login exitoso',
        token // opcional
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Error interno de login' });
  }
});

// CURRENT: devuelve usuario asociado al JWT
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    res.send({
      status: 'success',
      payload: req.user
    });
  }
);

export default router;