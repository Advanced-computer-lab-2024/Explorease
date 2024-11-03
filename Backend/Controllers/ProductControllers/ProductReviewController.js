const productreviewModel = require('../../Models/ProductModels/ProductReview.js');
const { default: mongoose } = require('mongoose');
const Tourist = require('../Models/UserModels/Tourist.js');
const Product = require('../../Models/ProductModels/Product.js')


const createProductReview = async (req, res) => {
    const { Rating, Details, CreatedAt } = req.body;
    const Tourist = req.user.id;
    const Product = req.params;
    

    try {
        // Validate that required fields are provided
        if (!Rating || !Details  ) {
            return res.status(400).json({ message: 'All fields (Rating & Details) are required.' });
        }

        const review = new productReviewModel({
            Tourist,
            Product,
            Rating,
            Details,
            CreatedAt: new Date()
        });

        await review.save();
        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Review', error: error.message });
    }
};

//get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await productreviewModel.find({});
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found." });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Failed to load reviews.", error: error.message });
    }
};
 

//get all of my reviews
const getMyReviews = async (req, res) => {
    const touristId = req.user.id; // Assume req.user is set by authentication middleware

    try {
        const reviews = await productreviewModel.find({ Tourist: touristId });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this tourist.' });
        }

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

const updateReviewDetails = async (req, res) => {
    const { id } = req.params;
    const { Rating, Details } = req.body;

    
    try {
        const review = await productreviewModel.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        if (Rating) review.Rating = Rating;
        if (Details) review.Details = Details;

        await review.save();
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Review ID is required." });
        }

        const review = await productreviewModel.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ message: "review not found." });
        }

        res.status(200).json({ message: "review deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete review.", error: error.message });
    }
};

module.exports = {
    createProductReview,
    getAllReviews,
    getMyReviews,
    updateReviewDetails,
    deleteReview
};