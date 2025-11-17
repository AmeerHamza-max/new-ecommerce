const express = require("express");
const {
  addToCart,
  fetchCartItems,
  updateCartItemQuantity,
  deleteCartItem,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

// -----------------------------
// Debug helper
// -----------------------------
const logRoute = (route, info = "") =>
  console.log(`[CartRouter] ${route} called`, info);

// -----------------------------
// Routes
// -----------------------------

/**
 * Fetch cart items for a specific user
 * GET /api/shop/cart/get/:userId
 */
router.get("/get/:userId", async (req, res) => {
  const { userId } = req.params;
  logRoute("GET /get/:userId", { userId });

  try {
    await fetchCartItems(req, res);
  } catch (error) {
    console.error("[CartRouter] Fetch Cart Items Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
    });
  }
});

/**
 * Add a product to the cart
 * POST /api/shop/cart/add
 * Body: { userId, productId, quantity }
 */
router.post("/add", async (req, res) => {
  logRoute("POST /add", { body: req.body });

  try {
    await addToCart(req, res);
  } catch (error) {
    console.error("[CartRouter] Add to Cart Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
});

/**
 * Update quantity of a cart item
 * PUT /api/shop/cart/update
 * Body: { userId, productId, quantity }
 */
router.put("/update", async (req, res) => {
  logRoute("PUT /update", { body: req.body });

  try {
    await updateCartItemQuantity(req, res);
  } catch (error) {
    console.error("[CartRouter] Update Cart Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item",
    });
  }
});

/**
 * Delete a product from the user's cart
 * DELETE /api/shop/cart/:userId/:productId
 */
router.delete("/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;
  logRoute("DELETE /:userId/:productId", { userId, productId });

  try {
    await deleteCartItem(req, res);
  } catch (error) {
    console.error("[CartRouter] Delete Cart Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete cart item",
    });
  }
});

module.exports = router;
