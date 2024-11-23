const PromoCode = require('../../Models/ProductModels/PromoCode.js');
const { default: mongoose } = require('mongoose');


// Create a new promo code
const createPromoCode = async (req, res) => {
    try {
        const { name, isActive, percentage, activeUntil } = req.body;

        // Create a new promo code
        const promoCode = new PromoCode({
            name,
            isActive,
            percentage,
            activeUntil,
        });

        await promoCode.save();
        res.status(201).json({ message: 'Promo code created successfully', promoCode });
    } catch (error) {
        res.status(500).json({ message: 'Error creating promo code', error: error.message });
    }
};

// Update an existing promo code
const updatePromoCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, isActive, percentage, activeUntil } = req.body;

        // Find and update the promo code
        const promoCode = await PromoCode.findByIdAndUpdate(
            id,
            { name, isActive, percentage, activeUntil },
            { new: true, runValidators: true }
        );

        if (!promoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }

        res.status(200).json({ message: 'Promo code updated successfully', promoCode });
    } catch (error) {
        res.status(500).json({ message: 'Error updating promo code', error: error.message });
    }
};

// Delete a promo code
const deletePromoCode = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the promo code
        const promoCode = await PromoCode.findByIdAndDelete(id);

        if (!promoCode) {
            return res.status(404).json({ message: 'Promo code not found' });
        }

        res.status(200).json({ message: 'Promo code deleted successfully', promoCode });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting promo code', error: error.message });
    }
};

// Get all promo codes
const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find(); // Fetch all promo codes
        res.status(200).json({ message: 'Promo codes fetched successfully', promoCodes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
    }
};

// Export all functions at the end
module.exports = {
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    getAllPromoCodes, // Export the new method
};
