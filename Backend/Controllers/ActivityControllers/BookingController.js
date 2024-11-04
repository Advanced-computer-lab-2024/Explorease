const bookingModel = require('../../Models/ActivityModels/Booking.js');
const { default: mongoose } = require('mongoose');
const Activity = require('../../Models/ActivityModels/Activity.js');
const Tourist= require('../../Models/UserModels/Tourist.js');

const createBooking = async (req, res) => {
    const { Tourist, Activity } = req.body;

    try {
        // Check if the tourist and activity exist
        const tourist = await Tourist.findById(Tourist);
        const activity = await Activity.findById(Activity);

        if (!tourist || !activity) {
            return res.status(404).json({ message: 'Tourist or Activity not found' });
        }
        const activityDate = activity.date;
        const CancellationDeadline = new Date(activityDate.getTime() - 48 * 60 * 60 * 1000); // 48 hours before

        // Create the booking
        const booking = new bookingModel({
            tourist,
            activity,
            Status: 'Active',
            BookedAt: new Date(),
            CancellationDeadline
        });

        await booking.save();
        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

//get all bookings for this activity/event
const getAllBookingsforActivity = async (req, res) => {
    const { activity } = req.params;

    try {
        const bookings = await bookingModel.find({Activity: activity }).populate('Tourist', 'username');
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this activity' });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
    }

};

//get all bookings el fel donia
const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({});
        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found." });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to load bookings.", error: error.message });
    }

};

//get bookings for tourist
const getMyBookings = async (req, res) => {
    const touristId = req.user.id; // Assume req.user is set by authentication middleware

    try {
        const bookings = await bookingModel.find({ Tourist: touristId }).populate('Activity');

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this tourist.' });
        }

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};


const deleteBooking = async (req, res) => {
    const { bookingId } = req.params;
    console.log(`Canceling booking with ID: ${bookingId}`); // Log to verify

    try {
        const booking = await bookingModel.findById(bookingId);
        
        if (!booking) {
            console.log('Booking not found');
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (new Date() > booking.CancellationDeadline) {
            console.log('Cancellation deadline has passed');
            return res.status(400).json({ message: 'Cancellation deadline has passed, booking cannot be canceled' });
        }

        booking.Status = 'Cancelled';
        await booking.save();

        console.log('Booking canceled successfully');
        res.status(200).json({ message: 'Booking canceled successfully', booking });
    } catch (error) {
        console.error('Error during booking cancellation:', error);
        res.status(500).json({ message: 'Error canceling booking', error: error.message });
    }
};


module.exports = {
    createBooking,
    getAllBookings,
    getAllBookingsforActivity,
    getMyBookings,
    deleteBooking
};