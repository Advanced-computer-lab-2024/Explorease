const userModel = require('../../Models/UserModels/Tourist');
const Loyalty = require('../../Models/UserModels/Loyalty.js');
const Badge = require('../../Models/UserModels/Badge.js');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

const createTourist = async(req, res) => {

    const { username, email, password, mobileNumber, nationality, dob, jobOrStudent } = req.body;

    try {
        const tourist = await userModel.create({ username, email, password, mobileNumber, nationality, dob, jobOrStudent });

        const touristId = tourist._id;

          Loyalty = new Loyalty({
            touristId,
            points: 0,
            redeemableAmount: 0
          });
          await Loyalty.save();

          Badge = new Badge({
            touristId,
            level: 'explorer',
            awardedAt: new Date()
          });
          await Badge.save();


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

module.exports = {
    createTourist,
    getTouristById,
    updateTourist,
    deleteTourist,
    getAllTourists, 
    loginTourist
}