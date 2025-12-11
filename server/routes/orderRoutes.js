const express = require('express');
const router = express.Router();
// 🔥 FIX 1: getOrderDetails function ko import karein
const { createOrder, getOrderDetails } = require('../controllers/orderController');

// POST route: Order create karna
// Yeh POST request ko /api/orders par handle karega
router.post('/', createOrder); 

// 🔥 FIX 2: GET route for Order Details
// Yeh GET request ko /api/orders/:id par handle karega, 
// jahan :id ya toh MongoDB ki _id hogi ya nanoid ki orderId.
router.get('/:id', getOrderDetails); 

module.exports = router;