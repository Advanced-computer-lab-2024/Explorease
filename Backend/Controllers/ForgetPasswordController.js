const mailgun = require('mailgun-js');
const crypto = require('crypto');

// Import the different user models
const Tourist = require('../Models/UserModels/Tourist');
const TourGuide = require('../Models/UserModels/TourGuide');
const Seller = require('../Models/UserModels/Seller');
const Advertiser = require('../Models/UserModels/Advertiser');
const Admin = require('../Models/UserModels/Admin');
const TouristGovernor = require('../Models/UserModels/TouristGoverner');

const otpStorage = {}; // Temporary in-memory storage for OTPs

// Mailgun setup
const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});

// Send OTP for Forgot Password
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const userModels = [Tourist, TourGuide, Seller, Advertiser, Admin, TouristGovernor];
        let user = null;

        for (const model of userModels) {
            user = await model.findOne({ email });
            if (user) break;
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided email.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

        const mailOptions = {
            from: process.env.MAILGUN_SENDER, // Mailgun sender
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 5 minutes.`,
        };

        // Send email using Mailgun
        await mg.messages().send(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully to your email.' });
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.', error: error.message });
    }
};
// Verify OTP Endpoint
// exports.verifyOTP = async (req, res) => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//         return res.status(400).json({ message: 'Email and OTP are required.' });
//     }

//     try {
//         const storedOtpData = otpStorage[email];

//         if (!storedOtpData) {
//             return res.status(400).json({ message: 'Invalid or expired OTP.' });
//         }

//         if (storedOtpData.otp !== otp) {
//             return res.status(400).json({ message: 'Invalid OTP.' });
//         }

//         if (storedOtpData.expiresAt < Date.now()) {
//             delete otpStorage[email]; // Clear expired OTP
//             return res.status(400).json({ message: 'OTP has expired.' });
//         }

//         // OTP is valid
//         delete otpStorage[email]; // Clear OTP after successful verification
//         res.status(200).json({ message: 'OTP verified successfully. Proceed to reset password.' });
//     } catch (error) {
//         console.error('Error verifying OTP:', error.message);
//         res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
//     }
// };
