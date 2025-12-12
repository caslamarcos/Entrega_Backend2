import { userRepository } from '../repositories/user.repository.js';
import { createHash, isValidPassword, generateToken } from '../utils.js';

class UserService {
  async registerUser(data) {
    if (!data) {
      throw new Error('Datos de registro no recibidos');
    }

    const { first_name, last_name, email, age, password, role } = data;

    if (!first_name || !last_name || !email || !age || !password) {
      const err = new Error('Datos incompletos');
      err.code = 'INCOMPLETE_DATA';
      throw err;
    }

    // ¿Ya existe?
    const exist = await userRepository.getByEmail(email);
    if (exist) {
      const err = new Error('El usuario ya existe');
      err.code = 'USER_EXISTS';
      throw err;
    }

    const hashedPassword = createHash(password);

    const newUser = await userRepository.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: role || 'user'
    });

    return newUser;
  }

  async loginUser({ email, password }) {
    if (!email || !password) {
      const err = new Error('Datos incompletos');
      err.code = 'INCOMPLETE_DATA';
      throw err;
    }

    const user = await userRepository.getByEmail(email);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    if (!isValidPassword(user, password)) {
      const err = new Error('Credenciales inválidas');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const token = generateToken(user);
    return { user, token };
  }

  async getCurrentUser(userId) {
    const user = await userRepository.getById(userId);
    return user;
  }

  async getUsers() {
    const users = await userRepository.getAll();
    return users;
  }
}

export const userService = new UserService();