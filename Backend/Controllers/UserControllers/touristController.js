const userModel = require('../../Models/UserModels/Tourist');
const { default: mongoose } = require('mongoose');

const createTourist = async(req, res) => {

    const { username, email, password, mobileNumber, nationality, dob, jobOrStudent } = req.body;

    try {
        const tourist = await userModel.create({ username, email, password, mobileNumber, nationality, dob, jobOrStudent });
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

module.exports = {
    createTourist,
    getTouristById,
    updateTourist,
    deleteTourist,
    getAllTourists
}