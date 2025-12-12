import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { config } from '../config/config.js';
import { createHash, isValidPassword } from '../utils.js';

class PasswordService {
  // Genera un token de recuperación
  async generateResetToken(email) {
    const user = await userRepository.getByEmail(email);
    if (!user) return null;

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: '1h' } // 1 hora
    );

    return token;
  }

  // Resetea la contraseña usando el token
  async resetPassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwt.secret);

      const user = await userRepository.getById(payload._id);
      if (!user) return null;

      // Evitar que repita la misma contraseña
      const samePassword = isValidPassword(user, newPassword);
      if (samePassword) return 'same';

      const hashed = createHash(newPassword);
      await userRepository.update(user._id, { password: hashed });

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') return 'expired';
      return null;
    }
  }
}

export const passwordService = new PasswordService();