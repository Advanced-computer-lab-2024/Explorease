const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PreferenceTagSchema = new Schema({
    name: { type: String, required: true, unique: true },
});

const PreferenceTag = mongoose.model('PreferenceTag', PreferenceTagSchema);
module.exports = PreferenceTag;