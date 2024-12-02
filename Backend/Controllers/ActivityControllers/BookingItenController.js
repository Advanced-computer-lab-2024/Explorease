const BookingItinerary = require('../../Models/ActivityModels/BookingItinerary.js');
const { default: mongoose } = require('mongoose');
const Itinerary = require('../../Models/ActivityModels/Itinerary.js');
const Tourist = require('../../Models/UserModels/Tourist.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendItineraryReceiptEmail } = require('../../utils/receiptService'); // Import the email function
// Create a new booking for an itinerary
const createBookingItinerary = async (req, res) => {
    const { Tourist, Itinerary } = req.body;

    try {
        // Check if the tourist and itinerary exist
        const tourist = await Tourist.findById(Tourist);
        const itinerary = await Itinerary.findById(Itinerary);

        if (!tourist || !itinerary) {
            return res.status(404).json({ message: 'Tourist or Itinerary not found' });
        }

        // Set the cancellation deadline (48 hours before the first available date of the itinerary)
        const itineraryDate = itinerary.AvailableDates[0];
        const cancellationDeadline = new Date(itineraryDate.getTime() - 48 * 60 * 60 * 1000);

        // Create the booking
        const booking = new BookingItinerary({
            Tourist,
            Itinerary,
            Status: 'Active',
            BookedAt: new Date(),
            CancellationDeadline: cancellationDeadline,
        });

        await booking.save();
        res.status(201).json({ message: 'Itinerary booking created successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating itinerary booking', error: error.message });
    }
};



// Get all bookings for a specific itinerary
const getAllBookingsForItinerary = async (req, res) => {
    const { itinerary } = req.params;

    try {
        const bookings = await BookingItinerary.find({ Itinerary: itinerary }).populate('Tourist', 'username');
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this itinerary' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }
};



// Get all bookings for itineraries
const getAllBookingsItineraries = async (req, res) => {
    try {
        const bookings = await BookingItinerary.find({});
        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found." });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to load bookings.", error: error.message });
    }
};

// Get bookings for the logged-in tourist
const getMyItineraryBookings = async (req, res) => {
    const touristId = req.user.id;

    try {
        const bookings = await BookingItinerary.find({ Tourist: touristId }).populate('Itinerary');
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No itinerary bookings found for this tourist.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itinerary bookings', error: error.message });
    }
};

// Cancel an itinerary booking
const cancelBookingItinerary = async (req, res) => {
    const { bookingId } = req.params;
    const touristId = req.user.id;

    try {
        const booking = await BookingItinerary.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the cancellation deadline has passed
        if (new Date() > booking.CancellationDeadline) {
            return res.status(400).json({ message: 'Cancellation deadline has passed; booking cannot be canceled' });
        }

        // Refund the amount to the tourist's wallet
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        tourist.wallet += booking.amountPaid;
        await tourist.save();

        // Delete the booking document
        await BookingItinerary.findByIdAndDelete(bookingId);

        res.status(200).json({ message: 'Booking canceled and deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling itinerary booking', error: error.message });
    }
};



const setRatingForItineraryBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating should be between 1 and 5.' });
    }

    try {
        const booking = await BookingItinerary.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        if (booking.rating !== undefined) {
            return res.status(400).json({ error: 'Rating has already been set and cannot be updated.' });
        }

        booking.rating = rating;
        await booking.save();

        return res.status(200).json({ message: 'Rating set successfully.', rating: booking.rating });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while setting the rating.' });
    }
};

const setCommentForItineraryBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { comment } = req.body;

    if (!comment || typeof comment !== 'string') {
        return res.status(400).json({ error: 'Comment is required and should be a string.' });
    }

    try {
        const booking = await BookingItinerary.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        if (booking.comment) {
            return res.status(400).json({ error: 'Comment has already been set and cannot be updated.' });
        }

        booking.comment = comment;
        await booking.save();

        return res.status(200).json({ message: 'Comment set successfully.', comment: booking.comment });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while setting the comment.' });
    }
};

const stripeSuccessItinerary = async (req, res) => {
    const { sessionId } = req.body; // Stripe session ID from the frontend

    try {
        // Fetch the Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Extract tourist ID and itinerary ID from session metadata
        const touristId = session.client_reference_id;
        const itineraryId = session.metadata.itineraryId;

        // Validate the tourist and itinerary
        const tourist = await Tourist.findById(touristId);
        const itinerary = await Itinerary.findById(itineraryId);

        if (!tourist || !itinerary) {
            return res.status(404).json({ message: 'Tourist or Itinerary not found.' });
        }

        // Check if a booking already exists
        const existingBooking = await BookingItinerary.findOne({
            Tourist: touristId,
            Itinerary: itineraryId,
        });

        if (existingBooking) {
            console.log(existingBooking);
            return res.status(200).json({ message: 'Booking already exists', booking: existingBooking });
        }

        // Calculate cancellation deadline (48 hours before itinerary date)
        const cancellationDeadline = new Date(itinerary.AvailableDates[0].getTime() - 48 * 60 * 60 * 1000);

        const amountPaid = session.amount_total / 100;

        // Create the booking
        const booking = new BookingItinerary({
            Tourist: touristId,
            Itinerary: itineraryId,
            Status: 'Active',
            BookedAt: new Date(),
            CancellationDeadline : cancellationDeadline,
            paymentMethod: 'Stripe',
            amountPaid,
        });

        await booking.save();

        try {
            await sendItineraryReceiptEmail(booking);
            console.log(`Receipt email sent to ${tourist.email}`);
        } catch (emailError) {
            console.error('Failed to send receipt email:', emailError.message);
        }

        res.status(200).json({ message: 'Itinerary booking successful', booking });
    } catch (error) {
        console.error('Error in Stripe success for itinerary:', error.message);
        res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
};

const createStripeSessionForItinerary = async (req, res) => {
    try {
        const { itineraryId, amountPaid } = req.body;

        const itinerary = await Itinerary.findById(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found.' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: itinerary.name,
                        },
                        unit_amount: Math.round(amountPaid * 100), // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/itinerary-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/tourist`,
            client_reference_id: req.user.id,
            metadata: {
                itineraryId: itineraryId,
            },
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ message: 'Failed to create Stripe session.' });
    }
};

module.exports = {
    setRatingForItineraryBooking,
    setCommentForItineraryBooking,
    createBookingItinerary,
    getAllBookingsForItinerary,
    getAllBookingsItineraries,
    getMyItineraryBookings,
    cancelBookingItinerary,
    stripeSuccessItinerary,
    createStripeSessionForItinerary,
};
