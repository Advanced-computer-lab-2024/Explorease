const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name : {type : String, required : true},
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    price: { type: Number, required: true },
    tags: { type: [String], required: false, default: [] },
    specialDiscounts: { type: String, required: true },
    bookingOpen: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Advertiser', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityCategory' }, 
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PreferenceTag' }]    ,
    ratings : {type : Number, required : false, default : 0, min : 0, max : 10},
    duration : {type : Number, required : true},
    isFlagged: { type: Boolean, default: false },
    subscribedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }],
}, { timestamps: true });

const Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;