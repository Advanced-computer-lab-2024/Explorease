const HistoricalPlaceModel = require('../../Models/ActivityModels/HistoricalPlace');
const preferenceTagModel = require('../../Models/ActivityModels/PreferenceTags')
const { default: mongoose } = require('mongoose');
const { searchActivitiesByNameOrCategoryOrTag } = require('./ActivityController');

// Create Historical Place
const createHistoricalPlace = async (req, res) => {
    const { Name, Description, Location, OpeningHours, ClosingHours, TicketPrices, Period, Type, tags } = req.body;
    const managedBy = req.user.id;

    try {
        // Validate required fields
        if (!Name || !Description || !Location || !OpeningHours || !ClosingHours || !TicketPrices || !Period || !Type) {
            return res.status(400).json({ message: 'All fields (Name, Description, Location, OpeningHours, ClosingHours, TicketPrices, Period, Type) are required.' });
        }

        // Find existing tags, or create new ones if they don't exist
        const tagDocs = await Promise.all(
            tags.map(async (tagName) => {
                let tag = await preferenceTagModel.findOne({ name: tagName });
                if (!tag) {
                    // Create the tag if it doesn't exist
                    tag = await preferenceTagModel.create({ name: tagName });
                }
                return tag;
            })
        );

        const historicalPlace = await HistoricalPlaceModel.create({
            Name,
            Description,
            Location,
            OpeningHours,
            ClosingHours,
            TicketPrices: {
                foreigner: TicketPrices.foreigner,
                native: TicketPrices.native,
                student: TicketPrices.student
            },
            Period,
            Type,
            managedBy,
            tags: tagDocs.map(tag => tag._id) // Save the tag IDs
        });

        res.status(201).json({ message: 'Historical Place created successfully', historicalPlace });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Historical Place', error: error.message });
    }
};



// Get Ticket Price for a Tourist Type
const getTicketPrice = async (req, res) => {
    const { placeId, touristType } = req.query; // touristType is passed in query params (e.g., 'foreigner', 'native', 'student')

    try {
        if (!placeId || !touristType) {
            return res.status(400).json({ message: 'Place ID and Tourist Type are required.' });
        }

        const historicalPlace = await HistoricalPlaceModel.findById(placeId).lean();
        if (!historicalPlace) {
            return res.status(404).json({ message: 'Historical Place not found' });
        }

        let price;
        switch (touristType) {
            case 'foreigner':
                price = historicalPlace.TicketPrices.foreigner;
                break;
            case 'native':
                price = historicalPlace.TicketPrices.native;
                break;
            case 'student':
                price = historicalPlace.TicketPrices.student;
                break;
            default:
                return res.status(400).json({ message: 'Invalid tourist type' });
        }

        res.status(200).json({ price });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket price', error: error.message });
    }
};

// Get Historical Places by Type
const getHistoricalPlacesByType = async (req, res) => {
    const { type } = req.query;

    try {
        if (!type) {
            return res.status(400).json({ message: 'Type is required.' });
        }

        const historicalPlaces = await HistoricalPlaceModel.find({ Type: type }).populate('tags');
        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found for this type.' });
        }

        res.status(200).json(historicalPlaces);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching historical places by type', error: error.message });
    }
};

// Get Historical Places created by a specific guide
const getHistoricalPlaceByGov = async (req, res) => {
    const govId  = req.user.id;  // Getting governor's ID from the logged-in user

    try {
        if (!govId) {
            return res.status(400).json({ message: 'Governor ID is required.' });
        }

        // Find historical places managed by the governor, using the managedBy field
        const historicalPlaces = await HistoricalPlaceModel.find({ managedBy: govId }).populate('tags');
        
        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found for this governor.' });
        }

        // Return the found historical places
        res.status(200).json(historicalPlaces);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching historical places', error: error.message });
    }
};


// Get all Historical Places
const getallHistoricalPlaces = async (req, res) => {
    try {
        const historicalPlaces = await HistoricalPlaceModel.find({}).populate('tags managedBy');
        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found.' });
        }
        res.status(200).json(historicalPlaces);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching historical places', error: error.message });
    }
};

// Update Historical Place
const updateHistoricalPlace = async (req, res) => {
    const { id } = req.params;
    const { tags, ...updateData } = req.body; // Extract tags and other update data

    try {
        // Validate the tags (if provided)
        if (tags && tags.length > 0) {
            const tagDocs = await preferenceTagModel.find({ name: { $in: tags } });
            if (tagDocs.length !== tags.length) {
                return res.status(400).json({ message: 'One or more tags not found.' });
            }
            updateData.tags = tagDocs.map(tag => tag._id); // Add valid tag IDs to the update data
        }

        // Update the historical place with new data
        const updatedHistoricalPlace = await HistoricalPlaceModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
        
        if (!updatedHistoricalPlace) {
            return res.status(404).json({ message: 'Historical Place not found.' });
        }

        res.status(200).json({ message: 'Historical Place updated successfully', updatedHistoricalPlace });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Historical Place', error: error.message });
    }
};

// Delete Historical Place
const deleteHistoricalPlace = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Historical Place ID is required for deletion.' });
        }

        const deletedHistoricalPlace = await HistoricalPlaceModel.findByIdAndDelete(id);
        if (!deletedHistoricalPlace) {
            return res.status(404).json({ message: 'Historical Place not found.' });
        }

        res.status(200).json({ message: 'Historical Place deleted successfully', deletedHistoricalPlace });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Historical Place', error: error.message });
    }
};

const filterSortSearchHistoricalPlaces = async (req, res) => {
    const { name, type, tag } = req.query;

    try {
        // Create a dynamic filter object
        let filter = {};

        // If a name is provided, search by name using regex for partial matches
        if (name) {
            filter.Name = { $regex: name, $options: 'i' }; // 'i' for case-insensitive search
        }

        // If a type is provided, search by type using regex
        if (type) {
            filter.Type = { $regex: type, $options: 'i' }; // Case-insensitive
        }

        // If a tag is provided, filter by tags
        if (tag && tag.length > 0) {
            const tagDocs = await preferenceTagModel.find({ name: { $in: tag.split(',') } });
            if (tagDocs.length > 0) {
                const tagIds = tagDocs.map(tag => tag._id);
                filter.tags = { $in: tagIds }; // Match historical places with any of these tag IDs
            }
        }

        // Fetch filtered and sorted historical places
        const historicalPlaces = await HistoricalPlaceModel.find(filter)
            .populate('tags managedBy')  // Populate tags and managedBy
         

        // If no places are found, return 404
        if (historicalPlaces.length === 0) {
            return res.status(404).json({ message: 'No historical places found.' });
        }

        // Return the list of filtered and sorted historical places
        res.status(200).json(historicalPlaces);

    } catch (error) {
        res.status(500).json({ message: 'Error filtering, sorting, or searching historical places', error: error.message });
    }
};


module.exports = {
    createHistoricalPlace,
    getHistoricalPlaceByGov,
    getallHistoricalPlaces,
    updateHistoricalPlace,
    deleteHistoricalPlace,
    getHistoricalPlacesByType,
    getTicketPrice,
    filterSortSearchHistoricalPlaces
};
