const mongoose = require('mongoose');

// ----------------------------
// Cart Schema
// ----------------------------
const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
}, { timestamps: true });

// ----------------------------
// Pre-save Debug Hook
// ----------------------------
CartSchema.pre('save', function (next) {
  console.log(`[CartModel] Saving cart for userId: ${this.userId}`);
  console.log(`[CartModel] Items:`, this.items.map(item => ({ productId: item.productId, quantity: item.quantity })));
  next();
});

// ----------------------------
// Pre-remove Debug Hook
// ----------------------------
CartSchema.pre('remove', function (next) {
  console.log(`[CartModel] Removing cart for userId: ${this.userId}`);
  next();
});

// ----------------------------
// Model Export
// ----------------------------
module.exports = mongoose.model('Cart', CartSchema);
