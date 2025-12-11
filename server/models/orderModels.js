const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },  // frontend 'id' mapped to 'productId'
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String }
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  _id: { type: String },        // optional, matches frontend _id
  userId: { type: String },     // optional
  address: { type: String, required: true },
  city: { type: String, required: true },
  pinCode: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, default: "" }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  customerName: { type: String, required: true },
  items: { type: [CartItemSchema], required: true }, // array of cart items
  amount: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['COD', 'ONLINE'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Cancelled', 'Delivered'], default: 'Pending' },
  transactionId: { type: String, default: null },
  address: { type: AddressSchema, required: true },  // nested address object
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
