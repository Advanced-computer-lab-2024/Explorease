// Models/Review.js
const mongoose = require('mongoose');
const TourGuide = require('../UserModels/TourGuide');

const TourGuideReview = new mongoose.Schema({
    touristId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },
    tourGuideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourGuide',
        required: true
    },
    rating: {
        type: Number,
        required: false,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TourGuideReview', TourGuideReview);
