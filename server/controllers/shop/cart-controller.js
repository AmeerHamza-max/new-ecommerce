const Product = require("../../models/Product");
const Cart = require("../../models/Cart");

// Helper logging
const log = (m, d) => console.log(`[Cart] ${m}:`, d);

// ======================================================
// Add to Cart
// ======================================================
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[index].quantity += quantity;
    }

    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice"
    });

    const items = cart.items.map((i) => ({
      productId: i.productId._id,
      image: i.productId.image,
      title: i.productId.title,
      price: i.productId.price,
      salePrice: i.productId.salePrice,
      quantity: i.quantity,
    }));

    return res.status(200).json({ success: true, data: { items } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================================================
// Fetch Cart Items
// ======================================================
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice"
    });

    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    // Clean invalid products
    cart.items = cart.items.filter((i) => i.productId !== null);
    await cart.save();

    const items = cart.items.map((i) => ({
      productId: i.productId._id,
      image: i.productId.image,
      title: i.productId.title,
      price: i.productId.price,
      salePrice: i.productId.salePrice,
      quantity: i.quantity,
    }));

    return res.status(200).json({ success: true, data: { items } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================================================
// Update Quantity
// ======================================================
const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const index = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (index === -1) return res.status(404).json({ success: false, message: "Not found" });

    cart.items[index].quantity = quantity;
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice"
    });

    const items = cart.items.map((i) => ({
      productId: i.productId._id,
      image: i.productId.image,
      title: i.productId.title,
      price: i.productId.price,
      salePrice: i.productId.salePrice,
      quantity: i.quantity,
    }));

    return res.status(200).json({ success: true, data: { items } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ======================================================
// Delete Item
// ======================================================
const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice"
    });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.productId._id.toString() !== productId
    );

    await cart.save();

    const items = cart.items.map((i) => ({
      productId: i.productId._id,
      image: i.productId.image,
      title: i.productId.title,
      price: i.productId.price,
      salePrice: i.productId.salePrice,
      quantity: i.quantity,
    }));

    return res.status(200).json({ success: true, data: { items } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQuantity,
  deleteCartItem,
};
