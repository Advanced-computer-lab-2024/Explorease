const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promoCodeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Promo code names should be unique
        trim: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true, // Default to active when created
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100, // Percentage should be between 0 and 100
    },
    activeUntil: {
        type: Date, // Expiration date of the promo code
        required: true,
        validate: {
            validator: function (value) {
                return value > Date.now(); // Ensure activeUntil is a future date
            },
            message: 'activeUntil must be a future date',
        },
    },
    touristsUsed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tourist', // Reference to the Tourist model
        },
    ],
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
