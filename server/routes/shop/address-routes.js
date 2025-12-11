// --- src/routes/shop/address-routes.js (Debug & Production Ready) ---

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    addAddress,
    fetchAllAddress,
    editAddress,
    deleteAddress
} = require('../../controllers/shop/address-controller');

// ======================== DEBUG HELPER ========================
const routeLogger = (req, res, next) => {
    console.log(
        `🟢 [ADDRESS ROUTE] ${req.method} ${req.originalUrl} called. ` +
        `Params: ${JSON.stringify(req.params)} | Body: ${JSON.stringify(req.body)} | Query: ${JSON.stringify(req.query)}`
    );
    next();
};

// ======================== ROUTES ========================

// 1️⃣ Add New Address
// POST /api/shop/address/add
// Body: { userId, address, city, pinCode, phone, notes? }
router.post('/add', routeLogger, addAddress);

// 2️⃣ Fetch All Addresses for a User
// GET /api/shop/address/:userId
router.get('/:userId', routeLogger, fetchAllAddress);

// 3️⃣ Update/Edit Address
// PUT /api/shop/address/edit/:addressId
// Body: { userId, address?, city?, pinCode?, phone?, notes? }
router.put('/edit/:addressId', routeLogger, editAddress);

// 4️⃣ Delete Address
// DELETE /api/shop/address/delete/:addressId
// Query: ?userId=...
router.delete('/delete/:addressId', routeLogger, deleteAddress);

// ======================== EXPORT ========================
module.exports = router;
