const userModel = require('../../Models/UserModels/Seller');
const { hashPassword, comparePassword, createToken } = require('../../utils/auth');
const bcrypt = require('bcrypt');

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
        console.log('Updating seller with ID:', req.user.id);

        // Find the seller by the user ID from the authentication middleware
        const seller = await userModel.findById(req.user.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // // Check if the seller is accepted (can only update if accepted)
        // if (!seller.isAccepted) {
        //     return res.status(403).json({ message: 'Seller not accepted. Profile updates are not allowed.' });
        // }

        const { username, password, name, description } = req.body;

        // Check if username already exists (and is different from the current one)
        if (username && username !== seller.username) {
            const existingSeller = await userModel.findOne({ username });
            if (existingSeller) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            seller.username = username;  // Update username
        }

        // Update the name and description fields if provided
        if (name) seller.name = name;
        if (description) seller.description = description;

        // Hash the new password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            seller.password = hashedPassword;
        }

        // Save the updated seller information
        const updatedSeller = await seller.save();
        res.status(200).json({ message: 'Seller updated successfully', updatedSeller });

    } catch (error) {
        console.error('Error updating seller:', error.message);
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