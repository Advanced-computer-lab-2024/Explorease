// Controllers/ReviewController.js
const Review = require('../Models/ActivityModels/TourGuideReview');
const express = require('express');

// Add a new review and rating
const addReview = async (req, res) => {
    const { tourGuideId, rating, review } = req.body;
    const touristId = req.user.id;

    try {
        const newReview = new Review({
            touristId,
            tourGuideId,
            rating,
            review
        });

        await newReview.save();
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

// Get all reviews for a specific tour guide
const getReviewsForGuide = async (req, res) => {
    const { tourGuideId } = req.params;
    console.log(tourGuideId);
    try {
        const reviews = await Review.find({ tourGuideId : tourGuideId }).populate('touristId', 'username');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get review for a specific tour guide by a specific tourist
const getReviewByTouristForGuide = async (req, res) => {
    const { tourGuideId } = req.params;
    const touristId = req.user.id; // Ensure this is the logged-in tourist's ID from the request

    try {
        const review = await Review.findOne({ 
            tourGuideId: tgId,
            touristId: touristId 
        });

        if (!review) {
            return res.status(404).json({ message: 'No review found for this guide by the specified tourist.' });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error: error.message });
    }
};




module.exports = {
    addReview,
    getReviewsForGuide,
    getReviewByTouristForGuide
};
