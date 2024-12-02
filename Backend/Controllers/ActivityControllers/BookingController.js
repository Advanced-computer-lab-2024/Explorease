const bookingModel = require('../../Models/ActivityModels/Booking.js');
const { default: mongoose } = require('mongoose');
const Activity = require('../../Models/ActivityModels/Activity.js');
const Tourist= require('../../Models/UserModels/Tourist.js');

const Notification = require('../../Models/UserModels/Notification');
const { sendEmail } = require('../../utils/emailService.js'); // Assuming you have an email service

const sendBookingReminders = async () => {
    try {
        const now = new Date();
        const reminderThreshold = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        // Find bookings that are active and happening within the next 24 hours
        const bookings = await bookingModel
            .find({
                Status: 'Active',
                CancellationDeadline: { $gte: now, $lte: reminderThreshold },
            })
            .select('Tourist Activity') // Limit fields returned for optimization
            .populate('Tourist', 'username email') // Only populate necessary fields
            .populate('Activity', 'name date'); // Only populate necessary fields

        if (bookings.length === 0) {
            console.log('No upcoming bookings within the next 24 hours.');
            return;
        }

        for (const booking of bookings) {
            const { Tourist: tourist, Activity: activity } = booking;

            if (!tourist || !activity) {
                console.error(`Missing tourist or activity details for booking ID: ${booking._id}`);
                continue;
            }

            // Create an in-app notification for the tourist
            const notification = new Notification({
                user: tourist._id,
                role: 'Tourist',
                type: 'event_reminder',
                message: `Reminder: Your event "${activity.name}" is scheduled for ${new Date(activity.date).toLocaleString()}.`,
            });

            await notification.save();

            // Send an email reminder
            const emailSubject = `Upcoming Event Reminder: "${activity.name}"`;
            const emailMessage = `
                <h1>Upcoming Event Reminder</h1>
                <p>Dear ${tourist.username},</p>
                <p>This is a friendly reminder that you have an event scheduled:</p>
                <ul>
                    <li><strong>Event Name:</strong> ${activity.name}</li>
                    <li><strong>Date & Time:</strong> ${new Date(activity.date).toLocaleString()}</li>
                </ul>
                <p>We look forward to seeing you there!</p>
                <p>Best regards,<br>Your Travel Team</p>
            `;

            await sendEmail(tourist.email, emailSubject, emailMessage);
        }

        console.log(`Booking reminders sent successfully to ${bookings.length} users.`);
    } catch (error) {
        console.error('Error sending booking reminders:', error.stack);
    }
};

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

    try {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if the cancellation deadline has passed
        if (new Date() > booking.CancellationDeadline) {
            return res.status(400).json({ message: 'Cancellation deadline has passed, booking cannot be canceled' });
        }

        // Update the status to 'Cancelled'
        booking.Status = 'Cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking canceled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling booking', error: error.message });
    }
};

// Set a rating for an activity booking (one-time only)
const setRatingForActivityBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { rating } = req.body;
    const { id: userId } = req.user; // Extract user ID from authenticated user

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating should be between 1 and 5.' });
    }

    try {
        // Find the booking using Activity ID and User ID
        const booking = await bookingModel
            .findOne({ _id: bookingId, Tourist: userId })
            .populate('Activity');
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        if (!booking.Activity) {
            return res.status(404).json({ error: 'Associated activity not found.' });
        }

        console.log(booking.Activity.name); // Log activity name for debugging

        if (booking.rating !== undefined) {
            return res.status(400).json({ error: 'Rating has already been set and cannot be updated.' });
        }

        // Set the rating
        booking.rating = rating;
        await booking.save();

        return res.status(200).json({ message: 'Rating set successfully.', rating: booking.rating });
    } catch (error) {
        console.error('Error setting rating:', error); // Log error for debugging
        return res.status(500).json({ error: 'An error occurred while setting the rating.' });
    }
};


// Set a comment for an activity booking (one-time only)
const setCommentForActivityBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { comment } = req.body;

    if (!comment || typeof comment !== 'string') {
        return res.status(400).json({ error: 'Comment is required and should be a string.' });
    }

    try {
        // Find the booking and check if a comment already exists
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }

        if (booking.comment) {
            return res.status(400).json({ error: 'Comment has already been set and cannot be updated.' });
        }

        // Set the comment
        booking.comment = comment;
        await booking.save();

        return res.status(200).json({ message: 'Comment set successfully.', comment: booking.comment });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while setting the comment.' });
    }
};


module.exports = {
    setRatingForActivityBooking,
    setCommentForActivityBooking,
    createBooking,
    getAllBookings,
    getAllBookingsforActivity,
    getMyBookings,
    deleteBooking,
    sendBookingReminders,
};