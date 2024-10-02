const userModel = require('../../Models/UserModels/Seller.js');
const {searchProductByName} = require('../../Controllers/ProductControllers/ProductController.js');
const {filterProductByPrice} = require('../../Controllers/ProductControllers/ProductController.js');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');

const createSeller = async(req, res) => {

    const { username, email, password, name, description } = req.body;
    try {
        const seller = await userModel.create({ username, email, password, name, description });
        res.status(201).json({ seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getSellerById = async(req, res) => {
    try {
        const seller = await userModel.findById(req.params.id);
        res.status(200).json({ seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const updateSeller = async(req, res) => {
    try {
        const seller = await userModel.findById(req.params.id);

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


const deleteSeller = async(req, res) => {
    try {
        const seller = await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllSellers = async(req, res) => {
    try {
        const sellers = await userModel.find({}).sort({ createdAt: -1 });
        if (sellers.length === 0) {
            return res.status(404).json({ message: 'No Sellers found' });
        }
        res.status(200).json({ sellers });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const loginSeller = async(req, res) => {
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
    createSeller,
    getSellerById,
    updateSeller,
    deleteSeller,
    getAllSellers, 
    loginSeller,
    searchProductByName,
    filterProductByPrice
}