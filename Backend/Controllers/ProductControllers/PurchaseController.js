const Purchase = require('../../Models/ProductModels/Purchase.js');
const { default: mongoose } = require('mongoose');
const Product = require('../../Models/ProductModels/Product.js');
const createPurchase = async (req, res) => {
    const { productId, quantity } = req.body;
    const buyerId = req.user.id;

    try {
        // Check if the product exists and has sufficient stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('AvailableQuantity before purchase:', product.AvailableQuantity);
        console.log('Sales before purchase:', product.Sales);

        if (product.AvailableQuantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Update AvailableQuantity and Sales
        product.AvailableQuantity -= quantity;
        product.Sales += quantity;

        // Save the updated product and log the result
        await product.save();
        console.log('AvailableQuantity after purchase:', product.AvailableQuantity);
        console.log('Sales after purchase:', product.Sales);

        // Create new purchase
        const purchase = new Purchase({
            productId,
            buyerId,
            quantity,
            totalPrice: product.Price * quantity,
        });

        await purchase.save();

        res.status(201).json({ message: 'Purchase successful', purchase });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ message: 'Error processing purchase', error: error.message });
    }
};


const getPurchasesByUser = async (req, res) => {
    const buyerId = req.user.id; 

    try {
        const purchases = await Purchase.find({ buyerId: buyerId }).populate('productId', 'Name Price imageUrl');
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
};

const addReviewAndRating = async (req, res) => {
    const { purchaseId } = req.params;
    const { review, rating } = req.body;
    const buyerId = req.user.id; 

    try {
        // Find the purchase and ensure it belongs to the logged-in user
        const purchase = await Purchase.findOne({ _id: purchaseId, buyerId });
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found or not authorized' });
        }

        purchase.review = review;
        purchase.rating = rating;
        await purchase.save();

        res.status(200).json({ message: 'Review and rating added successfully', purchase });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review and rating', error: error.message });
    }
};

module.exports = {createPurchase, getPurchasesByUser, addReviewAndRating};