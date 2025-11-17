const mongoose = require("mongoose");

// ----------------------------
// Review Schema
// ----------------------------
const ReviewSchema = new mongoose.Schema(
  {
    userName: { type: String, default: "Anonymous", trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// Pre-save debug hook for reviews
ReviewSchema.pre('save', function (next) {
  console.log(`[ReviewSchema] Saving review by: ${this.userName}, rating: ${this.rating}`);
  next();
});

// ----------------------------
// Product Schema
// ----------------------------
const ProductSchema = new mongoose.Schema(
  {
    image: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, maxlength: 50 },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: 0, min: 0 },
    totalStock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

// Virtual field for effective price
ProductSchema.virtual("effectivePrice").get(function () {
  return this.salePrice && this.salePrice > 0 ? this.salePrice : this.price;
});

// ----------------------------
// Pre-save debug hook for products
// ----------------------------
ProductSchema.pre('save', function (next) {
  console.log(`[ProductModel] Saving product: ${this.title}, category: ${this.category}, brand: ${this.brand}`);
  next();
});

// ----------------------------
// Pre-update debug hook for products
// ----------------------------
ProductSchema.pre('findOneAndUpdate', function (next) {
  console.log(`[ProductModel] Updating product with filter:`, this.getQuery());
  next();
});

// Indexes for faster queries
ProductSchema.index({ category: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

// ----------------------------
// Export Model
// ----------------------------
module.exports = mongoose.model("Product", ProductSchema);
