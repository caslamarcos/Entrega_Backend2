import { productModel } from '../dao/models/product.model.js';

class ProductRepository {
  async create(data) {
    return productModel.create(data);
  }

  async getAll() {
    return productModel.find().lean();
  }

  async getById(id) {
    return productModel.findById(id).lean();
  }

  async update(id, data) {
    return productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return productModel.findByIdAndDelete(id);
  }
}

const productRepository = new ProductRepository();
export default productRepository;