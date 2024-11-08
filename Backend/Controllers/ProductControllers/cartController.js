// controllers/CartController.js
const Cart = require('../../Models/ProductModels/Cart');
const Product = require('../../Models/ProductModels/Product');
const Tourist = require('../../Models/UserModels/Tourist');
const Purchase = require('../../Models/ProductModels/Purchase');

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const touristId = req.user.id; // Assuming authentication middleware provides the tourist's ID

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create the cart
        let cart = await Cart.findOne({ touristId });
        if (!cart) {
            cart = new Cart({ touristId, items: [] });
        }

        // Check if product is already in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

const viewCart = async (req, res) => {
    const touristId = req.user.id; // Assuming authentication middleware provides the tourist's ID

    try {
        const cart = await Cart.findOne({ touristId }).populate('items.productId', 'Name Price imageUrl');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    const touristId = req.user.id;
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ touristId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
};

const clearCart = async (req, res) => {
    const touristId = req.user.id;

    try {
        const cart = await Cart.findOne({ touristId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ message: 'Cart cleared', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};

const checkoutCart = async (req, res) => {
    const buyerId = req.user.id; // Tourist's ID from authentication

    try {
        // Retrieve tourist's cart
        const cart = await Cart.findOne({ touristId: buyerId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total cost
        const totalCost = cart.items.reduce((sum, item) => {
            return sum + item.productId.Price * item.quantity;
        }, 0);

        // Retrieve tourist to check wallet balance
        const tourist = await Tourist.findById(buyerId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if wallet balance is sufficient
        if (tourist.wallet < totalCost) {
            return res.status(400).json({ message: 'Insufficient funds in wallet' });
        }

        // Deduct total cost from wallet
        tourist.wallet -= totalCost;
        await tourist.save();

        // Create purchase records and update product stock
        const purchases = await Promise.all(
            cart.items.map(async (item) => {
                const product = item.productId;
                
                // Check if sufficient stock exists
                if (product.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.Name}`);
                }

                // Decrement stock
                product.quantity -= item.quantity;
                await product.save();

                // Create purchase record
                const purchase = new Purchase({
                    productId: product._id,
                    buyerId,
                    quantity: item.quantity,
                    totalPrice: product.Price * item.quantity
                });

                await purchase.save();
                return purchase;
            })
        );

        // Clear the cart after successful purchase
        cart.items = [];
        await cart.save();

        res.status(200).json({
            message: 'Checkout successful',
            purchases,
            newWalletBalance: tourist.wallet
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during checkout', error: error.message });
    }
};

module.exports = {
    addToCart,
    viewCart,
    removeFromCart,
    clearCart,
    checkoutCart
};
