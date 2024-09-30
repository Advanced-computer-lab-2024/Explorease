const activityModel = require('../../Models/ActivityModels/Activity.js');

// Create Activity
const createActivity = async(req, res) => {
    const { date, time, location, price, category, tags, specialDiscounts, bookingOpen } = req.body;
    const createdBy = req.user._id; // Assume req.user is set by authentication middleware

    try {
        const activity = new activityModel({ date, time, location, price, category, tags, specialDiscounts, bookingOpen, createdBy });
        await activity.save();
        res.status(201).json({ message: 'Activity created successfully', activity });
    } catch (error) {
        res.status(500).json({ message: 'Error creating activity', error });
    }
};

// Read Activities
const readActivities = async(req, res) => {
    const advertiserId = req.body._id; // Assuming you have the advertiser's ID in the request
    try {
        const activities = await activityModel.find({ createdBy: advertiserId });
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found' });
        }
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error });
    }
};

// Update Activity
const updateActivity = async(req, res) => {
    const id = req.params.id; // Get the ID from request parameters
    const update = req.body;

    try {
        const activity = await activityModel.findById(id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Ensure the requester is the creator
        if (!activity.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to update this activity' });
        }

        // Check if booking is open
        if (!activity.bookingOpen) {
            return res.status(403).json({ message: 'Cannot update activity as booking is closed' });
        }

        const updatedActivity = await activityModel.findByIdAndUpdate(id, update, { new: true });
        res.status(200).json({ message: 'Activity updated successfully', updatedActivity });
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error });
    }
};


// Delete Activity
const deleteActivity = async(req, res) => {
    const id = req.params.id; // Get the ID from request parameters

    try {
        const activity = await activityModel.findById(id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Ensure the requester is the creator
        if (!activity.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this activity' });
        }

        // Check if booking is open
        if (!activity.bookingOpen) {
            return res.status(403).json({ message: 'Cannot delete activity as booking is closed' });
        }

        await activityModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity', error });
    }
};


// Filter Activity using Budget
const filterUpcomingActivityByBudget = async (req, res) => {
    const { budget } = req.body;

    try {
        const currentDate = new Date(); 
        const activities = await activityModel.find({ date: { $gte: currentDate }, price: { $lte: budget }});

        if (activities.length === 0) {
            return res.status(404).json({ message: 'There are no upcoming activities found within the specified budget.' });
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities by budget', error });
    }
};


// Filter Activities by Date
const filterUpcomingActivityByDate = async (req, res) => {
    const { date } = req.body; 

    try {
        const selectedDate = new Date(date);
        const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0)); 
        const endOfDay = new Date(selectedDate.setUTCHours(23, 59, 59, 999)); 

        const activities = await activityModel.find({ date: { $gte: startOfDay, $lt: endOfDay } });

        if (activities.length === 0) {
            return res.status(404).json({ message: 'There are no activities found on that specified date.' });
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities by date', error });
    }
};




module.exports = { createActivity, readActivities, updateActivity, deleteActivity, filterUpcomingActivityByBudget, filterUpcomingActivityByDate };