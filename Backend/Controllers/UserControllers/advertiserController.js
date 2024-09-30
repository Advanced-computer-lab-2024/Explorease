const jwt = require('jsonwebtoken');
const userModel = require('../../Models/UserModels/Advertiser.js');

const { default: mongoose } = require('mongoose');

const createAdvertiser = async(req, res) => {

    const { username, email, password, name, description } = req.body;

    try {
        const advertiser = await userModel.create({ username, email, password, name, description });
        res.status(201).json({ advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAdvertiserById = async(req, res) => {
    try {
        const advertiser = await userModel.findById(req.params.id);
        res.status(200).json({ advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateAdvertiser = async(req, res) => {
    try {
        const advertiser = await userModel.findById(req.params.id);
        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }
        if (!advertiser.isAccepted) {
            return res.status(403).json({ message: 'Advertiser not accepted. Profile updates are not allowed.' });
        }
        const updatedAdvertiser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ updatedAdvertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAdvertiser = async(req, res) => {
    try {
        const advertiser = await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllAdvertisers = async(req, res) => {
    try {
        const advertisers = await userModel.find({}).sort({ createdAt: -1 });
        res.status(200).json({ advertisers });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const loginAdvertiser = async(req, res) => {
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
    createAdvertiser,
    getAdvertiserById,
    updateAdvertiser,
    deleteAdvertiser,
    getAllAdvertisers,
    loginAdvertiser
}