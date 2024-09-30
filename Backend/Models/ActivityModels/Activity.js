const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'ActivityCategory', required: true },
    tags: { type: [String], required: true, default: [] },
    specialDiscounts: { type: String, required: true },
    bookingOpen: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Advertiser', required: true },
    tags : {type : Schema.Types.ObjectId, ref : 'PreferenceTags'}
}, { timestamps: true });

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;