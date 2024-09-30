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
    createdActivities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
}, { timestamps: true });

module.exports = mongoose.model('Advertiser', advertiserSchema);


const Advertiser = mongoose.model('Advertiser', advertiserSchema);
module.exports = Advertiser;