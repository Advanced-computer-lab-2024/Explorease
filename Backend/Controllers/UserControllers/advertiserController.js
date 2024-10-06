const jwt = require('jsonwebtoken');
const userModel = require('../../Models/UserModels/Advertiser');
const { hashPassword, comparePassword, createToken } = require('../../utils/auth');

// Create a new advertiser
const createAdvertiser = async (req, res) => {
    const { username, email, password, name, description } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        const advertiser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            name,
            description
        });

        res.status(201).json({ advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get advertiser by ID
const getAdvertiserById = async (req, res) => {
    try {
        const advertiser = await userModel.findById(req.user.id);
        if (!advertiser) return res.status(404).json({ error: 'Advertiser not found' });
        res.status(200).json({ advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an advertiser by ID
const updateAdvertiser = async (req, res) => {
    try {
        const advertiser = await userModel.findById(req.user.id);
        if (!advertiser) return res.status(404).json({ error: 'Advertiser not found' });

        if (!advertiser.isAccepted) {
            return res.status(403).json({ message: 'Advertiser not accepted. Profile updates are not allowed.' });
        }

        // Update the advertiser's profile
        const updateFields = { ...req.body };

        // If password is included, hash it before saving
        if (updateFields.password) {
            const hashedPassword = await bcrypt.hash(updateFields.password, 10);
            updateFields.password = hashedPassword;
        }

        const updatedAdvertiser = await userModel.findByIdAndUpdate(req.user.id, updateFields, { new: true });
        res.status(200).json({ updatedAdvertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete an advertiser by ID
const deleteAdvertiser = async (req, res) => {
    try {
        const advertiser = await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ advertiser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all advertisers
const getAllAdvertisers = async (req, res) => {
    try {
        const advertisers = await userModel.find({}).sort({ createdAt: -1 });
        if (advertisers.length === 0) {
            return res.status(404).json({ message: 'No advertisers found' });
        }
        res.status(200).json({ advertisers });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Advertiser login
const loginAdvertiser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = createToken(user);
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
};
