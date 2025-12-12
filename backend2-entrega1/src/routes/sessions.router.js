import { Router } from 'express';
import passport from 'passport';
import { userService } from '../services/user.service.js';
import { config } from '../config/config.js';
import { mailService } from '../services/mail.service.js';
import { passwordService } from '../services/password.service.js';

const router = Router();

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);

    res.send({
      status: 'success',
      payload: newUser
    });
  } catch (error) {
    console.error(error);

    if (error.code === 'INCOMPLETE_DATA' || error.code === 'USER_EXISTS') {
      return res.status(400).send({ status: 'error', error: error.message });
    }

    res.status(500).send({
      status: 'error',
      error: 'Error interno de registro'
    });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { user, token } = await userService.loginUser(req.body);

    res
      .cookie(config.jwt.cookieName, token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      })
      .send({
        status: 'success',
        message: 'Login exitoso',
        token
      });
  } catch (error) {
    console.error(error);

    if (
      error.code === 'INCOMPLETE_DATA' ||
      error.code === 'USER_NOT_FOUND' ||
      error.code === 'INVALID_CREDENTIALS'
    ) {
      return res.status(400).send({ status: 'error', error: error.message });
    }

    res.status(500).send({
      status: 'error',
      error: 'Error interno de login'
    });
  }
});

// CURRENT
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

// RECUPERACIÓN DE CONTRASEÑA - SOLICITAR TOKEN
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .send({ status: 'error', error: 'Debe enviar un email' });
    }

    const token = await passwordService.generateResetToken(email);

    if (!token) {
      // Por seguridad, no decimos si el mail existe o no
      return res.send({
        status: 'success',
        message: 'Si el usuario existe, se enviará un mail con instrucciones'
      });
    }

    // Enviamos el mail
    await mailService.sendPasswordResetMail(email, token);

    // Para poder probar fácil en Thunder te devuelvo el token también
    return res.send({
      status: 'success',
      message: 'Mail de recuperación enviado',
      token
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 'error', error: 'Error al solicitar recuperación' });
  }
});

// RECUPERACIÓN DE CONTRASEÑA - RESTABLECER
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).send({
        status: 'error',
        error: 'Debe enviar token y nueva contraseña'
      });
    }

    const result = await passwordService.resetPassword(token, newPassword);

    if (result === 'expired') {
      return res
        .status(400)
        .send({ status: 'error', error: 'El token ha expirado' });
    }

    if (result === 'same') {
      return res.status(400).send({
        status: 'error',
        error: 'La nueva contraseña no puede ser igual a la anterior'
      });
    }

    if (!result) {
      return res
        .status(400)
        .send({ status: 'error', error: 'Token inválido' });
    }

    return res.send({
      status: 'success',
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 'error', error: 'Error al restablecer contraseña' });
  }
});

export default router;