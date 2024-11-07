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
    deleteRequest : {type : Boolean , default : true , required: false}, 
    createdItineraries: [{ type: Schema.Types.ObjectId, ref: 'Itinerary' }],
    documents: {
        ID : { type: String, required: false }, // URL or path to ID PDF
        Certificates: { type: String, required: false }, // URL or path to Certificate PDF
    },
    imageUrl : {type : String, required: false},
    canLogin : {type : Boolean , required : false, default : false},
    comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }, comment: String}],
    ratings : [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }, rating: Number}],
}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;