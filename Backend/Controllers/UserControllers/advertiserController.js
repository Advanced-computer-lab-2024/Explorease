const jwt = require('jsonwebtoken');
const userModel = require('../../Models/UserModels/Advertiser');
const { hashPassword, comparePassword, createToken } = require('../../utils/auth');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Booking = require('../../Models/ActivityModels/Booking');
const mongoose = require('mongoose');
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

        // if (!advertiser.isAccepted) {
        //     return res.status(403).json({ message: 'Advertiser not accepted. Profile updates are not allowed.' });
        // }

        // Update the advertiser's profile

        const {username, companyName , websiteLink , hotline , companyProfile} = req.body;

       
        if (username && username !== advertiser.username) {
            const existingAdvertiser = await userModel.findOne({ username });
            if (existingAdvertiser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            advertiser.username = username;
        }
        
        if (companyName) advertiser.companyName = companyName;
        if (websiteLink) advertiser.websiteLink = websiteLink;
        if (hotline) advertiser.hotline = hotline;
        if (companyProfile) advertiser.companyProfile = companyProfile;
        
        // if (password) {
        //     const hashedPassword = await bcrypt.hash(password, 10);
        //     advertiser.password = hashedPassword;
        // }

        //test
        // if (currentPassword && newPassword) {
        //     const isMatch = await bcrypt.compare(currentPassword, advertiser.password);
        //     if (!isMatch) {
        //         return res.status(400).json({ message: 'Current password is incorrect' });
        //     }
        //     // Hash the new password and update it
        //     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        //     advertiser.password = hashedNewPassword;
        // }
        

        const updatedAdvertiser= await advertiser.save();

        res.status(200).json({ message: 'Advertiser updated successfully', updatedAdvertiser });
        console.log('Advertiser updated successfully');
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
    const { emailOrUsername, password } = req.body; // Updated field

    try {
        // Find the user by email or username
        const user = await userModel.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = createToken(user);

        // Respond with the token
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

const deleteReq = async(req,res) =>{
    try{
        const advertiser = await userModel.findById(req.user.id);
        advertiser.deleteRequest = true;
        await advertiser.save();
        res.status(200).json({ message: 'Delete request sent successfully' });
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const advertiser = await userModel.findById(req.user.id);
        if (!advertiser) {
            console.error("Advertiser not found");
            return res.status(404).json({ message: 'Advertiser not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, advertiser.password);
        if (!isMatch) {
            console.error("Current password does not match");
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        advertiser.password = await bcrypt.hash(newPassword, 10);
        await advertiser.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error("Error updating password:", error);  // Log the error
        res.status(500).json({ message: 'Failed to update password', error: error.message });
    }
};

const storage = multer.memoryStorage();
const upload = multer({ storage });  // Make sure to use memory storage or configure as needed

// Cloudinary configuration (if not set globally)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Controller to handle photo upload for Advertiser
const uploadAdvertiserPhoto = async (req, res) => {
    const { id } = req.user; // Assuming `req.user` has the authenticated user's ID

    try {
        const advertiser = await userModel.findById(id);
        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }

        if (req.file) {
            // Upload the file to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'advertiser-photos' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });

            // Update Advertiser model with the secure URL from Cloudinary response
            advertiser.imageUrl = result.secure_url;
            await advertiser.save();

            res.status(200).json({ message: 'Photo uploaded successfully', photoUrl: result.secure_url });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ message: 'Failed to upload photo', error: error.message });
    }
};

const getAdvertiserSalesReport = async (req, res) => {
    try {
        const advertiserId = req.user.id; // Assuming authentication middleware sets req.user

        // Convert advertiserId to ObjectId using `new mongoose.Types.ObjectId`
        const objectIdAdvertiser = new mongoose.Types.ObjectId(advertiserId);

        // Aggregate activity revenue
        const activityRevenue = await Booking.aggregate([
            {
                $lookup: {
                    from: 'activities', // Ensure this matches your MongoDB collection name
                    localField: 'Activity', // Field in the Booking model
                    foreignField: '_id', // Field in the Activity model
                    as: 'activityDetails',
                },
            },
            { $unwind: { path: '$activityDetails', preserveNullAndEmptyArrays: false } }, // Unwind the matched activities
            {
                $match: {
                    'activityDetails.createdBy': objectIdAdvertiser, // Match advertiser-created activities
                    Status: 'Active', // Ensure the booking is active
                },
            },
            {
                $group: {
                    _id: '$Activity', // Group by activity ID
                    activityName: { $first: '$activityDetails.name' }, // Get the activity name
                    totalRevenue: { $sum: '$amountPaid' }, // Sum the amount paid for this activity
                },
            },
        ]);

        // Calculate revenue after commission
        const revenueData = activityRevenue.map((item) => ({
            activityName: item.activityName,
            totalRevenue: item.totalRevenue,
            revenueAfterCommission: item.totalRevenue * 0.9, // Deduct 10% commission
        }));

        res.status(200).json({ revenueData });
    } catch (error) {
        console.error('Error fetching advertiser sales report:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

const getFilteredAdvertiserSalesReport = async (req, res) => {
    try {
        const advertiserId = req.user.id; // Assuming authentication middleware sets req.user
        const { date, month } = req.query;

        const objectIdAdvertiser = new mongoose.Types.ObjectId(advertiserId);

        // Define match conditions
        const matchConditions = {
            'activityDetails.createdBy': objectIdAdvertiser, // Match advertiser-created activities
            Status: 'Active', // Ensure the booking is active
        };

        // Add date or month filter
        if (date) {
            matchConditions.createdAt = {
                $gte: new Date(date),
                $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)), // Include the entire day
            };
        } else if (month) {
            const [year, monthNumber] = month.split('-');
            matchConditions.createdAt = {
                $gte: new Date(`${year}-${monthNumber}-01`),
                $lt: new Date(`${year}-${Number(monthNumber) + 1}-01`),
            };
        }

        // Aggregate activity revenue
        const activityRevenue = await Booking.aggregate([
            {
                $lookup: {
                    from: 'activities', // Ensure this matches your MongoDB collection name
                    localField: 'Activity', // Field in the Booking model
                    foreignField: '_id', // Field in the Activity model
                    as: 'activityDetails',
                },
            },
            { $unwind: { path: '$activityDetails', preserveNullAndEmptyArrays: false } }, // Unwind the matched activities
            { $match: matchConditions }, // Apply match conditions
            {
                $group: {
                    _id: '$Activity', // Group by activity ID
                    activityName: { $first: '$activityDetails.name' }, // Get the activity name
                    totalRevenue: { $sum: '$amountPaid' }, // Sum the amount paid for this activity
                },
            },
        ]);

        // Calculate revenue after commission
        const revenueData = activityRevenue.map((item) => ({
            activityName: item.activityName,
            totalRevenue: item.totalRevenue,
            revenueAfterCommission: item.totalRevenue * 0.9, // Deduct 10% commission
        }));

        res.status(200).json({ revenueData });
    } catch (error) {
        console.error('Error fetching advertiser sales report:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};


module.exports = {
    upload, 
    uploadAdvertiserPhoto,
    createAdvertiser,
    getAdvertiserById,
    updateAdvertiser,
    deleteAdvertiser,
    getAllAdvertisers,
    loginAdvertiser,
    updatePassword,
    deleteReq,
    getAdvertiserSalesReport,
    getFilteredAdvertiserSalesReport,
};
