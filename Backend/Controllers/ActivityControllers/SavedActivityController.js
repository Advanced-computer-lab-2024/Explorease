const Tourist = require('../../Models/UserModels/Tourist');
const Activity = require('../../Models/ActivityModels/Activity');
const SavedActivity = require('../../Models/ActivityModels/SavedActivity');

// Save an activity to the user's saved list
const saveActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.activityId);
        if (!activity) {
            return res.status(404).json({ msg: 'Activity not found' }); // Add `return` here
        }

        let savedActivity = await SavedActivity.findOne({ tourist: req.user.id });

        // Create a new SavedActivity document if not found
        if (!savedActivity) {
            savedActivity = new SavedActivity({
                tourist: req.user.id,
                activities: [],
            });
        }

        // Check if the activity is already saved
        if (savedActivity.activities.includes(activity.id.toString())) {
            return res.status(400).json({ msg: 'Activity already saved' }); // Add `return` here
        }

        // Add the activity to the saved list
        savedActivity.activities.push(activity.id);
        await savedActivity.save();

        return res.status(200).json({
            msg: 'Activity saved successfully',
            activities: savedActivity.activities,
        });
    } catch (err) {
        console.error('Error in saveActivity:', err.message);
        return res.status(500).json({ error: 'Server Error' }); // Add `return` here
    }
};

// Fetch all saved activities for the user
const getSavedActivities = async (req, res) => {
    try {
        const savedActivity = await SavedActivity.findOne({ tourist: req.user.id }).populate('activities');

        // Return an empty list if no saved activities are found
        if (!savedActivity || savedActivity.activities.length === 0) {
            return res.status(200).json({ msg: 'No saved activities found', activities: [] }); // Return empty array instead of 404
        }

        return res.status(200).json({
            msg: 'Saved activities fetched successfully',
            activities: savedActivity.activities,
        });
    } catch (err) {
        console.error('Error in getSavedActivities:', err.message);
        return res.status(500).json({ error: 'Server Error' }); // Add `return` here
    }
};

// Remove an activity from the user's saved list
const deleteSavedActivity = async (req, res) => {
    try {
        const savedActivity = await SavedActivity.findOne({ tourist: req.user.id });

        if (!savedActivity) {
            return res.status(404).json({ msg: 'No saved activities found' }); // Add `return` here
        }

        // Check if the activity exists in the saved list
        const activityIndex = savedActivity.activities.findIndex(
            (act) => act.toString() === req.params.activityId
        );

        if (activityIndex === -1) {
            return res.status(400).json({ msg: 'Activity not saved' }); // Add `return` here
        }

        // Remove the activity from the list
        savedActivity.activities.splice(activityIndex, 1);
        await savedActivity.save();

        return res.status(200).json({
            msg: 'Activity removed from saved list',
            activities: savedActivity.activities,
        });
    } catch (err) {
        console.error('Error in deleteSavedActivity:', err.message);
        return res.status(500).json({ error: 'Server Error' }); // Add `return` here
    }
};

module.exports = {
    saveActivity,
    getSavedActivities,
    deleteSavedActivity,
};
