const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import the different user models
const Tourist = require('../Models/UserModels/Tourist');
const TourGuide = require('../Models/UserModels/TourGuide');
const Seller = require('../Models/UserModels/Seller');
const Advertiser = require('../Models/UserModels/Advertiser');
const Admin = require('../Models/UserModels/Admin');
const TouristGovernor = require('../Models/UserModels/TouristGoverner');

const unifiedLoginController = async (req, res) => {
    const { emailOrUsername, password } = req.body; // Updated field

    if (!emailOrUsername || !password) {
        return res.status(400).json({ message: 'Email/Username and password are required.' });
    }

    try {
        // Function to find a user by email or username and compare password
        const findUserAndAuthenticate = async (Model, userType) => {
            const user = await Model.findOne({
                $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
            });

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    const token = jwt.sign(
                        { id: user.id, role: userType },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                    return {
                        user,
                        token,
                        role: userType,
                        isAccepted: user.isAccepted,
                        canLogin: user.canLogin,
                    };
                }
            }
            return null;
        };

        // Try to authenticate the user for each type
        let userResponse = await findUserAndAuthenticate(Tourist, 'tourist');
        if (!userResponse) userResponse = await findUserAndAuthenticate(TourGuide, 'tourGuide');
        if (!userResponse) userResponse = await findUserAndAuthenticate(Seller, 'seller');
        if (!userResponse) userResponse = await findUserAndAuthenticate(Advertiser, 'advertiser');
        if (!userResponse) userResponse = await findUserAndAuthenticate(Admin, 'admin');
        if (!userResponse) userResponse = await findUserAndAuthenticate(TouristGovernor, 'touristGovernor');

        // If no user was found or authenticated
        if (!userResponse) {
            return res.status(401).json({ message: 'Invalid email/username or password' });
        }

        // If user was authenticated successfully
        const { user, token, role } = userResponse;

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role,
                isAccepted: user.isAccepted,
                canLogin: user.canLogin,
            }, // Send the role explicitly
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

module.exports = unifiedLoginController;
