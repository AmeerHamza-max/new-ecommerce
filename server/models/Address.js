// --- src/models/Address.js (Production Ready & Optimized) ---

const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema(
    {
        // 1️⃣ Link to User
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required.'],
            index: true
        },

        // 2️⃣ Street / Address Line
        address: {
            type: String,
            required: [true, 'Street address is required.'],
            trim: true,
            minlength: [5, 'Street address must be at least 5 characters.'],
            maxlength: [200, 'Street address cannot exceed 200 characters.']
        },

        // 3️⃣ City
        city: {
            type: String,
            required: [true, 'City is required.'],
            trim: true,
            minlength: [2, 'City must be at least 2 characters.'],
            maxlength: [100, 'City cannot exceed 100 characters.']
        },

        // 4️⃣ Pin / ZIP Code
        pinCode: {
            type: String,
            required: [true, 'Pin/ZIP code is required.'],
            trim: true,
            match: [
                /^[A-Za-z0-9\s]{5,10}$/,
                'Pin code must be 5-10 alphanumeric characters.'
            ]
        },

        // 5️⃣ Phone
        phone: {
            type: String,
            required: [true, 'Phone number is required.'],
            trim: true,
            match: [
                /^\+?[0-9]{10,14}$/,
                'Phone must be 10-14 digits, optionally starting with +.'
            ]
        },

        // 6️⃣ Optional Notes / Landmark
        notes: {
            type: String,
            trim: true,
            maxlength: [300, 'Notes cannot exceed 300 characters.'],
            default: ''
        }
    },
    {
        timestamps: true,
        collection: 'addresses'
    }
);

// ✅ Compound index for performance and potential uniqueness
AddressSchema.index({ userId: 1, pinCode: 1 });

// Optional Pre-save debug
AddressSchema.pre('save', function(next) {
    console.log('🟢 [Address Schema] Saving address for user:', this.userId);
    next();
});

module.exports = mongoose.model('Address', AddressSchema);
