const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const advertiserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // email validation
    password: { type: String, required: true },
    companyName: { type: String, required: false },
    websiteLink: { type: String, required: false, match: /^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,6}(\/[^\s]*)?$/ }, // Basic URL validation
    hotline: { type: String, required: false },
    companyProfile: { type: String, required: false },
    isAccepted: { type: Boolean, default: false },
    deleteRequest : {type : Boolean , default : false , required: false},
    createdActivities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    documents: {
        ID: { type: String, required : false },  // URL to the uploaded ID document
        TaxationRegistry: { type: String, required : false },  // URL to the uploaded Taxation Registry document
    },
    imageUrl : {type : String, required: false},
    canLogin : {type : Boolean , required : false, default : false},
}, { timestamps: true });

module.exports = mongoose.model('Advertiser', advertiserSchema);


const Advertiser = mongoose.model('Advertiser', advertiserSchema);
module.exports = Advertiser;