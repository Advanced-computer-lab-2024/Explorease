const userModel = require('../../Models/UserModels/Seller');
const { hashPassword, comparePassword, createToken } = require('../../utils/auth');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
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

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage for temporary file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadSellerPhoto = async (req, res) => {
    const { id } = req.user; // Assuming `req.user` contains the authenticated user's ID

    try {
        const seller = await userModel.findById(id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (req.file) {
            // Upload photo to Cloudinary using a Promise and upload_stream
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'seller-photos' }, // Folder for organization
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer); // Use buffer from the file uploaded in memory
            });

            // Update Seller model with the secure URL from Cloudinary
            seller.imageUrl = result.secure_url;
            await seller.save();

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
    upload,
    uploadSellerPhoto,
    createSeller,
    getSellerById,
    updateSeller,
    deleteSeller,
    getAllSellers,
    updatePassword
};