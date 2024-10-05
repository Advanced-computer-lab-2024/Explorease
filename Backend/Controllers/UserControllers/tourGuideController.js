const userModel = require('../../Models/UserModels/TourGuide');
const { hashPassword, comparePassword, createToken } = require('../../utils/auth');
const mongoose = require('mongoose');

// Create a new tour guide
const createTourGuide = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const tourguide = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a tour guide by ID
const getTourGuideById = async (req, res) => {
    try {
        const id = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('No user with that id');

        const tourguide = await userModel.findById(id);
        if (!tourguide) return res.status(404).send('No user with that id');
        
        res.status(200).json({ tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a tour guide by ID
const updateTourGuide = async (req, res) => {
    try {
        const tourGuide = await userModel.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        res.status(200).json({ tourGuide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a tour guide by ID
const deleteTourGuide = async (req, res) => {
    try {
        const tourguide = await userModel.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Tour guide deleted', tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all tour guides
const getAllTourGuides = async (req, res) => {
    try {
        const tourguides = await userModel.find({}).sort({ createdAt: -1 });
        if (tourguides.length === 0) {
            return res.status(404).json({ message: 'No Tour guides found' });
        }
        res.status(200).json({ tourguides });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Tour guide login
const loginTourGuide = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await comparePassword(password, user.password);
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
    createTourGuide,
    getTourGuideById,
    updateTourGuide,
    deleteTourGuide,
    getAllTourGuides,
    loginTourGuide
};
