const HistoricalPlaceModel = require('../../Models/ActivityModels/HistoricalPlace');
const { default: mongoose } = require('mongoose');

const createHistoricalPlace = async(req, res) => {
    const { Name, Description, Location, OpeningHours, ClosingHours, TicketPrices, Period, Type, managedBy, tags } = req.body;
    try {
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
            tags
        });
        res.status(200).json(historicalPlace);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTicketPrice = async(req, res) => {
    const { placeId, touristType } = req.query; // touristType is passed in the query params (e.g., 'foreigner', 'native', or 'student')

    try {
        const historicalPlace = await HistoricalPlaceModel.findById(placeId);

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
        res.status(500).json({ message: 'Error fetching ticket price', error });
    }
};

const getHistoricalPlacesByType = async(req, res) => {
    const { type } = req.query;
    try {
        const historicalPlaces = await HistoricalPlaceModel.find({ Type: type });
        res.status(200).json(historicalPlaces);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const getHistoricalPlaces = async(req, res) => {
    //retrieve all users from the database
    try {
        const HistoricalPlaces = await HistoricalPlaceModel.find({});
        res.status(200).json(HistoricalPlaces);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }


}

const updateHistoricalPlace = async(req, res) => {
    const id = req.params.id;
    const update = req.body;

    try {
        const updatedHistoricalPlace = await HistoricalPlaceModel.findByIdAndUpdate(id, update, { new: true });
        if (!updatedHistoricalPlace) {
            return res.status(404).json({ message: 'Historical Place not found' });
        }
        res.status(200).json({ message: 'Historical Place updated successfully', updatedHistoricalPlace });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Historical Place', error });
    }
};


const deleteHistoricalPlace = async(req, res) => {
    const _id = req.body;
    try {
        const deletedHistoricalPlace = await HistoricalPlaceModel.findByIdAndDelete(_id);
        if (!deletedHistoricalPlace) {
            return res.status(404).json({ message: 'Historical Place not found' });
        }
        res.status(200).json({ message: 'Historical Place deleted successfully', deletedHistoricalPlace });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Historical Place', error });
    }
};



module.exports = { createHistoricalPlace, getHistoricalPlaces, updateHistoricalPlace, deleteHistoricalPlace, getHistoricalPlacesByType, getTicketPrice };