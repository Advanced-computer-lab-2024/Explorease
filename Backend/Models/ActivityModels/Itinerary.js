const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItinerarySchema = new Schema({
    name : {type : String, required : true},
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity', required: true }],
    timeline: { type: [Date], required: true },  // Start/end time for each activity
    LanguageOfTour: { type: [String], required: true },
    totalPrice: { type: Number, required: true }, // Will be calculated by summing activity prices and adding tour guide fee
    AvailableDates: { type: [Date], required: true },
    AvailableTimes: { type: [String], required: true },
    accessibility: { type: String, required: true },
    PickUpLocation: { type: String, required: true },
    DropOffLocation: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'TourGuide', required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'PreferenceTag' }],
    BookedBy: { type: Schema.Types.ObjectId, ref: 'Tourist', default: null }, // Null when not booked
}, { timestamps: true });


const Itinerary = mongoose.model('Itinerary', ItinerarySchema);
module.exports = Itinerary;