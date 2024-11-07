const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const touristSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // The matching parameters are basic email validation.
    password: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    nationality: { type: String, required: true },
    dob: { type: Date, required: true, immutable: true },
    jobOrStudent: { type: String, required: true },
    wallet: { type: Number, default: 0 },
    preferences: { type: [String], default: [] }, // Array of preference tags for activities/ iteneraries
    loyaltyId: { type: Schema.Types.ObjectId, ref: 'Loyalty' }, // Reference to the loyalty record
    bookedActivities : [{type : Schema.Types.ObjectId , ref : 'Activity' }], 
    previousActivities : [{type : Schema.Types.ObjectId, ref : 'Activity'}], 
    bookedIteniraries : [{type : Schema.Types.ObjectId, ref : 'Itenirary'}], 
    deleteRequest : {type : Boolean , default : true , required: false},
    previousIteniraries : [{type : Schema.Types.ObjectId, ref : 'Itenirary'}], 
    bokedHistoricalPlace : [{type : Schema.Types.ObjectId , ref : 'HistoricalPlace'}],
    previousHistoricalPlace : [{type : Schema.Types.ObjectId, ref : 'HistoricalPlace'}]
}, { timestamps: true });

const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;