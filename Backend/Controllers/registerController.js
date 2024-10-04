const touristController = require('./UserControllers/touristController');
const tourGuideController = require('./UserControllers/tourGuideController');
const sellerController = require('./UserControllers/sellerController');
const advertiserController = require('./UserControllers/advertiserController');

const registerUser = async (req, res) => {
    const { userType, username, email, password, ...otherData } = req.body;

    try {
        // Validate user type
        if (!userType || !['tourist', 'tourGuide', 'seller', 'advertiser'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid or missing user type' });
        }

        // Call the appropriate controller based on the userType
        switch (userType) {
            case 'tourist':
                return await touristController.createTourist(req, res);
            case 'tourGuide':
                return await tourGuideController.createTourGuide(req, res);
            case 'seller':
                return await sellerController.createSeller(req, res);
            case 'advertiser':
                return await advertiserController.createAdvertiser(req, res);
            default:
                return res.status(400).json({ message: 'Unknown user type' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

module.exports = { registerUser };
