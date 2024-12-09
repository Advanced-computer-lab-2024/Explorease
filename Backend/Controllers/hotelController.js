const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendHotelReceiptEmail } = require('../utils/receiptService'); // Import the email function


const createStripeSession = async (req, res) => {
    const { hotelId, price, name, country, currency, checkInDate, checkOutDate } = req.body;
    const buyerId = req.user.id; // Tourist's ID from authentication

    try {
        // if (!hotelId || !price || !name || !country || !currency) {
        //     return res.status(400).json({ message: 'Hotel ID, price, hotel name, country, and currency are required.' });
        // }

        // Ensure the price is a valid number
        const totalCost = parseFloat(price);
        if (isNaN(totalCost) || totalCost <= 0) {
            return res.status(400).json({ message: 'Invalid price specified.' });
        }

        // Convert the price to the smallest unit (e.g., cents for USD)
        const amountInCents = Math.round(totalCost * 100);

        // Create Stripe session for the hotel booking
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency.toLowerCase(), // Convert currency to lowercase (e.g., 'usd')
                        product_data: {
                            name: `${name} - ${country}`,
                            description: `Check-in: ${checkInDate}, Check-out: ${checkOutDate}`,
                        },
                        unit_amount: amountInCents, // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            client_reference_id: buyerId, // Reference the user making the payment
            metadata: {
                hotelId,
                buyerId,
                amount: totalCost,
                checkInDate,
                checkOutDate,
            },
            success_url: `${process.env.FRONTEND_URL}//payment-status?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/tourist`,
        });
        sendHotelReceiptEmail(price, name, country, currency, checkInDate, checkOutDate, req.user.id);
        // Return the session URL to the frontend
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe session for hotel:', error.message);
        res.status(500).json({ message: 'Error creating Stripe session for hotel', error: error.message });
    }
};

module.exports = { createStripeSession };
