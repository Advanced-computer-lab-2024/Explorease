const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourismGovernorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    managedHistoricalPlaces: [{ type: Schema.Types.ObjectId, ref: 'HistoricalPlace' }]
}, { timestamps: true });

const TourismGovernor = mongoose.model('TourismGovernor', tourismGovernorSchema);
module.exports = TourismGovernor;