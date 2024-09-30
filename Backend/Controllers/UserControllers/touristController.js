const userModel = require('../../Models/UserModels/Tourist');

const {searchProductByName} = require('../../Controllers/ProductControllers/ProductController.js');
const {filterProductByPrice} = require('../../Controllers/ProductControllers/ProductController.js');

const  sortItineraryByPrice  = require('../../Controllers/ActivityControllers/ItineraryController');  
const  sortItineraryByRating  = require('../../Controllers/ActivityControllers/ItineraryController');  
const  sortActivityByPrice  =  require('../../Controllers/ActivityControllers/ActivityController');  
const  sortActivityByRating  =  require('../../Controllers/ActivityControllers/ActivityController');  

const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

const createTourist = async(req, res) => {

    const { username, email, password, mobileNumber, nationality, dob, jobOrStudent } = req.body;

    try {
        const tourist = await userModel.create({ username, email, password, mobileNumber, nationality, dob, jobOrStudent });
        res.status(201).json({ tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getTouristById = async(req, res) => {
    try {
        const tourist = await userModel.findById(req.params.id);
        res.status(200).json({ tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateTourist = async(req, res) => {
    try {
        const tourist = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(tourist);
        res.status(200).json({ tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteTourist = async(req, res) => {
    try {
        const tourist = await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllTourists = async(req, res) => {
    try {
        const tourists = await userModel.find({}).sort({ createdAt: -1 });
        if (tourists.length === 0) {
            return res.status(404).json({ message: 'No Tourists found' });
        }
        res.status(200).json({ tourists });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const loginTourist = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate the password (you should be hashing and comparing hashed passwords)
        const isMatch = password === user.password; // (Simplified, add hashing for security)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token as part of the response
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
const sortAllByPrice = async(req,res) => {
    try{
        const itineraries = await sortItineraryByPrice();
        const activities = await sortActivityByPrice();

        // Combine both arrays
        const combined = [
            ...itineraries.map(itinerary => ({ ...itinerary, type: 'itinerary' })),  // Tagging with type 'itinerary'
            ...activities.map(activity => ({ ...activity, type: 'activity' }))       // Tagging with type 'activity'
        ];

        // Sort combined array by price
        combined.sort((a, b) => a.price - b.price);

        // Return the sorted data
        res.status(200).json(combined);
    } catch (err) {
        console.error("Error combining and sorting itineraries and activities:", err);
        res.status(500).json({ error: "Failed to fetch and sort data." });
    }
   
}
const sortAllByRating = async(req,res) => {
    try{
        const itineraries = await sortItineraryByRating();
        const activities = await sortActivityByRating();

        // Combine both arrays
        const combined = [
            ...itineraries.map(itinerary => ({ ...itinerary, type: 'itinerary' })),  // Tagging with type 'itinerary'
            ...activities.map(activity => ({ ...activity, type: 'activity' }))       // Tagging with type 'activity'
        ];

        // Sort combined array by rating
        combined.sort((a, b) => b.rating - a.rating);

        // Return the sorted data
        res.status(200).json(combined);
    } catch (err) {
        console.error("Error combining and sorting itineraries and activities:", err);
        res.status(500).json({ error: "Failed to fetch and sort data." });
    }
   
};

const searchProductByName =async(req,res) => {
    try{
        const product= await searchProductByName();
        
        res.status(200).jsonn
    } catch (err) {
        console.error("Error search product by name", err);
        res.status(500).json({ error: "Failed to fetch data." });
    } 
};
const filterProductByPrice =async(req,res) => {
    try{
        const price= await filterProductByPrice();
        
        res.status(200).jsonn
    } catch (err) {
        console.error("Error search product by price", err);
        res.status(500).json({ error: "Failed to fetch data." });
    } 
};

module.exports = {
    createTourist,
    getTouristById,
    updateTourist,
    deleteTourist,
    getAllTourists, 
    loginTourist,

    searchProductByName,
    filterProductByPrice,
    sortAllByPrice,
    sortAllByRating

}