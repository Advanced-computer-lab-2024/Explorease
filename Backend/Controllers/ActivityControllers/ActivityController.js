const activityModel = require('../../Models/ActivityModels/Activity.js');
const activityCategoryModel = require('../../Models/ActivityModels/ActivityCategory.js')
const preferenceTagModel = require('../../Models/ActivityModels/PreferenceTags.js');
const Tourist = require('../../Models/UserModels/Tourist.js');
const Booking = require('../../Models/ActivityModels/Booking.js');
// Create Activity
const createActivity = async (req, res) => {
    const { name, date, time, location, price, category, tags, specialDiscounts, bookingOpen, duration } = req.body;
    const createdBy = req.user.id; 

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
    const { id } = req.params;  // Get the activity ID from request parameters
    const { category, tags, ...updateData } = req.body;  // Extract category, tags, and other data to update

     // Log the request body

    try {
        // Find the activity by ID
        const activity = await activityModel.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found.' });
        }

        // Ensure the requester is the creator
        if (!activity.createdBy.equals(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to update this activity.' });
        }

        // If the category is provided, resolve its ID
        if (category) {
            const categoryDoc = await activityCategoryModel.findOne({ name: category });
            if (!categoryDoc) {
                return res.status(404).json({ message: 'Category not found.' });
            }
            updateData.category = categoryDoc._id;
        }

        // If tags are provided, resolve their IDs
        if (tags && tags.length > 0) {
            const tagDocs = await preferenceTagModel.find({ name: { $in: tags } });
            if (tagDocs.length !== tags.length) {
                return res.status(400).json({ message: 'One or more tags not found.' });
            }
            updateData.tags = tagDocs.map(tag => tag._id);
        }

        // Update the activity with the new data
        const updatedActivity = await activityModel.findByIdAndUpdate(id, updateData, { new: true });

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
        if (!activity.createdBy.equals(req.user.id)) {
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

const deleteActivitiesByAdvertiserId = async (req, res) => {
    const { id } = req.params; // Extract advertiser ID from request parameters

    try {
        // Find and delete all activities related to the advertiser
        const result = await Activity.deleteMany({ createdBy: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No activities found for this advertiser' });
        }

        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} activities for advertiser ${id}` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activities', error: error.message });
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

const filterSortSearchActivitiesByAdvertiser = async (req, res) => {
    const { searchQuery, category, tag, minPrice, maxPrice, startDate, endDate, minRating, sortBy, order } = req.query;
    const advertiserid = req.user.id;


    console.log(advertiserid);
    // if(!advertiserid === createdBy) {
    //     return res.status(403).json({ message: 'Not authorized to view this activity.' });
    // }


    try {
        let query = { createdBy : advertiserid };
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

const bookActivity = async (req, res) => {
    const { activityId } = req.params;
    const touristId = req.user.id; // Assuming `req.user` is set by authentication middleware

    try {
        console.log(activityId);
        // Find the activity and tourist
        const activity = await activityModel.findById(activityId);
        const tourist = await Tourist.findById(touristId);

     
        if (!activity) {
            console.error(`Activity with ID ${activityId} not found`);
            return res.status(404).json({ message: 'Activity not found' });
        }
        if (!tourist) {
            console.error(`Tourist with ID ${touristId} not found`);
            return res.status(404).json({ message: 'Tourist not found' });
        }
        
        const { price } = activity;
        const { wallet } = tourist;

        // Check if tourist has sufficient balance
        if (wallet < price) {
            console.error(`Insufficient funds: Wallet has ${wallet}, but price is ${price}`);

            return res.status(400).json({ message: 'Insufficient balance in wallet' });
        }

        // Deduct the activity price from wallet
        tourist.wallet -= price;
        await tourist.save();

        // Set cancellation deadline to 48 hours before the activity date
        const activityDate = activity.date;
        const cancellationDeadline = new Date(activityDate.getTime() - 48 * 60 * 60 * 1000); // 48 hours before

        // Create the booking
        const newBooking = new Booking({
            Tourist: touristId,
            Activity: activityId,
            Status: 'Active',
            BookedAt: new Date(),
            CancellationDeadline: cancellationDeadline
        });
        await newBooking.save();

        res.status(201).json({
            message: 'Booking successful',
            booking: newBooking,
            walletBalance: tourist.wallet
        });
    } catch (error) {
        console.error('Error during booking:', error);
        res.status(500).json({ message: 'Error processing booking', error: error.message });
    }
};

const getActivityById = async (req, res) => {
    const { id } = req.params;

    try {
        const activity = await activityModel.findById(id);
        
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json(activity);
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ message: 'Error fetching activity', error: error.message });
    }
};

module.exports = {
    getActivityById,
    bookActivity,
    createActivity,
    readActivities,
    getAllActivity,
    updateActivity,
    deleteActivity,
    filterSortSearchActivities,
    filterSortSearchActivitiesByAdvertiser,
    deleteActivitiesByAdvertiserId
    
};
