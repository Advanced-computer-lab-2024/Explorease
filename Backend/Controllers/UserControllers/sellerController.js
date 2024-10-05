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
        console.log('Updating seller with ID:', req.user.id);  // Debugging log

        const seller = await userModel.findById(req.user.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (!seller.isAccepted) {
            return res.status(403).json({ message: 'Seller not accepted. Profile updates are not allowed.' });
        }

        console.log('Seller before update:', seller);  // Log seller before update
        console.log('Request Body:', req.body);  // Log incoming update data

        // Update the seller with fields from req.body
        Object.assign(seller, req.body);  // Merge new data into the existing seller object

        const updatedSeller = await seller.save();  // Save the updated seller object
        console.log('Seller after update:', updatedSeller);  // Log the updated seller
        res.status(200).json({ updatedSeller });
    } catch (error) {
        console.error('Update error:', error.message);  // Log any errors
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