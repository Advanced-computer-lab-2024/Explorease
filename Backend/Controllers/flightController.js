const user = require('../Models/UserModels/Tourist');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Controller to handle booking with wallet
const bookFlightWithWallet = async (req, res) => {
    const { flightId, amount } = req.body;

    // Assuming `req.user` is already set from authentication middleware
    const user = req.user.id;  // Get the logged-in user

    // Check if user exists and if they have enough balance
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.wallet < amount) return res.status(400).json({ error: 'Insufficient wallet balance' });

    // Deduct amount from user's wallet
    user.wallet -= amount;

    // Save the updated user wallet balance (implement in your DB)
    await user.save();  // Save to DB (adjust based on your model)

    // Process flight booking logic (e.g., create a booking record)

    return res.status(200).json({ message: 'Booking successful! Wallet balance updated.' });
};

// Controller to create Stripe checkout session
const createStripeSession = async (req, res) => {
    const { flightId, amount } = req.body;

    // Assuming `req.user` is already set from authentication middleware
    const user = req.user;  // Get the logged-in user

    if (!user) return res.status(404).json({ error: 'User not found' });

    try {
        // Create a new Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Flight Booking #${flightId}`,
                        },
                        unit_amount: amount * 100,  // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/payment-cancel`,
        });

        // Return the session ID to the frontend
        return res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        return res.status(500).json({ error: 'Error creating Stripe session' });
    }
};

module.exports = {
    bookFlightWithWallet,
    createStripeSession,
};
