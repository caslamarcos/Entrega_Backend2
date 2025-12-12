import { userModel } from '../dao/models/user.model.js';

class UserRepository {
  async getAll() {
    return userModel.find().lean();
  }

  async getById(id) {
    return userModel.findById(id).lean();
  }

  async getByEmail(email) {
    return userModel.findOne({ email }).lean();
  }

  async create(data) {
    return userModel.create(data);
  }

  async update(id, data) {
    return userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return userModel.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();