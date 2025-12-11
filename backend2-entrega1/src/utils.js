import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config/config.js';

// Encriptar contraseña
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Validar contraseña
export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

// Generar token JWT
export const generateToken = (user) => {
  const payload = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

// Extraer token desde cookie
export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwtCookieToken'];
  }
  return token;
};

// Reexporto para passport.config.js
export { JWT_SECRET };