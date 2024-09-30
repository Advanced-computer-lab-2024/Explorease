const jwt = require('jsonwebtoken');
const Advertiser = require('../Models/UserModels/Advertiser.js');
const TourGuide = require('../Models/UserModels/TourGuide.js');
const Seller = require('../Models/UserModels/Seller.js');
const Tourist = require('../Models/UserModels/Tourist.js');

const authenticate = async(req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Extract token by removing 'Bearer ' from the string
        const actualToken = token.split(' ')[1];

        // Verify token using the same secret
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // Check if the user is an Advertiser or a Tour Guide
        let user = await Advertiser.findById(decoded.id);
        if (!user) {
            user = await TourGuide.findById(decoded.id); // If not an advertiser, try finding a tour guide
        }

        // If not an advertiser nor a tour guide, must be a seller.
        if(!user){
            user = await Seller.findById(decoded.id);
        }

        // If not an advertiser, nor a tour guide, nor a seller, must be a tourist. 
        if(!user){
            user = await Tourist.findById(decoded.id);
        }

        // Otheriwse, the user is not found. 
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach the user (We attach the user to the request) to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid', error });
    }
};

module.exports = authenticate;