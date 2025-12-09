const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PLACED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
      default: 'PLACED'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
