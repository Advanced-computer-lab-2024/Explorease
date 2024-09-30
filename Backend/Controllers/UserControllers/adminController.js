const Admin = require('../../Models/UserModels/Admin.js'); // Corrected model path
const TourismGovernor = require('../../Models/UserModels/TouristGoverner.js'); // Corrected model path
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');


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

const loginAdmin = async(req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id, isMainAdmin: admin.isMainAdmin }, // Add isMainAdmin in the token payload
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );

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
}

module.exports = { deleteAdminAccount, addTourismGovernor, addAdmin, authorizeAdmin, loginAdmin, createMainAdmin };