const activityModel = require('../../Models/ActivityModels/Activity.js');
const activityCategoryModel = require('../../Models/ActivityModels/ActivityCategory.js')
const preferenceTagModel = require('../../Models/ActivityModels/PreferenceTags.js');

// Create Activity
const createActivity = async (req, res) => {
    const { name, date, time, location, price, category, tags, specialDiscounts, bookingOpen, duration } = req.body;
    const createdBy = req.user._id; 

    try {
        // Check required fields
        if (!name || !date || !time || !location || !price || !category || !duration) {
            return res.status(400).json({ message: 'All fields (name, date, time, location, price, category, duration) are required.' });
        }

        // Convert category string to ObjectId
        const categoryDoc = await activityCategoryModel.findOne({ name: category });
        if (!categoryDoc) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Convert tag strings to ObjectIds
        const tagDocs = await preferenceTagModel.find({ name: { $in: tags } });
        if (!tagDocs || tagDocs.length !== tags.length) {
            return res.status(400).json({ message: 'One or more tags not found' });
        }

        // Create new activity with resolved category and tag ObjectIds
        const activity = new activityModel({
            name,
            date,
            time,
            location,
            price,
            category: categoryDoc._id,  // Save category as ObjectId
            tags: tagDocs.map(tag => tag._id),  // Save tags as an array of ObjectIds
            specialDiscounts,
            bookingOpen,
            createdBy, 
            duration
        });

        await activity.save();

        res.status(201).json({ message: 'Activity created successfully', activity });
    } catch (error) {
        res.status(500).json({ message: 'Error creating activity', error: error.message });
    }
};


// Read Activities (by Advertiser ID)
const readActivities = async (req, res) => {
    const advertiserId = req.user.id; 
    try {
        if (!advertiserId) {
            return res.status(400).json({ message: 'Advertiser ID is required.' });
        }
        
        const activities = await activityModel.find({ createdBy: advertiserId }).populate('category').populate('tags');
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found.' });
        }
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
};

// Get All Activities
const getAllActivity = async (req, res) => {
    try {
        const activities = await activityModel.find({}).populate('category').populate('tags');
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found.' });
        }
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
};

// Update Activity
const updateActivity = async (req, res) => {
    const { id } = req.params; // Get the activity ID from request parameters
    const { category, tags, ...updateData } = req.body; // Extract category, tags, and other data to update

    try {
        // Find the activity by ID
        const activity = await activityModel.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found.' });
        }

        // Ensure the requester is the creator
        if (!activity.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to update this activity.' });
        }

        // Check if booking is open
        if (!activity.bookingOpen) {
            return res.status(403).json({ message: 'Cannot update activity as booking is closed.' });
        }

        // If the category is provided, find the corresponding category document
        if (category) {
            const categoryDoc = await activityCategoryModel.findOne({ name: category });
            if (!categoryDoc) {
                return res.status(404).json({ message: 'Category not found.' });
            }
            updateData.category = categoryDoc._id; // Update with the resolved category ID
        }

        // If tags are provided, find the corresponding tag documents
        if (tags && tags.length > 0) {
            const tagDocs = await preferenceTagModel.find({ name: { $in: tags } });
            if (tagDocs.length !== tags.length) {
                return res.status(400).json({ message: 'One or more tags not found.' });
            }
            updateData.tags = tagDocs.map(tag => tag._id); // Update with resolved tag IDs
        }

        // Update the activity with the new data
        const updatedActivity = await activityModel.findByIdAndUpdate(id, updateData, { new: true }).lean();

        res.status(200).json({ message: 'Activity updated successfully', updatedActivity });
    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error: error.message });
    }
};


// Delete Activity
const deleteActivity = async (req, res) => {
    const { id } = req.params; // Get the ID from request parameters

    try {
        const activity = await activityModel.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found.' });
        }

        // Ensure the requester is the creator
        if (!activity.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this activity.' });
        }

        // Check if booking is open
        if (!activity.bookingOpen) {
            return res.status(403).json({ message: 'Cannot delete activity as booking is closed.' });
        }

        await activityModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Activity deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity', error: error.message });
    }
};


const filterSortSearchActivities = async (req, res) => {
    const { searchQuery, category, tag, minPrice, maxPrice, startDate, endDate, minRating, sortBy, order } = req.query;

    try {
        let query = {};
        // Build query based on the received parameters

        if (searchQuery) {
            query.$or = [
            { name : {$regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { specialDiscounts: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        if (category) {
            const categoryDoc = await activityCategoryModel.findOne({ name: category });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            } else {
                return res.status(404).json({ message: 'Category not found' });
            }       
         }

         if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (tag) {
             // Split the tag names, assuming they are comma-separated
             const tagNames = tag.split(',').map(tag => tag.trim());

             // Find matching tag documents by their `name`
             const matchingTags = await preferenceTagModel.find({
                 name: { $in: tagNames }
             });
 
             if (matchingTags.length === 0) {
                 return res.status(404).json({ message: 'No matching tags found' });
             }
 
             // Extract the ObjectId of each matching tag
             const tagIds = matchingTags.map(tag => tag._id);
 
             // Use the ObjectId in the query to find itineraries with those tags
             query.tags = { $in: tagIds };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }
      
        if (minRating) {
            query.ratings = { $gte: minRating };
        }

        // Sorting logic
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        }

        // Fetch activities
        const activities = await activityModel.find(query).sort(sortOptions).populate('category tags');
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
};



module.exports = {
    createActivity,
    readActivities,
    getAllActivity,
    updateActivity,
    deleteActivity,
    filterSortSearchActivities
};
