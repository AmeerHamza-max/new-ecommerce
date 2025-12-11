// --- controllers/viewOrderController.js ---

const ViewOrder = require("../models/view-order");
const Product = require("../models/Product");

// ----------------------------
// Create New Order
// ----------------------------
exports.createOrder = async (req, res) => {
  try {
    const { userId, customerName, items, address, paymentMethod } = req.body;

    if (!userId || !items?.length || !address || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Stock Validation
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }
      if ((product.totalStock ?? 0) < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}`,
        });
      }
    }

    // Deduct stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      product.totalStock -= item.quantity;
      await product.save();
    }

    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = 10; // Default shipping

    const newOrder = await ViewOrder.create({
      userId,
      customerName,
      items,
      address,
      amount: totalAmount,
      shipping: shippingCost,
      paymentMethod,
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("createOrder error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ----------------------------
// Get All Orders for a User
// ----------------------------
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await ViewOrder.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("getUserOrders error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ----------------------------
// Get Single Order by ID
// ----------------------------
exports.getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await ViewOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getSingleOrder error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ----------------------------
// Admin: Update Order Status
// ----------------------------
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedOrder = await ViewOrder.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("updateOrderStatus error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
