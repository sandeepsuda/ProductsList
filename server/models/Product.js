import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

const ProductModel = model('Product', productSchema);

// Export the model as default
export default ProductModel;

// Export utility functions (wrappers)
export const find = (query) => ProductModel.find(query);
export const findByIdAndDelete = (id) => ProductModel.findByIdAndDelete(id);
export const findByIdAndUpdate = (id, updates, options) => ProductModel.findByIdAndUpdate(id, updates, options);

// Export the model itself by name for compatibility
export const Product = ProductModel;
