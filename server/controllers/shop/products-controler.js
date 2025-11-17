const Product = require("../../models/Product");

// ----------------------------
// Debug helpers
// ----------------------------
const logInfo = (msg, data) => console.log(`[ProductController] ${msg}:`, data);
const logError = (msg, error) => console.error(`[ProductController] ${msg}:`, error);

// ----------------------------
// GET: Filtered + Sorted Products
// ----------------------------
const getFilteredProducts = async (req, res) => {
  try {
    const { category = "", brand = "", sortBy = "price-lowtoHigh" } = req.query;
    logInfo("Filtering Products with query", req.query);

    const filters = {};
    if (category) filters.category = { $in: category.split(",") };
    if (brand) filters.brand = { $in: brand.split(",") };

    let sort = {};
    switch (sortBy) {
      case "price-lowtoHigh": sort = { price: 1 }; break;
      case "price-hightoLow": sort = { price: -1 }; break;
      case "newest": sort = { createdAt: -1 }; break;
      case "best-rated": sort = { rating: -1 }; break;
      default: sort = { price: 1 };
    }

    const products = await Product.find(filters).sort(sort);
    logInfo("Filtered Products count", products.length);

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    logError("Error fetching products", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// ----------------------------
// GET: Single Product Details
// ----------------------------
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    logInfo("Fetching product by ID", id);

    const product = await Product.findById(id);
    if (!product) {
      logError("Product not found", id);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    logError("Error fetching product details", error);
    res.status(500).json({ success: false, message: "Failed to fetch product details" });
  }
};

// ----------------------------
// POST: Add Review
// ----------------------------
const addProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, userName } = req.body;
    logInfo(`Adding review for ProductID=${productId}`, req.body);

    if (!rating || !comment) return res.status(400).json({ success: false, message: "Rating and comment required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const newReview = { userName: userName || "Anonymous", rating: Number(rating), comment };
    product.reviews.push(newReview);

    // Update average rating safely
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    logInfo("Review added", newReview);

    res.status(201).json({ success: true, message: "Review added", updatedProduct: product });
  } catch (error) {
    logError("Error adding review", error);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

// ----------------------------
// PUT: Edit Review
// ----------------------------
const editProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;
    logInfo(`Editing review for ProductID=${productId}, ReviewID=${reviewId}`, req.body);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (rating != null) review.rating = Number(rating);
    if (comment) review.comment = comment;

    // Update average rating safely
    product.rating = product.reviews.length
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

    await product.save();
    logInfo("Review updated", review);

    res.status(200).json({ success: true, message: "Review updated", data: review });
  } catch (error) {
    logError("Error editing review", error);
    res.status(500).json({ success: false, message: "Failed to edit review" });
  }
};

// ----------------------------
// DELETE: Remove Review
// ----------------------------
const deleteProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    logInfo(`Deleting review for ProductID=${productId}, ReviewID=${reviewId}`);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const reviewIndex = product.reviews.findIndex((r) => r._id.toString() === reviewId);
    if (reviewIndex === -1) return res.status(404).json({ success: false, message: "Review not found" });

    product.reviews.splice(reviewIndex, 1);
    product.rating = product.reviews.length
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

    await product.save();
    logInfo("Review deleted successfully", { productId, reviewId });

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    logError("Error deleting review", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};

// ----------------------------
// GET: All Reviews for a Product
// ----------------------------
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    logInfo(`Fetching all reviews for ProductID=${productId}`);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, count: product.reviews.length, data: product.reviews });
  } catch (error) {
    logError("Error fetching reviews", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

module.exports = {
  getFilteredProducts,
  getProductDetails,
  addProductReview,
  editProductReview,
  deleteProductReview,
  getProductReviews,
};
