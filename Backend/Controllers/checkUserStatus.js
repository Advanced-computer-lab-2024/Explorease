const express = require('express');
const router = express.Router();
const Seller = require('../Models/UserModels/Seller');
const Advertiser = require('../Models/UserModels/Advertiser');
const TourGuide = require('../Models/UserModels/TourGuide');

// Route to check user status and required documents
const checkUserStatus = async (req, res) => {
    const { email } = req.body;
    try {
        let user = await Seller.findOne({ email });
        if (user && !user.isAccepted) {
            return res.status(200).json({
                message: 'User needs to upload documents',
                requiredDocuments: ['ID', 'TaxationRegistry'],
                userType: 'seller',
                isAccepted: user.isAccepted,
            });
        }

        user = await Advertiser.findOne({ email });
        if (user && !user.isAccepted) {
            return res.status(200).json({
                message: 'User needs to upload documents',
                requiredDocuments: ['ID', 'TaxationRegistry'],
                userType: 'advertiser',
                isAccepted: user.isAccepted,
            });
        }

        user = await TourGuide.findOne({ email });
        if (user && !user.isAccepted) {
            return res.status(200).json({
                message: 'User needs to upload documents',
                requiredDocuments: ['ID', 'Certificates'],
                userType: 'tourguide',
                isAccepted: user.isAccepted,
            });
        }

        return res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error checking user status', error: error.message });
    }
};

module.exports = { checkUserStatus };
