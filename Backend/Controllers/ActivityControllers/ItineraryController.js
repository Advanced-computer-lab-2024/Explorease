const ItineraryModel = require('../../Models/ActivityModels/Itinerary');
const preferenceTagModel = require('../../Models/ActivityModels/PreferenceTags');
const ActivityModel = require('../../Models/ActivityModels/Activity');
const { default: mongoose } = require('mongoose');

// Create Itinerary
const createItinerary = async (req, res) => {
    const { name, activities, timeline, LanguageOfTour, AvailableDates, AvailableTimes, accessibility, PickUpLocation, DropOffLocation, tags } = req.body;
    const createdBy = req.user.id; // Assume req.user is set by authentication middleware
    const languageArray = Array.isArray(LanguageOfTour) ? LanguageOfTour : [LanguageOfTour]; // Ensure LanguageOfTour is an array
    const tourGuideConvenienceFee = 50; // You can adjust this to your needs

    try {
        if (!activities || !LanguageOfTour || !AvailableDates || !AvailableTimes || !PickUpLocation || !DropOffLocation) {
            return res.status(400).json({ message: 'All fields (activities, LanguageOfTour, AvailableDates, AvailableTimes, PickUpLocation, DropOffLocation) are required.' });
        }

        // Ensure the activities exist and sum up their prices
        const activityDocs = await ActivityModel.find({ _id: { $in: activities } });
        if (!activityDocs || activityDocs.length !== activities.length) {
            return res.status(400).json({ message: 'One or more activities not found.' });
        }

        // Calculate total price by summing up the price of each activity and adding the tour guide convenience fee
        const totalPrice = activityDocs.reduce((sum, activity) => sum + activity.price, 0) + tourGuideConvenienceFee;

        // Convert tag names to their corresponding IDs
        const tagDocs = await preferenceTagModel.find({ name: { $in: tags } });
        if (!tagDocs || tagDocs.length !== tags.length) {
            return res.status(400).json({ message: 'One or more tags not found.' });
        }

        // Create the new itinerary
        const itinerary = new ItineraryModel({
            name, 
            activities,
            timeline,
            LanguageOfTour: languageArray,
            totalPrice, // Calculated total price
            AvailableDates,
            AvailableTimes,
            accessibility,
            PickUpLocation,
            DropOffLocation,
            createdBy,
            tags: tagDocs.map(tag => tag._id) // Save the tag IDs
        });

        await itinerary.save();
        res.status(201).json({ message: 'Itinerary created successfully', itinerary });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Itinerary', error: error.message });
    }
};



// Read Itineraries by tour guide ID
const readItinerary = async (req, res) => {
    const tourguideId = req.user.id;

    try {
        const itineraries = await ItineraryModel.find({ createdBy: tourguideId }).populate('tags activities createdBy BookedBy');
        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found' });
        }
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
    }
};

// Get All Itineraries
const getAllItinerary = async (req, res) => {
    try {
        const itineraries = await ItineraryModel.find({}).populate('tags activities createdBy BookedBy');
        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found' });
        }
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
    }
};

// Update Itinerary
const updateItinerary = async (req, res) => {
    const { id } = req.params;
    const { tags, ...updateData } = req.body; // Extract tags and other update data

    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!itinerary.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to update this Itinerary' });
        }

        // If tags are provided, convert tag names to their corresponding IDs
        if (tags && tags.length > 0) {
            const tagDocs = await preferenceTagModel.find({ name: { $in: tags } });
            if (tagDocs.length !== tags.length) {
                return res.status(400).json({ message: 'One or more tags not found.' });
            }
            updateData.tags = tagDocs.map(tag => tag._id); // Add valid tag IDs to the update data
        }

        const updatedItinerary = await ItineraryModel.findByIdAndUpdate(id, updateData, { new: true }).lean();

        res.status(200).json({ message: 'Itinerary updated successfully', updatedItinerary });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Itinerary', error: error.message });
    }
};


// Delete Itinerary
const deleteItinerary = async (req, res) => {
    const { id } = req.params;

    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!itinerary.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this Itinerary' });
        }
        await ItineraryModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Itinerary', error: error.message });
    }
};

// // Sort Itinerary by Price
// const sortItineraryByPrice = async (req, res) => {
//     try {
//         const sortedItineraries = await ItineraryModel.find().sort({ price: 1 }).populate('tags')  // 1 for ascending order
//         res.status(200).json(sortedItineraries);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch and sort itineraries by price', err: err.message });
//     }
// };

