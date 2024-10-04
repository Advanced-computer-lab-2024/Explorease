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


const sortActivity = async (req, res) => {
    try {
        const { sortBy, order } = req.query; // Get sorting field and order from query parameters

        // Set the default sorting field to price and order to ascending if not provided
        const sortField = sortBy || 'price';  // Default is 'price'
        const sortOrder = order === 'desc' ? -1 : 1;  // Default is ascending, set to -1 for descending

        // Ensure sortField is either 'price' or 'rating'
        if (!['price', 'ratings'].includes(sortField)) {
            return res.status(400).json({ message: 'Invalid sorting field. Use either "price" or "rating".' });
        }

        // Fetch and sort the activities
        const sortedActivities = await activityModel.find().sort({ [sortField]: sortOrder }).populate('category tags');

        res.status(200).json(sortedActivities);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch and sort activities.', err: err.message });
    }
};

const filterActivitiesByBudgetOrDateOrCategoryOrRating = async (req, res) => {
    try {
        const { minPrice, maxPrice, startDate, endDate, category, minRating } = req.query;

        // Build the query object
        let query = {};

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);  // Greater than or equal to minPrice
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);  // Less than or equal to maxPrice
        }

        // Filter by date range
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);  // Greater than or equal to startDate
            if (endDate) query.date.$lte = new Date(endDate);  // Less than or equal to endDate
        }

        // Filter by category (Assuming category is a string name)
        if (category) {
            const categoryDoc = await activityCategoryModel.findOne({ name: category });
            if (!categoryDoc) {
                return res.status(404).json({ message: 'Category not found' });
            }
            query.category = categoryDoc._id;  // Use category ObjectId for filtering
        }

        // Filter by rating (Assuming the Activity model has a 'rating' field)
        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };  // Greater than or equal to minRating
        }

        // Execute the query
        const activities = await activityModel.find(query).populate('category tags');

        if (!activities.length) {
            return res.status(404).json({ message: 'No activities found with the given criteria.' });
        }

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering activities', error: error.message });
    }
};

const searchActivitiesByNameOrCategoryOrTag = async (req, res) => {
    const { name, searchQuery, category, tag } = req.query;

    try {
        // Build the search criteria dynamically
        let searchCriteria = {};

        // If searchQuery is provided, search by name, location, or specialDiscounts using regex for partial matching
        if (searchQuery) {
            searchCriteria.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },  // Case-insensitive regex search for name
                { location: { $regex: searchQuery, $options: 'i' } },  // Case-insensitive regex search for location
                { specialDiscounts: { $regex: searchQuery, $options: 'i' } }  // Case-insensitive regex search for specialDiscounts
            ];
        }

        // If a category string is provided, resolve the category ID
        if (category) {
            const categoryDoc = await activityCategoryModel.findOne({ name: category });
            if (categoryDoc) {
                searchCriteria.category = categoryDoc._id;
            } else {
                return res.status(404).json({ message: 'Category not found.' });
            }
        }

        // If a tag string is provided, resolve the tag ID
        if (tag) {
            const tagDoc = await preferenceTagModel.findOne({ name: tag });
            if (tagDoc) {
                searchCriteria.tags = tagDoc._id;
            } else {
                return res.status(404).json({ message: 'Tag not found.' });
            }
        }

        if(name){
            const activityTmp = await activityModel.find({name : name});
            if(activityTmp){
                searchCriteria.name = name;
            }
        }
        // Fetch matching activities based on the built criteria
        const activities = await activityModel.find(searchCriteria)
            .populate('category')  // Populate the category field with ActivityCategory data
            .populate('tags')  // Populate the tags field with PreferenceTag data
            .exec();

        // If no activities found, return 404
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No activities found matching your criteria.' });
        }

        // Return the found activities
        res.status(200).json(activities);

    } catch (error) {
        console.error('Error searching for activities:', error);
        res.status(500).json({ message: 'Error occurred while searching for activities', error: error.message });
    }
};

module.exports = {
    createActivity,
    readActivities,
    getAllActivity,
    updateActivity,
    deleteActivity,
    sortActivity,
    searchActivitiesByNameOrCategoryOrTag,
    filterActivitiesByBudgetOrDateOrCategoryOrRating
};
