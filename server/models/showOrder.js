// models/Order.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName: { type: String, required: true }, // <-- register name
  address: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      qty: Number,
      unitPrice: Number,
    },
  ],
  paymentMethod: { type: String, enum: ["COD", "Online"], required: true },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Processing" },
  price: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
