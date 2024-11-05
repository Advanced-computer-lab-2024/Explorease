const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingItinerarySchema = new Schema({
    Tourist: { type: Schema.Types.ObjectId, ref: 'Tourist', required: true },
    Itinerary: { type: Schema.Types.ObjectId, ref: 'Itinerary', required: true },
    Status: { type: String, enum: ['Active', 'Cancelled'], default: 'Cancelled' },
    BookedAt: { type: Date, default: Date.now, required: true },
    CancellationDeadline: { type: Date, required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
}, { timestamps: true });

const BookingItinerary = mongoose.model('BookingItinerary', BookingItinerarySchema);
module.exports = BookingItinerary;
