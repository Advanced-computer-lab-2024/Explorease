const userModel = require('../../Models/UserModels/TourGuide.js');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

const createTourGuide = async(req, res) => {

    const { username, email, password } = req.body;

    try {
        const tourguide = await userModel.create({ username, email, password });
        res.status(201).json({ tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getTourGuideById = async(req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('No user with that id');
        const tourguide = await userModel.findById(id);
        if (!tourguide) return res.status(404).send('No user with that id');
        res.status(200).json({ tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateTourGuide = async(req, res) => {
    try {
        const tourguide = await userModel.findById(req.params.id);
        if (!tourguide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        if (!tourguide.isAccepted) {
            return res.status(403).json({ message: 'Tour guide not accepted. Profile updates are not allowed.' });
        }
        const updatedTourGuide = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ updatedTourGuide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteTourGuide = async(req, res) => {
    try {
        const tourguide = await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllTourGuides = async(req, res) => {
    try {
        const tourguides = await userModel.find({}).sort({ createdAt: -1 });
        if (tourguides.length === 0) {
            return res.status(404).json({ message: 'No Tour guides found' });
        }
        res.status(200).json({ tourguides });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const loginTourGuide = async(req, res) => {
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

module.exports = {
    createTourGuide,
    getTourGuideById,
    updateTourGuide,
    deleteTourGuide,
    getAllTourGuides,
    loginTourGuide
}