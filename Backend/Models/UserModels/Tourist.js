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
    deleteRequest : {type : Boolean , default : false , required: false},
    previousIteniraries : [{type : Schema.Types.ObjectId, ref : 'Itenirary'}], 
    bookedHistoricalPlace : [{type : Schema.Types.ObjectId , ref : 'HistoricalPlace'}],
    previousHistoricalPlace : [{type : Schema.Types.ObjectId, ref : 'HistoricalPlace'}],
    promoCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' }],
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist',
    },
    deliveryAddresses: [
        {
            label: String, // Example: "Home", "Office"
            address: String, // Full address
            city: String,
            zipCode: String,
            country: String,
        }
    ],
}, { timestamps: true });

const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;