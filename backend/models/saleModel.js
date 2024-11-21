import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  modifiers: [{
    name: String,
    option: {
      name: String,
      price: Number
    }
  }],
  discounts: [{
    name: String,
    type: String,
    value: Number
  }],
  subtotal: Number
});

const saleSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  items: [saleItemSchema],
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card']
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'refunded'],
    default: 'completed'
  }
}, {
  timestamps: true
});

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;