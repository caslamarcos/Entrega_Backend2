import mongoose from 'mongoose';

const productsCollection = 'Products';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, default: 'general' },
    status: { type: Boolean, default: true },
    thumbnails: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const productModel = mongoose.model(productsCollection, productSchema);