const userModel = require('../../Models/UserModels/Seller');
const { hashPassword, comparePassword, createToken } = require('../../utils/auth');

// Create a new seller
const createSeller = async (req, res) => {
    const { username, email, password, name, description } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        const seller = await userModel.create({
            username,
            email,
            password: hashedPassword,
            name,
            description
        });

        res.status(201).json({ seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get seller by ID
const getSellerById = async (req, res) => {
    try {
        const seller = await userModel.findById(req.user.id);
        res.status(200).json({ seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update seller by ID
const updateSeller = async (req, res) => {
    try {
        const seller = await userModel.findById(req.user.id);

        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!seller.isAccepted) {
            return res.status(403).json({ message: 'Seller not accepted. Profile updates are not allowed.' });
        }

        const updatedSeller = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ updatedSeller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete seller by ID
const deleteSeller = async (req, res) => {
    try {
        const seller = await userModel.findByIdAndDelete(req.user.id);
        res.status(200).json({ seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all sellers
const getAllSellers = async (req, res) => {
    try {
        const sellers = await userModel.find({}).sort({ createdAt: -1 });
        if (sellers.length === 0) {
            return res.status(404).json({ message: 'No Sellers found' });
        }
        res.status(200).json({ sellers });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createSeller,
    getSellerById,
    updateSeller,
    deleteSeller,
    getAllSellers
};