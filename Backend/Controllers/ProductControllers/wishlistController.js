// controllers/wishlistController.js
const Wishlist = require('../../Models/ProductModels/Wishlist');
const Product = require('../../Models/ProductModels/Product');
const Tourist = require('../../Models/UserModels/Tourist');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const touristId = req.user.id; // Assuming user ID is available in req.user
        const { productId } = req.body;

        // Validate product existence
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ tourist: touristId });
        if (!wishlist) {
            wishlist = new Wishlist({ tourist: touristId, products: [] });
        }

        // Check if product is already in wishlist
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        // Add product to wishlist
        wishlist.products.push(productId);
        await wishlist.save();

        // Update tourist's wishlist reference if not set
        const tourist = await Tourist.findById(touristId);
        if (!tourist.wishlist) {
            tourist.wishlist = wishlist._id;
            await tourist.save();
        }

        res.status(200).json({ message: 'Product added to wishlist', wishlist });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
    try {
        const touristId = req.user.id;

        const wishlist = await Wishlist.findOne({ tourist: touristId }).populate('products');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        res.status(200).json({ wishlist });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const touristId = req.user.id;
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ tourist: touristId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Check if product is in wishlist
        if (!wishlist.products.includes(productId)) {
            return res.status(400).json({ message: 'Product not in wishlist' });
        }

        // Remove product from wishlist
        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );
        await wishlist.save();

        res.status(200).json({ message: 'Product removed from wishlist', wishlist });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
