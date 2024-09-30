const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistoricalPlaceSchema = new Schema({
    Description: { type: String, required: true },
    Location: { type: String, required: true },
    OpeningHours: { type: String, required: true },
    ClosingHours: { type: String, required: true },
    TicketPrices: {
        foreigner: { type: Number, required: true },
        native: { type: Number, required: true },
        student: { type: Number, required: true }
    },
    Period: { type: String, required: true },
    Type: {
        type: String,
        required: true,
        enum: ['Monument', 'Museum', 'Religious Site', 'Palace/Castle'] // Restrict values to these types
    },
    tags: [{ type: String }],
    managedBy: { type: Schema.Types.ObjectId, ref: 'TourismGovernor', required: true }
}, { timestamps: true });

const HistoricalPlace = mongoose.model('HistoricalPlace', HistoricalPlaceSchema);
module.exports = HistoricalPlace;