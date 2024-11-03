const express = require('express');
const router = express.Router();
const Seller = require('../Models/UserModels/Seller');
const Advertiser = require('../Models/UserModels/Advertiser');
const TourGuide = require('../Models/UserModels/TourGuide');

// Route to check user status and required documents
const checkUserStatus = async (req, res) => {
    const { email } = req.body;
    try {
        const emailToSearch = email.trim().toLowerCase();
        console.log('Searching for seller with email:', emailToSearch);
        
        // Corrected query syntax
        let user = await Seller.findOne({ email: emailToSearch });
        console.log('Query result for Seller:', user);

        if (user) {
            return res.status(200).json({
                message: 'User needs to upload documents',
                requiredDocuments: ['ID', 'TaxationRegistry'],
                userType: 'seller',
                isAccepted: user.isAccepted,
            });
        }

        user = await Advertiser.findOne({ email: emailToSearch });
        console.log('Query result for Advertiser:', user);

        if (user) {
            return res.status(200).json({
                message: 'User needs to upload documents',
                requiredDocuments: ['ID', 'TaxationRegistry'],
                userType: 'advertiser',
                isAccepted: user.isAccepted,
            });
        }

        user = await TourGuide.findOne({ email: emailToSearch });
        console.log('Query result for TourGuide:', user);

        if (user) {
            return res.status(200).json({
                message: 'User needs to upload documents',
                requiredDocuments: ['ID', 'Certificates'],
                userType: 'tourguide',
                isAccepted: user.isAccepted,
            });
        }

        console.log('User not found in any collection');
        return res.status(404).json({ message: 'User not found' });
    } catch (error) {
        console.error('Error during query:', error);
        res.status(500).json({ message: 'Error checking user status', error: error.message });
    }
};

const acceptTermsAndConditions = async (req, res) => {
    const { email } = req.body;

    try {
        console.log("Received email for terms acceptance:", email);

        // Attempt to find the user in each model
        let user = await Seller.findOne({ email });
        let userType = 'seller';

        if (!user) {
            user = await Advertiser.findOne({ email });
            userType = 'advertiser';
        }

        if (!user) {
            user = await TourGuide.findOne({ email });
            userType = 'tourGuide';
        }

        // If user is not found
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("Current canLogin status for user:", user.canLogin);

        // If `canLogin` is already true, return early
        if (user.canLogin) {
            console.log("Terms already accepted for user:", user);
            return res.status(200).json({ message: 'Terms and conditions have already been accepted', canLogin: true });
        }

        // Update `canLogin` to true and save the user
        user.canLogin = true;
        await user.save();

        // Refetch to confirm the update
        const updatedUser = await Seller.findOne({ email }) || 
                            await Advertiser.findOne({ email }) || 
                            await TourGuide.findOne({ email });

        console.log("Updated canLogin status for user:", updatedUser?.canLogin);

        res.status(200).json({ message: 'Terms and conditions accepted successfully', userType, canLogin: updatedUser?.canLogin });
    } catch (error) {
        console.error("Error while accepting terms and conditions:", error.message);
        res.status(500).json({ message: 'Error accepting terms and conditions', error: error.message });
    }
};


module.exports = { checkUserStatus, acceptTermsAndConditions  };
