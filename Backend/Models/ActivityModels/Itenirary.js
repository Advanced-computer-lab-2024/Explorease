const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItenirarySchema = new Schema({
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    locations: { type: [String], required: true },
    timeline: { type: [Date], required: true },
    durationOfEachActivity: {type: [String], required: true },
    LanguageOfTour: { type: [String], required: true },
    price: { type: Number, required: true },
    AvailableDates: { type: [Date], required: true },
    AvailableTimes: { type: [String], required: true, },
    accesibility: { type: String, required: true,},
    PickUpLocation: { type: String,required: true },
    DropOffLocation: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'TourGuide', required: true }

}, { timestamps: true });

const Itenirary = mongoose.model('Itenirary', ItenirarySchema);
module.exports = Itenirary;