const userModel = require('../../Models/UserModels/TourGuide');
const { hashPassword, comparePassword, createToken } = require('../../utils/auth');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create a new tour guide
const createTourGuide = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const tourguide = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a tour guide by ID
const getTourGuideById = async (req, res) => {
    try {
        const id = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('No user with that id');

        const tourguide = await userModel.findById(id);
        if (!tourguide) return res.status(404).send('No user with that id');
        
        res.status(200).json({ tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getTourGuideByIdParam = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send('No user with that id');

        const tourguide = await userModel.findById(id);
        if (!tourguide) return res.status(404).send('No user with that id');
        
        res.status(200).json({ tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a tour guide by ID
const updateTourGuide = async (req, res) => {
    try {
        const tourGuide = await userModel.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        res.status(200).json({ tourGuide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a tour guide by ID
const deleteTourGuide = async (req, res) => {
    try {
        const tourguide = await userModel.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Tour guide deleted', tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all tour guides
const getAllTourGuides = async (req, res) => {
    try {
        const tourguides = await userModel.find({}).sort({ createdAt: -1 });
        if (tourguides.length === 0) {
            return res.status(404).json({ message: 'No Tour guides found' });
        }
        res.status(200).json({ tourguides });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Tour guide login
const loginTourGuide = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user);  // Token creation
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await userModel.findById(req.user.id);
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer with Cloudinary Storage for images
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tour-guide-photos',
        allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
    },
});



const uploadTourGuidePhoto = async (req, res) => {
    const { id } = req.user; // Assuming `req.user` contains the authenticated user's ID

    try {
        // Find the tour guide by ID
        const tourGuide = await userModel.findById(id);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour Guide not found' });
        }

        // Check if a file is uploaded
        if (req.file) {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            // Upload the file to Cloudinary
            const result = await cloudinary.uploader.upload(base64Image, {
                folder: 'tour-guide-photos',  // Optional: organize your images in a specific folder
            });
            
            // Get the secure URL from Cloudinary response
            tourGuide.imageUrl = result.secure_url;
            await tourGuide.save();

            res.status(200).json({ message: 'Photo uploaded successfully', photoUrl: result.secure_url });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ message: 'Failed to upload photo', error: error.message });
    }
};

module.exports = {
    getTourGuideByIdParam,
    uploadTourGuidePhoto,
    createTourGuide,
    getTourGuideById,
    updateTourGuide,
    deleteTourGuide,
    getAllTourGuides,
    loginTourGuide,
    updatePassword
};
