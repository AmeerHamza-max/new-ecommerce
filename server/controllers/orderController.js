const Order = require("../models/orderModels");
const { nanoid } = require("nanoid");

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { userId, customerName, items, amount, shipping = 0, paymentMethod, address } = req.body;

        if (!userId || !customerName || !items?.length || !amount || !['COD','ONLINE'].includes(paymentMethod) || !address?.address) {
            return res.status(400).json({ success: false, message: "Invalid order data" });
        }

        const orderId = nanoid(10);

        const newOrder = new Order({
            orderId,
            userId,
            customerName,
            items: items.map(item => ({
                productId: item.id,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                image: item.image || ""
            })),
            amount,
            shipping,
            paymentMethod,
            address
        });

        const savedOrder = await newOrder.save();
        return res.status(201).json({ success: true, message: "Order created successfully", order: savedOrder, orderId: savedOrder.orderId });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get order details by custom orderId or MongoDB _id
const getOrderDetails = async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ success: false, message: "Order ID missing" });

    let order = await Order.findOne({ orderId: id });
    if (!order) {
        try {
            order = await Order.findOne({ _id: id });
        } catch {}
    }

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.status(200).json({ success: true, order });
};

module.exports = { createOrder, getOrderDetails };
