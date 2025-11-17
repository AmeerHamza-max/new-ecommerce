const express = require("express");
const router = express.Router();

const {
  getFilteredProducts,
  getProductDetails,
  addProductReview,
  editProductReview,
  deleteProductReview,
  getProductReviews,
} = require("../../controllers/shop/products-controler");

// -----------------------------
// Debug helper
// -----------------------------
const logRoute = (route, info) => console.log(`[ProductRouter] ${route} called`, info || "");

// -----------------------------
// GET: Filtered products
// -----------------------------
router.get("/get", async (req, res) => {
  logRoute("GET /get", { query: req.query });
  try {
    await getFilteredProducts(req, res);
  } catch (error) {
    console.error("[ProductRouter] Error fetching filtered products:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

// -----------------------------
// GET: Single product details
// -----------------------------
router.get("/:id", async (req, res) => {
  logRoute("GET /:id", { id: req.params.id });
  try {
    await getProductDetails(req, res);
  } catch (error) {
    console.error("[ProductRouter] Error fetching product details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch product details" });
  }
});

// -----------------------------
// GET: All reviews for a product
// -----------------------------
router.get("/:productId/reviews", async (req, res) => {
  logRoute("GET /:productId/reviews", { productId: req.params.productId });
  try {
    await getProductReviews(req, res);
  } catch (error) {
    console.error("[ProductRouter] Error fetching product reviews:", error);
    res.status(500).json({ success: false, message: "Failed to fetch product reviews" });
  }
});

// -----------------------------
// POST: Add a new review
// -----------------------------
router.post("/:productId/reviews", async (req, res) => {
  logRoute("POST /:productId/reviews", { body: req.body });
  try {
    await addProductReview(req, res);
  } catch (error) {
    console.error("[ProductRouter] Error adding product review:", error);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
});

// -----------------------------
// PUT: Edit a review
// -----------------------------
router.put("/:productId/reviews/:reviewId", async (req, res) => {
  logRoute("PUT /:productId/reviews/:reviewId", { body: req.body });
  try {
    await editProductReview(req, res);
  } catch (error) {
    console.error("[ProductRouter] Error editing product review:", error);
    res.status(500).json({ success: false, message: "Failed to edit review" });
  }
});

// -----------------------------
// DELETE: Delete a review
// -----------------------------
router.delete("/:productId/reviews/:reviewId", async (req, res) => {
  logRoute("DELETE /:productId/reviews/:reviewId", { params: req.params });
  try {
    await deleteProductReview(req, res);
  } catch (error) {
    console.error("[ProductRouter] Error deleting product review:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
});

module.exports = router;
