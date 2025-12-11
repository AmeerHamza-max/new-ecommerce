const Address = require("../../models/Address");

// ----------------------------
// Debug Utility
// ----------------------------
const LOG = {
    info: (msg, data = "") =>
        console.log(`\x1b[36m[AddressController] ${msg}\x1b[0m`, data),
    warn: (msg, data = "") =>
        console.warn(`\x1b[33m[AddressController] ${msg}\x1b[0m`, data),
    error: (msg, data = "") =>
        console.error(`\x1b[31m[AddressController] ${msg}\x1b[0m`, data),
};

// ----------------------------
// Sanitizer (protects frontend)
// ----------------------------
const sanitize = (address) => {
    if (!address) return null;
    return {
        _id: address._id,
        userId: address.userId,
        address: address.address,
        city: address.city,
        pinCode: address.pinCode,
        phone: address.phone,
        notes: address.notes || "",
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
    };
};

// ---------------------------------------------------------
// 1️⃣ ADD ADDRESS
// ---------------------------------------------------------
const addAddress = async (req, res) => {
    try {
        const { userId, address, city, pinCode, phone, notes } = req.body;

        LOG.info("ADD → Payload received", req.body);

        // Validate
        if (!userId || !address || !city || !pinCode || !phone) {
            LOG.warn("ADD → Missing required fields");
            return res.status(400).json({
                success: false,
                message: "Missing required fields (userId, address, city, pinCode, phone).",
            });
        }

        const created = await Address.create({
            userId,
            address,
            city,
            pinCode,
            phone,
            notes: notes || "",
        });

        LOG.info("ADD → Address created", created._id);

        return res.status(201).json({
            success: true,
            message: "Address created successfully.",
            address: sanitize(created), // matches Redux slice
        });
    } catch (error) {
        LOG.error("ADD → Server Error", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error during address creation.",
        });
    }
};

// ---------------------------------------------------------
// 2️⃣ FETCH ALL ADDRESSES
// ---------------------------------------------------------
const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        LOG.info("FETCH → For User", userId);

        if (!userId) {
            LOG.warn("FETCH → Missing userId");
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const list = await Address.find({ userId }).sort({ createdAt: -1 });

        LOG.info("FETCH → Total Addresses", list.length);

        return res.status(200).json({
            success: true,
            message: "Addresses fetched successfully.",
            addresses: list.map(sanitize), // matches slice
        });
    } catch (error) {
        LOG.error("FETCH → Server Error", error);

        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid User ID format." });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error during fetching addresses.",
        });
    }
};

// ---------------------------------------------------------
// 3️⃣ EDIT ADDRESS
// ---------------------------------------------------------
const editAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { userId, ...updateData } = req.body;

        LOG.info("EDIT → Payload", { addressId, userId, updateData });

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Address ID are required.",
            });
        }

        const updated = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updated) {
            LOG.warn("EDIT → Address not found", addressId);
            return res.status(404).json({
                success: false,
                message: "Address not found or not owned by user.",
            });
        }

        LOG.info("EDIT → Address updated", updated._id);

        return res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            address: sanitize(updated), // matches slice
        });
    } catch (error) {
        LOG.error("EDIT → Error", error);

        if (error.name === "ValidationError")
            return res.status(400).json({ success: false, message: error.message });

        if (error.name === "CastError")
            return res.status(400).json({ success: false, message: "Invalid ID format." });

        return res.status(500).json({ success: false, message: "Internal server error during address update." });
    }
};

// ---------------------------------------------------------
// 4️⃣ DELETE ADDRESS
// ---------------------------------------------------------
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { userId } = req.query;

        LOG.info("DELETE → Payload", { addressId, userId });

        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: "Address ID and User ID are required.",
            });
        }

        const deleted = await Address.findOneAndDelete({ _id: addressId, userId });

        if (!deleted) {
            LOG.warn("DELETE → Address not found", addressId);
            return res.status(404).json({
                success: false,
                message: "Address not found or not owned by user.",
            });
        }

        LOG.info("DELETE → Address deleted", deleted._id);

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully.",
            deletedId: addressId, // matches slice
        });
    } catch (error) {
        LOG.error("DELETE → Error", error);

        if (error.name === "CastError")
            return res.status(400).json({ success: false, message: "Invalid ID format." });

        return res.status(500).json({
            success: false,
            message: "Internal server error during address deletion.",
        });
    }
};

module.exports = {
    addAddress,
    fetchAllAddress,
    editAddress,
    deleteAddress,
};
