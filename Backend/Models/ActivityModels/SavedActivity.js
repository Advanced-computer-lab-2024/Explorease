// models/Wishlist.js
const mongoose = require('mongoose');

const SavedActivitySchema = new mongoose.Schema({
    tourist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true,
    },
    activities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity',
        },
    ],
});

module.exports = mongoose.model('SavedActivities', SavedActivitySchema);
