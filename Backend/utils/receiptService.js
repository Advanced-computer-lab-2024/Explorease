const Tourist = require('../Models/UserModels/Tourist');
const Activity = require('../Models/ActivityModels/Activity');
const Itinerary = require('../Models/ActivityModels/Itinerary');
const { sendEmail } = require('./emailService');

const sendActivityReceiptEmail = async (booking) => {
    try {
        const tourist = await Tourist.findById(booking.Tourist);
        const activity = await Activity.findById(booking.Activity);

        if (!tourist || !activity) {
            throw new Error('Tourist or Activity not found.');
        }

        // Prepare the receipt email
        const subject = `Receipt for Your Activity Booking - ${activity.name}`;
        const message = `
            <h1>Thank You for Your Booking, ${tourist.username}!</h1>
            <p>Here are your booking details:</p>
            <ul>
                <li><strong>Activity Name:</strong> ${activity.name}</li>
                <li><strong>Booking Date:</strong> ${new Date(booking.BookedAt).toLocaleDateString()}</li>
                <li><strong>Activity Date:</strong> ${new Date(activity.date).toLocaleDateString()}</li>
                <li><strong>Total Amount Paid:</strong> $${booking.amountPaid.toFixed(2)}</li>
                <li><strong>Activity Time:</strong> ${activity.time}</li>
            </ul>
            <p>We hope you enjoy the experience!</p>
            <p>Cheers,<br>Explorease</p>
        `;

        // Send the email
        await sendEmail(tourist.email, subject, message);
        console.log(`Activity receipt email sent to ${tourist.email}`);
    } catch (error) {
        console.error('Error sending activity receipt email:', error.message);
    }
};

const sendItineraryReceiptEmail = async (booking) => {
    try {
        const tourist = await Tourist.findById(booking.Tourist);
        const itinerary = await Itinerary.findById(booking.Itinerary);

        if (!tourist || !itinerary) {
            throw new Error('Tourist or Itinerary not found.');
        }

        // Prepare the receipt email
        const subject = `Receipt for Your Itinerary Booking - ${itinerary.name}`;
        const message = `
            <h1>Thank You for Your Booking, ${tourist.username}!</h1>
            <p>Here are your booking details:</p>
            <ul>
                <li><strong>Itinerary Name:</strong> ${itinerary.name}</li>
                <li><strong>Booking Date:</strong> ${new Date(booking.BookedAt).toLocaleDateString()}</li>
                <li><strong>Total Amount Paid:</strong> $${booking.amountPaid.toFixed(2)}</li>
                <li><strong>Cancellation Deadline:</strong> ${new Date(booking.CancellationDeadline).toLocaleString()}</li>
            </ul>
            <p>We hope you have an amazing adventure!</p>
            <p>Cheers,<br>Explorease </p>
        `;

        // Send the email
        await sendEmail(tourist.email, subject, message);
        console.log(`Itinerary receipt email sent to ${tourist.email}`);
    } catch (error) {
        console.error('Error sending itinerary receipt email:', error.message);
    }
};


module.exports = { sendActivityReceiptEmail, sendItineraryReceiptEmail  };
