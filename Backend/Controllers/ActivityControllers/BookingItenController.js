const BookingItinerary = require('../../Models/ActivityModels/BookingItinerary.js');
const { default: mongoose } = require('mongoose');
const Itinerary = require('../../Models/ActivityModels/Itinerary.js');
const Tourist = require('../../Models/UserModels/Tourist.js');

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
        const bookings = await BookingItinerary.find({ Tourist: touristId });
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

    try {
        const booking = await BookingItinerary.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the cancellation deadline has passed
        if (new Date() > booking.CancellationDeadline) {
            return res.status(400).json({ message: 'Cancellation deadline has passed; booking cannot be canceled' });
        }

        // Update the status to 'Cancelled'
        booking.Status = 'Cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking canceled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling itinerary booking', error: error.message });
    }
};

module.exports = {
    createBookingItinerary,
    getAllBookingsForItinerary,
    getAllBookingsItineraries,
    getMyItineraryBookings,
    cancelBookingItinerary
};
