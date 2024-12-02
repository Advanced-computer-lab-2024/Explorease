// controllers/CartController.js
const Cart = require('../../Models/ProductModels/Cart');
const Product = require('../../Models/ProductModels/Product');
const Tourist = require('../../Models/UserModels/Tourist');
const Purchase = require('../../Models/ProductModels/Purchase');
const PromoCode = require('../../Models/ProductModels/PromoCode');
const Notification = require('../../Models/UserModels/Notification');
const Seller = require('../../Models/UserModels/Seller');
const Admin = require('../../Models/UserModels/Admin');
const { sendEmail } = require('../../utils/emailService');

// Validate and Apply Promo Code
const applyPromoCode = async (req, res) => {
    const { promoCode } = req.body;
    const touristId = req.user.id;

    try {
        // Fetch the cart
        const cart = await Cart.findOne({ touristId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Fetch the promo code
        const promo = await PromoCode.findOne({ name: promoCode });
        if (!promo) {
            return res.status(400).json({ message: 'Invalid promo code.' });
        }

        // Check if the promo code is active and not expired
        if (!promo.isActive || new Date() > promo.activeUntil) {
            return res.status(400).json({ message: 'Promo code is expired or inactive.' });
        }

        // Calculate the discount
        const cartTotal = cart.items.reduce((sum, item) => sum + item.productId.Price * item.quantity, 0);
        const discount = (promo.percentage / 100) * cartTotal;

        // Respond with the discount
        res.status(200).json({ discount, message: 'Promo code applied successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error applying promo code', error: error.message });
    }
};


const checkAndNotifyOutOfStock = async (product) => {
    try {
        // Check if the product is out of stock
        if (product.AvailableQuantity === 0) {
            let message;
            let userId;
            let role;
            let email;
            let userName;

            // Check if the product is created by a Seller
            if (product.Seller) {
                const seller = await Seller.findById(product.Seller);
                if (seller) {
                    message = `Your product "${product.Name}" is out of stock.`;
                    userId = seller._id;
                    role = 'Seller';
                    email = seller.email;
                    userName = seller.username;
                }
            } else if (product.Admin) {
                // Check if the product is created by an Admin
                const admin = await Admin.findById(product.Admin);
                if (admin) {
                    message = `The product "${product.Name}" you created is out of stock.`;
                    userId = admin._id;
                    role = 'Admin';
                    email = admin.email;
                    userName = admin.username;
                }
            }

            // Create a notification if userId and message are set
            if (userId && message) {
                const notification = new Notification({
                    user: userId,
                    role: role,
                    type: 'product_out_of_stock',
                    message: message,
                    data: { productId: product._id },
                });
                await notification.save();
            }

            // Send email notification if email is available
            if (email) {
                const subject = `⚠️ Product Out of Stock: ${product.Name}`;
                const emailMessage = `
                    <h1>Hello ${userName},</h1>
                    <p>We noticed that your product <strong>${product.Name}</strong> is now out of stock.</p>
                    <p>Please restock your product to continue receiving orders.</p>
                    <p>Cheers,<br>Your Inventory Management Team</p>
                `;
                await sendEmail(email, subject, emailMessage);
            }
        }
    } catch (error) {
        console.error('Error checking and notifying out-of-stock product:', error.message);
    }
};


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

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe secret key

const checkoutCart = async (req, res) => {
    const buyerId = req.user.id;
    const { paymentMethod, address, promoCode } = req.body;

    try {
        const cart = await Cart.findOne({ touristId: buyerId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const cartTotal = cart.items.reduce((sum, item) => sum + item.productId.Price * item.quantity, 0);

        let discount = 0;
        if (promoCode) {
            const promo = await PromoCode.findOne({ name: promoCode });
            if (promo && promo.isActive && new Date() <= promo.activeUntil) {
                discount = (promo.percentage / 100) * cartTotal;
                promo.touristsUsed.push(buyerId);
                await promo.save();
            }
        }

        const finalCost = cartTotal - discount;
        if (finalCost < 0) {
            return res.status(400).json({ message: 'Discount exceeds total cost.' });
        }

        // Retrieve tourist
        const tourist = await Tourist.findById(buyerId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Handle payment based on the chosen method
        if (paymentMethod === 'wallet') {
            // Wallet Payment
            if (tourist.wallet < finalCost) {
                return res.status(400).json({ message: 'Insufficient funds in wallet' });
            }

            // Deduct final cost from wallet
            tourist.wallet -= finalCost;
            await tourist.save();
        }

        // Check stock availability and create purchase records
        const purchases = await Promise.all(
            cart.items.map(async (item) => {
                const product = item.productId;

                // Check if sufficient stock exists
                if (product.AvailableQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.Name}`);
                }

                // Decrement stock
                product.AvailableQuantity -= item.quantity;
                product.Sales += item.quantity;
                await product.save();

                await checkAndNotifyOutOfStock(product);

                // Create purchase record
                const purchase = new Purchase({
                    productId: product._id,
                    buyerId,
                    quantity: item.quantity,
                    totalPrice: product.Price * item.quantity,
                    address, // Save the delivery address
                    paymentMethod, // Save payment method
                    status: paymentMethod === 'cod' ? 'Pending Payment' : 'Paid', // COD orders are pending payment
                });

                await purchase.save();
                return purchase;
            })
        );

        // Clear the cart after successful checkout (except for Stripe, where it is cleared after success)
        if (paymentMethod !== 'stripe') {
            cart.items = [];
            await cart.save();
        }

        // Return a success response
        res.status(200).json({
            message: 'Checkout successful',
            purchases,
            discount,
            finalCost,
            newWalletBalance: tourist.wallet,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during checkout', error: error.message });
    }
};

const createStripeSession = async (req, res) => {
    const buyerId = req.user.id; // Tourist's ID from authentication
    const { address, promoCode } = req.body;

    try {
        // Retrieve tourist's cart
        const cart = await Cart.findOne({ touristId: buyerId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Calculate total cart cost
        const cartTotal = cart.items.reduce(
            (sum, item) => sum + item.productId.Price * item.quantity,
            0
        );

        let discount = 0;
        if (promoCode) {
            const promo = await PromoCode.findOne({ name: promoCode });
            if (promo && promo.isActive && new Date() <= promo.activeUntil) {
                discount = (promo.percentage / 100) * cartTotal;
                promo.touristsUsed.push(buyerId);
                await promo.save();
            }
        }

        const finalCost = cartTotal - discount;
        if (finalCost < 0) {
            return res.status(400).json({ message: 'Discount exceeds total cost.' });
        }

        // // Log values for debugging
        // console.log("Cart Total:", cartTotal);
        // console.log("Discount:", discount);
        // console.log("Final Cost:", finalCost);

        // Create a single line item for the discounted total
        const lineItems = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Cart Total',
                        description: promoCode ? `Discount applied: ${promoCode}` : 'No promo code applied',
                    },
                    unit_amount: Math.round(finalCost * 100), // Convert to cents
                },
                quantity: 1,
            },
        ];

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            client_reference_id: buyerId,
            metadata: {
                address,
                promoCode: promoCode || 'N/A',
                cartTotal,
                discount,
                finalCost,
            },
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
        });

        // Return the session URL
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe session:', error.message);
        res.status(500).json({ message: 'Error creating Stripe session', error: error.message });
    }
};


const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
  
        } else {
            res.status(400).json({ message: 'Unhandled event type' });
        }
    } catch (error) {
        console.error('Stripe webhook error:', error);
        res.status(400).send(`Webhook error: ${error.message}`);
    }
};

const updateCartQuantity = async (req, res) => {
    const touristId = req.user.id; // Tourist's ID from authentication
    const { productId, quantity } = req.body; // Product ID and new quantity from request body

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure the requested quantity does not exceed the available quantity
        if (quantity > product.AvailableQuantity) {
            return res.status(400).json({
                message: `Requested quantity exceeds available stock (${product.AvailableQuantity})`,
            });
        }

        // Find the cart of the tourist
        const cart = await Cart.findOne({ touristId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Update the quantity of the item
        if (quantity > 0) {
            item.quantity = quantity;
            await checkAndNotifyOutOfStock(product);
        } else {
            // If quantity is 0, remove the item from the cart
            cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart quantity', error: error.message });
    }
};
const stripeSuccess = async (req, res) => {
    const { sessionId } = req.body; // Stripe session ID from the frontend

    try {
        // Fetch the Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Get buyer ID from the session metadata
        const buyerId = session.client_reference_id;

        // Retrieve tourist's cart
        let cart = await Cart.findOne({ touristId: buyerId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or already processed.' });
        }

        // Retrieve tourist
        const tourist = await Tourist.findById(buyerId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Create purchases and update stock
        const purchases = await Promise.all(
            cart.items.map(async (item) => {
                const product = item.productId;

                // Check if sufficient stock exists
                if (product.AvailableQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.Name}`);
                }

                // Decrement stock
                await Product.findByIdAndUpdate(
                    product._id,
                    {
                        $inc: {
                            AvailableQuantity: -item.quantity,
                            Sales: item.quantity,
                        },
                    },
                    { new: true }
                );

                // Create purchase record
                const purchase = new Purchase({
                    productId: product._id,
                    buyerId,
                    quantity: item.quantity,
                    totalPrice: product.Price * item.quantity,
                    address: session.metadata.address, // Use metadata for address
                    paymentMethod: 'stripe',
                    status: 'Paid', // Mark as paid for Stripe
                    delivered: false, // Set delivered to false initially
                });

                await purchase.save();
                return purchase;
            })
        );

        // Clear the cart
        await Cart.updateOne(
            { _id: cart._id },
            { $set: { items: [] } },
            { new: true }
        );

        res.status(200).json({ message: 'Purchase successful', purchases });
    } catch (error) {
        console.error('Error in Stripe success:', error.message);
        res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
};


module.exports = {
    addToCart,
    viewCart,
    removeFromCart,
    clearCart,
    checkoutCart,
    updateCartQuantity,
    createStripeSession,
    stripeWebhook,
    stripeSuccess,
    applyPromoCode,
};
