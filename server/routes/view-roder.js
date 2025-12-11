// --- routes/viewOrderRoutes.js ---

const express = require("express");
const router = express.Router();

// Controller
const viewOrderController = require("../controllers/view-order");

// ----------------------------
// Routes for Orders
// ----------------------------

// Create new order
// POST /api/viewOrders
router.post("/", viewOrderController.createOrder);

// Get all orders for a specific user
// GET /api/viewOrders/user/:userId
router.get("/user/:userId", viewOrderController.getUserOrders);

// Get single order by ID
// GET /api/viewOrders/:orderId
router.get("/:orderId", viewOrderController.getSingleOrder);

// Admin: Update order status
// PATCH /api/viewOrders/:orderId/status
router.patch("/:orderId/status", viewOrderController.updateOrderStatus);

module.exports = router;
