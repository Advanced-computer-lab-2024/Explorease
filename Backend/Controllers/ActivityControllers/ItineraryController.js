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
        // 1. Fetch the itinerary by ID
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // 2. Check if the user is authorized to update this itinerary
        if (!itinerary.createdBy.equals(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to update this Itinerary' });
        }

        // 3. Handle tags if provided
        if (tags && tags.length > 0) {
            const tagDocs = await preferenceTagModel.find({ _id: { $in: tags } }); // Use _id instead of name
            if (!tagDocs || tagDocs.length !== tags.length) {
                return res.status(400).json({ message: 'One or more tags not found.' });
            }
            updateData.tags = tagDocs.map(tag => tag._id);
        }
        
        

        // 4. Perform the update with validated data
        const updatedItinerary = await ItineraryModel.findByIdAndUpdate(id, updateData, { new: true }).lean();

        // 5. Return a success response
        res.status(200).json({ message: 'Itinerary updated successfully', updatedItinerary });
    } catch (error) {
        // Log the error for debugging
        console.error('Error updating itinerary:', error);

        // Return an error response
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
        if (!itinerary.createdBy.equals(req.user.id)) {
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

const filterSortSearchItineraries = async (req, res) => {
    try {
        const {
            searchQuery,
            minPrice,
            maxPrice,
            startDate,
            endDate,
            minRating,
            language,
            tags,
            sortBy,
            order,
            accessibility
        } = req.query;

        // Initialize query object
        let query = {};

        // Search by name
        if (searchQuery) {
            query.name = { $regex: searchQuery, $options: 'i' };  // Case-insensitive search
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.totalPrice = {};
            if (minPrice) query.totalPrice.$gte = parseFloat(minPrice);  // Minimum price
            if (maxPrice) query.totalPrice.$lte = parseFloat(maxPrice);  // Maximum price
        }

        // Filter by available date range
        if (startDate || endDate) {
            query.AvailableDates = {};
            if (startDate) query.AvailableDates.$gte = new Date(startDate);  // Start date
            if (endDate) query.AvailableDates.$lte = new Date(endDate);  // End date
        }

        // Filter by minimum rating (Assuming itinerary has a rating field)
        if (minRating) {
            query.ratings = { $gte: parseFloat(minRating) };
        }

        // Filter by accessibility (Exact match required)
        if (accessibility) {
            query.accessibility = accessibility;
        }

        // Use regex for partial match on tags (if you want partial matching)
        if (tags) {
                      // Split the tag names, assuming they are comma-separated
                      const tagNames = tags.split(',').map(tag => tag.trim());

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

        if(language){
            query.LanguageOfTour = { $in: [language] };
        }

        // Sorting logic
        let sortField;
        if (sortBy === 'price') {
            sortField = 'totalPrice'; // Sort by total price of itinerary
        } else if (sortBy === 'ratings') {
            sortField = 'ratings';  // Sort by rating (ensure this field exists in the schema)
        } else {
            sortField = 'totalPrice'; // Default sort by price
        }
        const sortOrder = order === 'desc' ? -1 : 1;  // Ascending or Descending order

        // Execute query with filters, search, and sort
        const itineraries = await ItineraryModel.find(query)
            .populate('tags')  // Assuming tags are populated
            .populate('createdBy')  // Populate the Tour Guide who created the itinerary
            .sort({ [sortField]: sortOrder });  // Sort by the field (price or ratings)

        // Check if any itineraries match the criteria
        if (!itineraries.length) {
            return res.status(404).json({ message: 'No itineraries found with the given criteria.' });
        }

        // Return the found itineraries
        res.status(200).json(itineraries);

    } catch (error) {
        // Handle errors and send the response
        res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
    }
};

module.exports = {
    createItinerary,
    readItinerary,
    getAllItinerary,
    updateItinerary,
    deleteItinerary,
    filterSortSearchItineraries
};