const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tourGuideSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Basic email validation
    password: { type: String, required: true },
    mobileNumber: { type: String, required: false },
    yearsOfExperience: { type: Number, required: false },
    previousWork: { type: String, required: false },
    isAccepted: { type: Boolean, default: false },
    createdItineraries: [{ type: Schema.Types.ObjectId, ref: 'Itinerary' }]
}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;