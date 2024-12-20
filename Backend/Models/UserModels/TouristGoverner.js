const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourismGovernorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    FirstName : {type : String, required : false},
    LastName : {type : String, required : false},
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
}, { timestamps: true });

const TourismGovernor = mongoose.model('TourismGovernor', tourismGovernorSchema);
module.exports = TourismGovernor;