const { get } = require('lodash');
const PromoCode = require('../../Models/ProductModels/PromoCode.js');
const Tourist = require('../../Models/UserModels/Tourist.js');
const { default: mongoose } = require('mongoose');

const createBirthdayPromoCode = async (touristId) => {
    try {
        // Generate a unique promo code
        const promoCode = `BDAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
        
        // Find the tourist to whom the promo code should be assigned
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            throw new Error('Tourist not found');
        }

        // Create a new promo code
        const newPromoCode = await PromoCode.create({
            name: promoCode,
            isActive: true,
            percentage: 20, // Example: 20% discount
            activeUntil: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days validity
        });

        // Add the promo code to the tourist's promos array
        tourist.promoCodes.push(newPromoCode._id);
        await tourist.save();

        console.log(`Promo code created for ${tourist.username}: ${promoCode}`);
        return newPromoCode;
    } catch (error) {
        console.error('Error creating promo code:', error.message);
        throw error;
    }
};


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

const getPromoCodeByName = async (req,res) => {
    const name = req.params.name;
    try {
        const promoCode = await PromoCode.findOne({ name });
        res.status(200).json({ message: 'Promo codes fetched successfully', promoCode });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
    }
}
const applyPromoCode = async (req, res) => {
    const { promoCode, cartTotal } = req.body;

    try {
        // Check if promo code exists
        const promo = await PromoCode.findOne({ name: promoCode });
        if (!promo) {
            return res.status(400).json({ message: 'Invalid promo code.' });
        }

        // Check if promo code is active and not expired
        if (!promo.isActive || new Date() > promo.activeUntil) {
            return res.status(400).json({ message: 'Promo code is not valid or has expired.' });
        }

        // Calculate the discount
        const discount = (promo.percentage / 100) * cartTotal;

        // Respond with the discount value
        res.status(200).json({ discount, message: 'Promo code applied successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error applying promo code', error: error.message });
    }
};


// Export all functions at the end
module.exports = {
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    getAllPromoCodes, // Export the new method
    createBirthdayPromoCode,
    getPromoCodeByName,
    applyPromoCode,

};
