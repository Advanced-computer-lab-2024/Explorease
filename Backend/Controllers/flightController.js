const Tourist = require('../Models/UserModels/Tourist');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Controller to handle booking with wallet
const bookFlightWithWallet = async (req, res) => {
    const { flightId, amount } = req.body;

    try {
        // Ensure the user is authenticated
        const user = await Tourist.findById(req.user.id); // Use your authentication middleware to populate `req.user`

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user has enough balance
        if (user.wallet < amount) {
            return res.status(400).json({ error: 'Insufficient wallet balance' });
        }

        // Deduct amount from the user's wallet
        user.wallet -= amount;

        // Save the updated user wallet balance
        await user.save();

        // Create a booking record in your database (adjust based on your model schema)
        // Example:
        const booking = {
            userId: user._id,
            flightId,
            amount,
            paymentMethod: 'wallet',
            status: 'confirmed',
        };
        // Save booking in DB (create a schema/model for bookings if needed)

        return res.status(200).json({
            message: 'Booking successful! Wallet balance updated.',
            walletBalance: user.wallet,
        });
    } catch (error) {
        console.error('Error processing wallet booking:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

// Controller to create Stripe checkout session
const createStripeSession = async (req, res) => {
    const { flightId, amount, origin, destination, departure, arrival } = req.body;
    const buyerId = req.user.id; // Tourist's ID from authentication

    try {
        if (!flightId || !amount) {
            return res.status(400).json({ message: 'Flight ID and amount are required.' });
        }

        // Ensure the amount is a valid number
        const totalCost = parseFloat(amount);
        if (isNaN(totalCost) || totalCost <= 0) {
            return res.status(400).json({ message: 'Invalid amount specified.' });
        }

        // Create Stripe session for the flight
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd', // Default currency to USD
                        product_data: {
                            name: `Flight Booking #${flightId}`,
                            description: `Origin : ${origin} , Departure : ${departure}     \n Destination : ${destination}`,
                        },
                        unit_amount: Math.round(totalCost * 100), // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            client_reference_id: buyerId, // Reference the user making the payment
            metadata: {
                flightId,
                buyerId,
                amount: totalCost,
            },
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/tourist`,
        });

        // Return the session URL to the frontend
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe session:', error.message);
        res.status(500).json({ message: 'Error creating Stripe session', error: error.message });
    }
};

module.exports = {
    bookFlightWithWallet,
    createStripeSession,
};
