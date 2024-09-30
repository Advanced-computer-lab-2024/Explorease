const userModel = require('../../Models/UserModels/Seller.js');
const { default: mongoose } = require('mongoose');

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

module.exports = {
    createSeller,
    getSellerById,
    updateSeller,
    deleteSeller,
    getAllSellers
}