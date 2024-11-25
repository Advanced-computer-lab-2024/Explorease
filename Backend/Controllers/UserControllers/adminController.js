const Admin = require('../../Models/UserModels/Admin.js'); // Corrected model path
const TourismGovernor = require('../../Models/UserModels/TouristGoverner.js'); // Corrected model path
const {searchProductByName} = require('../../Controllers/ProductControllers/ProductController.js');
const {filterProductByPrice} = require('../../Controllers/ProductControllers/ProductController.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const Tourist = require('../../Models/UserModels/Tourist');
const Seller = require('../../Models/UserModels/Seller');
const TourGuide = require('../../Models/UserModels/TourGuide');
const Advertiser = require('../../Models/UserModels/Advertiser');



// Delete admin account
const deleteAdminAccount = async(req, res) => {
    const { id } = req.params;

    // Check if the current admin is the main admin
    if (!req.admin.isMainAdmin) {
        return res.status(403).json({ message: 'Only the main admin can delete admins' });
    }

    if (req.admin._id.toString() === id) {
        return res.status(403).json({ message: 'Main admin cannot delete their own account' });
    }

    try {
        const admin = await Admin.findByIdAndDelete(id);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json({ message: 'Admin account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add Tourism Governor to the system
const addTourismGovernor = async(req, res) => {
    const { username, email, password } = req.body;

    // Input validation
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const existingGovernor = await TourismGovernor.findOne({ $or: [{ username }, { email }] });

        if (existingGovernor) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newGovernor = await TourismGovernor.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json(newGovernor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add another admin
const addAdmin = async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    if (!req.admin.isMainAdmin) {
        return res.status(403).json({ message: 'Only the main admin can add other admins' });
    }

    // Input validation
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });

        if (existingAdmin) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            isMainAdmin: false
        });

        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all admins
const getAllAdmins = async (req, res) => {
    // Ensure only main admin or authorized admins can access this endpoint
    if (!req.admin.isMainAdmin) {
        return res.status(403).json({ message: 'Only the main admin can view all admins' });
    }

    try {
        // Fetch all admins from the Admin collection
        const admins = await Admin.find();  // Optionally, you can add a filter if needed
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admins', details: error.message });
    }
};


// Role-Based Access Control (Authorization)
const authorizeAdmin = (requiredPermissions) => {
    return (req, res, next) => {
        const admin = req.admin; // Assume the admin info is attached to the request (via middleware like JWT auth)

        if (!admin) {
            return res.status(403).json({ error: 'No admin credentials found' });
        }

        // Check if the admin has the required permissions
        const hasPermission = requiredPermissions.every(permission =>
            admin.permissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ error: 'You do not have the necessary permissions' });
        }

        next();
    };
};

const loginAdmin = async (req, res) => {
    const { emailOrUsername, password } = req.body; // Updated to accept either email or username

    try {
        // Find the admin by email or username
        const admin = await Admin.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token with the admin's details
        const token = jwt.sign(
            { id: admin._id, isMainAdmin: admin.isMainAdmin }, // Include isMainAdmin in the payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with the generated token
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createMainAdmin = async(req, res) => {
    const bcrypt = require('bcrypt');
    const Admin = require('./Models/UserModels/Admin'); // Adjust path if needed

    const { username, email, password } = req.body;

    // Check if main admin already exists
    const existingMainAdmin = await Admin.findOne({ isMainAdmin: true });
    if (existingMainAdmin) {
        return res.status(400).json({ message: "Main admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newMainAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            isMainAdmin: true
        });
        res.status(201).json({ message: 'Main Admin created successfully', newMainAdmin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTourists = async(req, res) => {
    const Tourist = require('../../Models/UserModels/Tourist');
    try {
        const tourists = await Tourist.find();
        res.status(200).json(tourists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllSellers = async(req, res) => {
    const Seller = require('../../Models/UserModels/Seller');
    try {
        const sellers = await Seller.find();
        res.status(200).json(sellers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllTourismGovernors = async(req, res) => {
    const TourismGovernor = require('../../Models/UserModels/TouristGoverner');
    try {
        const governors = await TourismGovernor.find();
        res.status(200).json(governors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTourguides = async(req, res) => {
    const Tourguide = require('../../Models/UserModels/TourGuide');
    try {
        const tourguides = await Tourguide.find();
        res.status(200).json(tourguides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllAdvertisers = async(req, res) => {
    const Advertiser = require('../../Models/UserModels/Advertiser');
    try {
        const advertisers = await Advertiser.find();
        res.status(200).json(advertisers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id, userType } = req.params;  // Get user ID and user type from the request parameters

    try {
        let deletedUser;
        switch (userType) {
            case 'tourist':
                deletedUser = await Tourist.findByIdAndDelete(id);
                break;
            case 'seller':
                deletedUser = await Seller.findByIdAndDelete(id);
                break;
            case 'tourismGovernor':
                deletedUser = await TourismGovernor.findByIdAndDelete(id);
                break;
            case 'tourGuide':
                deletedUser = await TourGuide.findByIdAndDelete(id);
                break;
            case 'advertiser':
                deletedUser = await Advertiser.findByIdAndDelete(id);
                break;
            case 'admin':
                if (!req.admin.isMainAdmin) {
                    return res.status(403).json({ message: 'Only the main admin can delete admins' });
                }
                if (req.admin._id.toString() === id) {
                    return res.status(403).json({ message: 'Main admin cannot delete their own account' });
                }
                deletedUser = await Admin.findByIdAndDelete(id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        if (!deletedUser) {
            return res.status(404).json({ message: `${userType} not found` });
        }

        res.status(200).json({ message: `${userType} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: `Error deleting ${userType}: ${error.message}` });
    }
};


const editMyPassword = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    try {
        // Verify the token and get the admin's ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminId = decoded.id;
        const { currentPassword, newPassword } = req.body;

        // Check if both passwords are provided
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        await admin.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Error updating password" });
    }
};

const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await Promise.all([
            Seller.find({ isAccepted: false }),
            Advertiser.find({ isAccepted: false }),
            TourGuide.find({ isAccepted: false }),
        ]);

        res.status(200).json({ 
            sellers: pendingUsers[0], 
            advertisers: pendingUsers[1], 
            tourGuides: pendingUsers[2] 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending users', error: error.message });
    }
};

// Accept a user by updating `isAccepted` status
const acceptUser = async (req, res) => {
    const { userId, userType } = req.body;
    const Model = userType === 'Seller' ? Seller : userType === 'Advertiser' ? Advertiser : TourGuide;
    try {
        await Model.findByIdAndUpdate(userId, { isAccepted: true });
        res.status(200).json({ message: `${userType} accepted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting user', error: error.message });
    }
};

// Delete a user
const rejectUser = async (req, res) => {
    const { userId, userType } = req.body;
    const Model = userType === 'Seller' ? Seller : userType === 'Advertiser' ? Advertiser : TourGuide;
    try {
        await Model.findByIdAndDelete(userId);
        res.status(200).json({ message: `${userType} rejected and removed from the system` });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting user', error: error.message });
    }
};

const getAllDeleteRequests = async (req, res) => {
    try {
        const RequestedDeleteUsers = await Promise.all([
            Seller.find({ deleteRequest: true }),
            Advertiser.find({ deleteRequest: true }),
            TourGuide.find({ deleteRequest: true }),
            Tourist.find({ deleteRequest: true }),
        ]);

        res.status(200).json({ 
            sellers: RequestedDeleteUsers[0], 
            advertisers: RequestedDeleteUsers[1], 
            tourGuides: RequestedDeleteUsers[2],
            tourists: RequestedDeleteUsers[3]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

module.exports = { getPendingUsers, acceptUser, rejectUser, editMyPassword, deleteAdminAccount, addTourismGovernor, addAdmin, authorizeAdmin, loginAdmin, createMainAdmin, getAllAdmins, getAllTourists, getAllSellers, getAllTourismGovernors, getAllTourguides, getAllAdvertisers , deleteUser,getAllDeleteRequests};