const userModel = require('../../Models/UserModels/TouristGoverner');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utility function for token creation
const createToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Create a new tourist governor
exports.createTouristGovernor = async (req, res) => {
    const { username, email, password, name, mobile
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password


        const touristGovernor = await userModel.create({
            username,
            email,
            password: hashedPassword,
            name,
            mobile
        });

        res.status(201).json({ touristGovernor });

    } catch (error) {

        res.status(400).json({ error: error.message });
    }
};

// Get a tourist governor by ID

exports.getTouristGovernorById = async (req, res) => {
    try {
        const touristGovernor = await userModel.findById(req.user.id);  // Find by user ID from token
        if (!touristGovernor) {
            return res.status(404).json({ message: 'Tourist Governor not found' });
        }
        res.status(200).json(touristGovernor);  // Send tourist governor data
    }

    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update tourist governor by ID
exports.updateTouristGovernor = async (req, res) => {
    try {
        const touristGovernor = await userModel.findByIdAndUpdate(req.user.id, req.body, { new: true });
        if (!touristGovernor) {
            return res.status(404).json({ message: 'Tourist Governor not found' });
        }
        res.status(200).json({ touristGovernor });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a tourist governor by ID
exports.deleteTouristGovernor = async (req, res) => {
    try {
        const touristGovernor = await userModel.findByIdAndDelete(req.params.id);
        if (!touristGovernor) {
            return res.status(404).json({ message: 'Tourist Governor not found' });
        }
        res.status(200).json({ message: 'Tourist Governor deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all tourist governors
exports.getAllTouristGovernors = async (req, res) => {
    try {
        const touristGovernors = await userModel.find();
        res.status(200).json({ touristGovernors });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.loginTouristGovernor = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate the password (hashed password comparison)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = createToken(user);

        // Send the token as part of the response
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
