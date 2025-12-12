import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  },
  { timestamps: true }
);

export const cartModel = mongoose.model('Carts', cartSchema);