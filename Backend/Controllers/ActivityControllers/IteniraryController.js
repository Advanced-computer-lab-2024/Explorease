const IteniraryModel = require('../../Models/ActivityModels/Itenirary');
const { default: mongoose } = require('mongoose');


const createItenirary = async(req, res) => {
    const { activities, locations, timeline, durationOfEachActivity, LanguageOfTour, price, AvailableDates, AvailableTimes, accesibility, PickUpLocation, DropOffLocation } = req.body;
    const createdBy = req.user._id; // Assume req.user is set by authentication middleware

    try {
        const Itenirary = new IteniraryModel({ activities, locations, timeline, durationOfEachActivity, LanguageOfTour, price, AvailableDates, AvailableTimes, accesibility, PickUpLocation, DropOffLocation });
        await Itenirary.save();
        res.status(201).json({ message: 'Itenirary created successfully', Itenirary });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Itenirary', error });
    }
};


const readItenirary = async(req, res) => {

    const tourguideId = req.body._id;
    try {
        const Itenirary = await IteniraryModel.find({ createdBy: tourguideId });
        if (Itenirary.length === 0) {
            return res.status(404).json({ message: 'No Itenirary found' });
        }
        res.status(200).json(Itenirary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Itenirary', error });
    }
};

const updateItenirary = async(req, res) => {
    const id = req.params.id;
    const update = req.body;

    try {
        const Itenirary = await IteniraryModel.findById(id);
        if (!Itenirary) {
            return res.status(404).json({ message: 'Itenirary not found' });
        }
        if (!Itenirary.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to update this Itenirary' });
        }
        const updatedItenirary = await IteniraryModel.findByIdAndUpdate(id, update, { new: true });
        res.status(200).json({ message: 'Itenirary updated successfully', updatedItenirary });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Itenirary', error });
    }

};


const deleteItenirary = async(req, res) => {
    const _id = req.params.id;
    try {
        const Itenirary = await IteniraryModel.findById(_id);
        if (!Itenirary) {
            return res.status(404).json({ message: 'Itenirary not found' });
        }
        if (!Itenirary.createdBy.equals(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this Itenirary' });
        }
        const deletedItenirary = await IteniraryModel.findByIdAndDelete(_id);
        res.status(200).json({ message: 'Itenirary deleted successfully', deletedItenirary });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Itenirary', error });
    }


};

const sortIteniraryByPrice = async (req,res) =>{
    try {
        // Fetch all itineraries and sort them by price (ascending)
        const sortedItineraries = await IteniraryModel.find().sort({ price: 1 }).lean();  // 1 for ascending order

        // Return the sorted itineraries
        res.status(200).json(sortedItineraries);
    } catch (err) {
        console.error("Error fetching and sorting itineraries by price:", err);
        res.status(500).json({ error: "Failed to fetch and sort itineraries." });
    }
};
const sortIteniraryByRating = async (req,res) =>{
    try {
        // Fetch all itineraries and sort them by price (ascending)
        const sortedItineraries = await IteniraryModel.find().sort({rating: -1 }).lean();  // -1 for decending order (higher first)

        // Return the sorted itineraries
        res.status(200).json(sortedItineraries);
    } catch (err) {
        console.error("Error fetching and sorting itineraries by rating:", err);
        res.status(500).json({ error: "Failed to fetch and sort itineraries." });
    }
}



module.exports = { createItenirary, readItenirary, updateItenirary, deleteItenirary ,sortIteniraryByPrice,sortIteniraryByRating};