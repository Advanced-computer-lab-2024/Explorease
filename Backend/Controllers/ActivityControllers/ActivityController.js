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

//get all activity
const getAllActivity = async(req, res) => {
    try {
        const getAllActivity = await activityModel.find({});
        if (getAllActivity.length === 0) {
            return res.status(404).json({ message: 'No activities found' });
        }
        res.status(200).json(getAllActivity);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching activities', error })
    }
}

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

module.exports = { createActivity, readActivities, getAllActivity, updateActivity, deleteActivity };