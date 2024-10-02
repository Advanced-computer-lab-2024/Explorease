const IteniraryModel = require('../../Models/ActivityModels/Itenirary');
const { default: mongoose } = require('mongoose');


const createItenirary = async(req, res) => {
    const { activities, locations, timeline, durationOfEachActivity, LanguageOfTour, price, AvailableDates, AvailableTimes, accesibility, PickUpLocation, DropOffLocation } = req.body;
    const createdBy = req.user._id; // Assume req.user is set by authentication middleware
    const languageArray = Array.isArray(LanguageOfTour) ? LanguageOfTour : [LanguageOfTour];
    try {
        const Itenirary = new IteniraryModel({ activities, locations, timeline, durationOfEachActivity, LanguageOfTour : languageArray, price, AvailableDates, AvailableTimes, accesibility, PickUpLocation, DropOffLocation, createdBy });
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

const getAllIteniarry = async(req, res) => {
    try {
        const getAllIteniarry = await IteniraryModel.find({});
        if (getAllIteniarry.length === 0) {
            return res.status(404).json({ message: 'No Itenirary found' });
        }
        res.status(200).json(getAllIteniarry);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching Itenirary', error })
    }
}

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



const FilterUpcomingItinerariesByDate = async (req, res) => {
    const { date } = req.body; 

    if (!date) {
        return res.status(400).json({ message: 'Date parameter is required' });
    }
    const filterDate = new Date(date);

    try {
        const itineraries = await IteniraryModel.find({
            AvailableDates: { $eq: filterDate }
        });

        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found for the specified date' });
        }

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error });
    }
};


const FilterUpcomingItinerariesByLanguage = async (req, res) => {
    const { language } = req.body; 

    if (!language) {
        return res.status(400).json({ message: 'Language parameter is required' });
    }

    try {
        const itineraries = await IteniraryModel.find({
            LanguageOfTour: { $in: [language] }  
        });

        if (itineraries.length === 0) {
            return res.status(404).json({ message: `No itineraries found for language: ${language}` });
        }

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error });
    }
};

const FilterUpcomingItinerariesByBudget = async (req, res) => {
    const { budget } = req.body;
   
    if (!budget) {
        return res.status(400).json({ message: 'Budget parameter is required' });
    }

    try {
        const itineraries = await IteniraryModel.find({
            price: { $lte: budget }
        });

        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found within the specified budget' });
        }
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error });
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





module.exports = { createItenirary, readItenirary, updateItenirary, deleteItenirary, FilterUpcomingItinerariesByDate, FilterUpcomingItinerariesByLanguage, FilterUpcomingItinerariesByBudget ,sortIteniraryByPrice, sortIteniraryByRating};
