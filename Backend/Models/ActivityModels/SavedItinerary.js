// models/SavedItinerary.js
const mongoose = require('mongoose');

const SavedItinerarySchema = new mongoose.Schema({
    tourist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true,
    },
    itineraries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Itinerary',
        },
    ],
});

module.exports = mongoose.model('SavedItineraries', SavedItinerarySchema);
