const Tourist = require('../Models/UserModels/Tourist');
const TourGuide = require('../Models/UserModels/TourGuide');
const Seller = require('../Models/UserModels/Seller');
const Advertiser = require('../Models/UserModels/Advertiser');
const Activity = require('../Models/ActivityModels/Activity');
const Itinerary = require('../Models/ActivityModels/Itinerary');
const Booking = require('../Models/ActivityModels/Booking');
const BookingItinerary = require('../Models/ActivityModels/BookingItinerary');




// Helper function to check for upcoming events
/*const hasUpcomingEvents = async (userId, userType) => {
    const currentDate = new Date();
    switch (userType) {
        case 'advertiser':
            const act = Activity.exists({ createdBy: userId});
            const activityBookings = await Booking.exists({ Activity: act.id, Status: 'Active', CancellationDeadline: { $gt: currentDate } });
            return activityBookings;
        case 'tourist':
            const activeBookings = await Booking.exists({ Tourist: userId, Status: 'Active', CancellationDeadline: { $gt: currentDate } });
            const activeItineraries = await BookingItinerary.exists({ Tourist: userId, Status: 'Active', CancellationDeadline: { $gt: currentDate } });
            return activeBookings || activeItineraries;
        case 'tourGuide':
            const itin = Itinerary.exists({ createdBy: userId});
             const ItinerariesBooking = await BookingItinerary.exists({ Tourist: itin.id, Status: 'Active', CancellationDeadline: { $gt: currentDate } });
            return ItinerariesBooking;
        default:
            return false;
    }
};*/
const hasUpcomingEvents = async (userId, userType, session) => {
    const currentDate = new Date();
    
    switch (userType) {
      case 'advertiser':
        return await Activity.exists({
          createdBy: userId,
          date: { $gt: currentDate },
          bookingOpen: true,
          'bookings.isPaid': true
        }).session(session);
      case 'tourGuide':
        return await Itinerary.exists({
          createdBy: userId,
          AvailableDates: { $gt: currentDate },
          BookedBy: { $ne: null }
        }).session(session);
      case 'tourist':
        const activeBookings = await Booking.exists({
          Tourist: userId,
          Status: 'Active',
          CancellationDeadline: { $gt: currentDate }
        }).session(session);
        const activeItineraries = await BookingItinerary.exists({
          Tourist: userId,
          Status: 'Active',
          CancellationDeadline: { $gt: currentDate }
        }).session(session);
        return activeBookings || activeItineraries;
      default:
        return false;
    }
  };
  
// Delete an advertiser
const RequestTodeleteAdvertiser = async (req, res) => {
    try {
        const advertiser = await Advertiser.findById(req.user.id);
        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }

        if (await hasUpcomingEvents(req.user.id, 'advertiser')) {
            res.status(200).json({ message: 'Cannot delete account now as you have upcoming events.' });
        } else {
            advertiser.deleteRequest = true;
            await advertiser.save;
            console.log(advertiser.deleteRequest);
            return res.status(200).json({ message: 'Request submitted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a seller
const RequestTodeleteSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        seller.deleteRequest = true;
        await seller.save;
        console.log(seller.deleteRequest);
        return res.status(200).json({ message: 'Request submitted successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a tourist
const RequestTodeleteTourist = async (req, res) => {
    try {
        const tourist = await Tourist.findById(req.user.id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        if (await hasUpcomingEvents(req.user.id, 'tourist')) {
           return res.status(200).json({ message: 'Cannot delete account now as you have upcoming events.' });
        } else {
            tourist.deleteRequest= true;
            await tourist.save;
            console.log(tourist.deleteRequest);
            return res.status(200).json({ message: 'Request submitted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a tour guide
const RequestTodeleteTourGuide = async (req, res) => {
    try {
        const tourGuide = await TourGuide.findById(req.user.id);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }

        if (await hasUpcomingEvents(req.user.id, 'tourGuide')) {
            return res.status(200).json({ message: 'Cannot delete account now as you have upcoming events.' });
        } else {
            tourGuide.deleteRequest = true;
            await tourGuide.save;
            console.log(tourGuide.deleteRequest);
            return res.status(200).json({ message: 'Request submitted successfully.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    RequestTodeleteAdvertiser,
    RequestTodeleteSeller,
    RequestTodeleteTourist,
    RequestTodeleteTourGuide
};