// // Sort Itinerary by Rating
// const sortItineraryByRating = async (req, res) => {
//     try {
//         const sortedItineraries = await ItineraryModel.find().sort({ rating: -1 }).populate('tags');  // -1 for descending order
//         res.status(200).json(sortedItineraries);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch and sort itineraries by rating', err: err.message });
//     }
// };

const searchItinerariesByNameOrCategoryOrTag = async (req, res) => {
    const { name, category, tag } = req.query;

    try {
        // Build the query object based on the search parameters
        const query = {};

        // If a name is provided, search by itinerary name (case-insensitive)
        if (name) {
            query.name = new RegExp(name, 'i');  // 'i' for case-insensitive search
        }

        // Fetch itineraries with activities populated for further filtering
        let itineraries = await ItineraryModel.find(query)
            .populate({
                path: 'activities',
                populate: {
                    path: 'category tags',  // Populate activity category and tags
                }
            });

        // If a category is provided, filter itineraries based on activities' categories
        if (category) {
            itineraries = itineraries.filter(itinerary =>
                itinerary.activities.some(activity => activity.category && activity.category.name === category)
            );
        }

        // If a tag is provided, filter itineraries based on activities' tags
        if (tag) {
            itineraries = itineraries.filter(itinerary =>
                itinerary.activities.some(activity =>
                    activity.tags.some(t => t.name === tag)
                )
            );
        }

        // If no itineraries found, return a 404 message
        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found matching the search criteria.' });
        }

        // Return the filtered itineraries
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error searching itineraries', error: error.message });
    }
};

const filterUpcomingItineraries = async (req, res) => {
    const { minPrice, maxPrice, minDate, maxDate, preferences, languages } = req.query;

    try {
        // Step 1: Build the base query for upcoming itineraries
        let query = {};

        // Step 2: Add price filtering using totalPrice
        if (minPrice || maxPrice) {
            query.totalPrice = {};
            if (minPrice) query.totalPrice.$gte = Number(minPrice);
            if (maxPrice) query.totalPrice.$lte = Number(maxPrice);
        }

        // Step 3: Add date range filtering
        if (minDate || maxDate) {
            query.AvailableDates = {};
            if (minDate) query.AvailableDates.$gte = new Date(minDate);
            if (maxDate) query.AvailableDates.$lte = new Date(maxDate);
        }

        // Step 4: Filter by preferences (tags)
        if (preferences) {
            const tagIds = await preferenceTagModel.find({ name: { $in: preferences.split(',') } }).select('_id');
            if (tagIds.length > 0) {
                query.tags = { $in: tagIds.map(tag => tag._id) };
            }
        }

        // Step 5: Filter by languages
        if (languages) {
            query.LanguageOfTour = { $in: languages.split(',') };
        }

        // Step 6: Fetch the itineraries matching the query
        let itineraries = await ItineraryModel.find(query).populate('activities tags');

        // Step 7: If no itineraries match the filters, return a 404
        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found matching the filter criteria.' });
        }

        // Step 8: Return the filtered itineraries
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering itineraries', error: error.message });
    }
};

const sortItineraries = async (req, res) => {
    const { sortBy , order } = req.query;  // Sort by 'price' or 'ratings'
    const sortOrder = order === 'desc' ? -1 : 1;  // Default is ascending, set to -1 for descending

    try {
        let itineraries;
        
        if (sortBy === 'price') {
            // Sort itineraries by totalPrice (ascending)
            itineraries = await ItineraryModel.find()
                .sort({ totalPrice: sortOrder }) 
                .populate('activities tags');
        } else if (sortBy === 'ratings') {
            // Sort itineraries by the average rating of their activities (descending)
            itineraries = await ItineraryModel.aggregate([
                {
                    $lookup: {
                        from: 'activities',  // activities collection
                        localField: 'activities',
                        foreignField: '_id',
                        as: 'activityDetails'
                    }
                },
                {
                    $addFields: {
                        avgRating: { $avg: '$activityDetails.ratings' }  // Calculate average rating
                    }
                },
                {
                    $sort: { avgRating: sortOrder }  // Sort by average rating in descending order
                }
            ]);
        } else {
            return res.status(400).json({ message: 'Invalid sortBy value. Use "price" or "ratings".' });
        }

        // If no itineraries found, return 404
        if (!itineraries || itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found.' });
        }

        // Return sorted itineraries
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error sorting itineraries', error: error.message });
    }
};


module.exports = {
    createItinerary,
    readItinerary,
    getAllItinerary,
    updateItinerary,
    deleteItinerary,
    searchItinerariesByNameOrCategoryOrTag,
    filterUpcomingItineraries,
    sortItineraries
};
