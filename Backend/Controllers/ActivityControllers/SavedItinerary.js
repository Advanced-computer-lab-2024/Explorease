const Tourist = require('../../Models/UserModels/Tourist');
const Itinerary = require('../../Models/ActivityModels/Itinerary'); // Assuming this is your Itinerary model
const SavedItinerary = require('../../Models/ActivityModels/SavedItinerary'); // The new model

// Save an itinerary to the user's saved list
const saveItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.itineraryId);
        if (!itinerary) {
            return res.status(404).json({ msg: 'Itinerary not found' });
        }

        let savedItinerary = await SavedItinerary.findOne({ tourist: req.user.id });

        // Create a new SavedItinerary document if not found
        if (!savedItinerary) {
            savedItinerary = new SavedItinerary({
                tourist: req.user.id,
                itineraries: [],
            });
        }

        // Check if the itinerary is already saved
        if (savedItinerary.itineraries.includes(itinerary.id.toString())) {
            return res.status(400).json({ msg: 'Itinerary already saved' });
        }

        // Add the itinerary to the saved list
        savedItinerary.itineraries.push(itinerary.id);
        await savedItinerary.save();

        return res.status(200).json({
            msg: 'Itinerary saved successfully',
            itineraries: savedItinerary.itineraries,
        });
    } catch (err) {
        console.error('Error in saveItinerary:', err.message);
        return res.status(500).json({ error: 'Server Error' });
    }
};

// Fetch all saved itineraries for the user
const getSavedItineraries = async (req, res) => {
    try {
        const savedItinerary = await SavedItinerary.findOne({ tourist: req.user.id }).populate('itineraries');

        if (!savedItinerary || savedItinerary.itineraries.length === 0) {
            return res.status(200).json({ msg: 'No saved itineraries found', itineraries: [] });
        }

        return res.status(200).json({
            msg: 'Saved itineraries fetched successfully',
            itineraries: savedItinerary.itineraries,
        });
    } catch (err) {
        console.error('Error in getSavedItineraries:', err.message);
        return res.status(500).json({ error: 'Server Error' });
    }
};

// Remove an itinerary from the user's saved list
const deleteSavedItinerary = async (req, res) => {
    try {
        const savedItinerary = await SavedItinerary.findOne({ tourist: req.user.id });

        if (!savedItinerary) {
            return res.status(404).json({ msg: 'No saved itineraries found' });
        }

        const itineraryIndex = savedItinerary.itineraries.findIndex(
            (it) => it.toString() === req.params.itineraryId
        );

        if (itineraryIndex === -1) {
            return res.status(400).json({ msg: 'Itinerary not saved' });
        }

        // Remove the itinerary from the list
        savedItinerary.itineraries.splice(itineraryIndex, 1);
        await savedItinerary.save();

        return res.status(200).json({
            msg: 'Itinerary removed from saved list',
            itineraries: savedItinerary.itineraries,
        });
    } catch (err) {
        console.error('Error in deleteSavedItinerary:', err.message);
        return res.status(500).json({ error: 'Server Error' });
    }
};

module.exports = {
    saveItinerary,
    getSavedItineraries,
    deleteSavedItinerary,
};
