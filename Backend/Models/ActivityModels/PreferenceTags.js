const mongoose = require('mongoose');


const preferenceTagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
}, { timestamps: true });

const PreferenceTag = mongoose.model('PreferenceTag', preferenceTagSchema);