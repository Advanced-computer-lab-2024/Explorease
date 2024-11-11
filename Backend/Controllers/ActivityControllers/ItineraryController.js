const ItineraryModel = require('../../Models/ActivityModels/Itinerary');
const preferenceTagModel = require('../../Models/ActivityModels/PreferenceTags');
const ActivityModel = require('../../Models/ActivityModels/Activity');
const { default: mongoose } = require('mongoose');
const BookingItinerary = require('../../Models/ActivityModels/BookingItinerary');
const Tourist = require('../../Models/UserModels/Tourist');

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
        const isActivated = false;
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
            tags: tagDocs.map(tag => tag._id), // Save the tag IDs
            isActivated
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
//this method to check if the itineraries are activated and not flagged
const getAllActivatedItinerary = async (req, res) => {
    try {
        const itineraries = await ItineraryModel.find({}).populate('tags activities createdBy BookedBy');
        const activatedItineraries = itineraries.filter(itinerary => itinerary.isActivated === true && itinerary.isFlagged === false);
        if (activateItinerary.length === 0) {
            return res.status(404).json({ message: 'No itineraries found' });
        }
        res.status(200).json(activatedItineraries);
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


// Flag Itinerary
const flagItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (itinerary.isFlagged === true) {
            return res.status(403).json({ message: 'Itinerary has already been flagged' });
        }
        itinerary.isFlagged = true;
        await itinerary.save();
        res.status(200).json({ message: 'Itinerary flagged successfully', isFlagged: true });
    } catch (error) {
        res.status(500).json({ message: 'Error flagging itinerary', error: error.message });
    }
};

// Unflag Itinerary
const unflagItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (itinerary.isFlagged === false) {
            return res.status(403).json({ message: 'Itinerary has already been unflagged' });
        }
        itinerary.isFlagged = false;
        await itinerary.save();
        res.status(200).json({ message: 'Itinerary unflagged successfully', isFlagged: false });
    } catch (error) {
        res.status(500).json({ message: 'Error unflagging itinerary', error: error.message });
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
        if(itinerary.BookedBy.length > 0){
            return res.status(403).json({ message: 'Itinerary has been booked by user(s) and cannot be deleted' });
        }
        await ItineraryModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Itinerary', error: error.message });
    }
};


const deleteItinerariesByTourGuideId = async (req, res) => {
    const { tourGuideId } = req.params;

    try {
        // Find all itineraries created by the tour guide with the given ID
        const itineraries = await ItineraryModel.find({ createdBy: tourGuideId });

        if (!itineraries || itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found for this tour guide' });
        }

        // Filter itineraries to check if any have been booked
        const bookedItineraries = itineraries.filter(itinerary => itinerary.BookedBy.length > 0);
        
        if (bookedItineraries.length > 0) {
            return res.status(403).json({ 
                message: `Cannot delete itineraries. ${bookedItineraries.length} itinerary(ies) have been booked by user(s) and cannot be deleted.` 
            });
        }

        // Delete unbooked itineraries created by the tour guide
        await ItineraryModel.deleteMany({ createdBy: tourGuideId, BookedBy: { $size: 0 } });
        
        res.status(200).json({ message: `Unbooked itineraries for tour guide ${tourGuideId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting itineraries', error: error.message });
    }
};

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

const activateItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!itinerary.createdBy.equals(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to activate this Itinerary' });
        }
        if(itinerary.BookedBy !== null){
            return res.status(403).json({ message: 'Itinerary has been booked by user(s) and cannot be activated' });
        }
        itinerary.isActivated = true;
        await itinerary.save();
        res.status(200).json({ message: 'Itinerary activated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error activating Itinerary', error: error.message });
    }
};

const deactivateItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!itinerary.createdBy.equals(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to deactivate this Itinerary' });
        }
        itinerary.isActivated = false;
        await itinerary.save();
        res.status(200).json({ message: 'Itinerary deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating Itinerary', error: error.message });
    }
};

const bookItinerary = async (req, res) => {
    const { itineraryId } = req.params;
    const touristId = req.user.id; // Assuming `req.user` is set by authentication middleware

    try {
        // Find the itinerary and tourist
        const itinerary = await ItineraryModel.findById(itineraryId);
        const tourist = await Tourist.findById(touristId);

        if (!itinerary) {
            console.error(`Itinerary with ID ${itineraryId} not found`);
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!tourist) {
            console.error(`Tourist with ID ${touristId} not found`);
            return res.status(404).json({ message: 'Tourist not found' });
        }

        const { totalPrice } = itinerary;
        const { wallet } = tourist;

        // Check if tourist has sufficient balance
        if (wallet < totalPrice) {
            console.error(`Insufficient funds: Wallet has ${wallet}, but itinerary price is ${totalPrice}`);
            return res.status(400).json({ message: 'Insufficient balance in wallet' });
        }

        // Deduct the itinerary price from wallet
        tourist.wallet -= totalPrice;
        await tourist.save();

        // Set cancellation deadline to 48 hours before the itinerary start date
        const itineraryStartDate = itinerary.AvailableDates[0];
        const cancellationDeadline = new Date(itineraryStartDate.getTime() - 48 * 60 * 60 * 1000); // 48 hours before

        // Create the booking
        const newBooking = new BookingItinerary({
            Tourist: touristId,
            Itinerary: itineraryId,
            Status: 'Active',
            BookedAt: new Date(),
            CancellationDeadline: cancellationDeadline
        });
        await newBooking.save();

        res.status(201).json({
            message: 'Itinerary booking successful',
            booking: newBooking,
            walletBalance: tourist.wallet
        });
    } catch (error) {
        console.error('Error during itinerary booking:', error);
        res.status(500).json({ message: 'Error processing itinerary booking', error: error.message });
    }
};

const getItineraryById = async (req, res) => {
    try {
      const { id } = req.params;
      const itinerary = await ItineraryModel.findById(id);
  
      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
  
      res.json(itinerary);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };


module.exports = {
    bookItinerary,
    createItinerary,
    readItinerary,
    getAllItinerary,
    updateItinerary,
    deleteItinerary,
    filterSortSearchItineraries,
    activateItinerary,
    deactivateItinerary,
    getAllActivatedItinerary,
    flagItinerary,
    unflagItinerary,
    deleteItinerariesByTourGuideId,
    getItineraryById
};
