const userModel = require('../../Models/UserModels/Tourist');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utility function to handle JWT token creation
const createToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Create a new tourist
const createTourist = async (req, res) => {
    const { username, email, password, mobileNumber, nationality, dob, jobOrStudent } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password

        const tourist = await userModel.create({
            username,
            email,
            password: hashedPassword,
            mobileNumber,
            nationality,
            dob,
            jobOrStudent
        });

        res.status(201).json({ tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a tourist by ID
const getTouristById = async (req, res) => {
    try {
        const tourist = await userModel.findById(req.user.id);  // Find by user ID from token
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json(tourist);  // Send tourist data
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update tourist by ID
const updateTourist = async (req, res) => {
    try {
        const tourist = await userModel.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json({ tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a tourist by ID
const deleteTourist = async (req, res) => {
    try {
        const tourist = await userModel.findByIdAndDelete(req.params.id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json({ message: 'Tourist deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all tourists
const getAllTourists = async (req, res) => {
    try {
        const tourists = await userModel.find({}).sort({ createdAt: -1 });
        if (tourists.length === 0) {
            return res.status(404).json({ message: 'No tourists found' });
        }
        res.status(200).json({ tourists });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Sort itineraries and activities by price
const sortAllByPrice = async (req, res) => {
    try {
        const itineraries = await sortItineraryByPrice();
        const activities = await sortActivityByPrice();

        // Combine both arrays and sort by price
        const combined = [...itineraries, ...activities].sort((a, b) => a.price - b.price);

        res.status(200).json(combined);
    } catch (err) {
        console.error("Error combining and sorting itineraries and activities by price:", err);
        res.status(500).json({ error: "Failed to fetch and sort data." });
    }
};

// Sort itineraries and activities by rating
const sortAllByRating = async (req, res) => {
    try {
        const itineraries = await sortItineraryByRating();
        const activities = await sortActivityByRating();

        // Combine both arrays and sort by rating
        const combined = [...itineraries, ...activities].sort((a, b) => b.rating - a.rating);

        res.status(200).json(combined);
    } catch (err) {
        console.error("Error combining and sorting itineraries and activities by rating:", err);
        res.status(500).json({ error: "Failed to fetch and sort data." });
    }
};

// Tourist login
const loginTourist = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user);  // Token creation
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};


module.exports = {
    createTourist,
    getTouristById,
    updateTourist,
    deleteTourist,
    getAllTourists,
    sortAllByPrice,
    sortAllByRating,
    loginTourist
};
