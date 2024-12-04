const userModel = require('../../Models/UserModels/Tourist');

const Loyalty = require('../../Models/UserModels/Loyalty.js');
const { default: mongoose } = require('mongoose');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// Utility function to handle JWT token creation
const createToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
const createTourist = async (req, res) => {
    const { username, email, password, mobileNumber, nationality, dob, jobOrStudent } = req.body;

    try {
        // Check if all required fields are provided
        if (!username || !email || !password || !mobileNumber || !nationality || !dob || !jobOrStudent) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the tourist
        const tourist = await userModel.create({
            username,
            email,
            password: hashedPassword,
            mobileNumber,
            nationality,
            dob,
            jobOrStudent
        });


        // Create the loyalty record for the tourist
        const loyalty = new Loyalty({
            touristId: tourist._id,
            points: 0,
            level: 1,
            TotalPointsEarned: 0
        });
        await loyalty.save();

        const loyaltyId = loyalty._id;
        tourist.loyaltyId = loyaltyId;
        await tourist.save();
        

        res.status(201).json({ tourist });
    } catch (error) {
        console.error('Error during tourist creation:', error.message);
        res.status(400).json({ error: error.message });
    }
};

const deleteReq = async (req, res) => {
    try{
        const tourist = await userModel.findById(req.user.id);
        tourist.deleteRequest = true;
        await tourist.save();
        res.status(200).json({ message: 'Delete request sent successfully' });
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

// Get a tourist by ID
const getTouristById = async (req, res) => {
    try {
        const tourist = await userModel.findById(req.user.id);  // Find by user ID from token
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json(tourist);  // Send tourist data
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update tourist by ID
const updateTourist = async (req, res) => {
    try {
        const tourist = await userModel.findByIdAndUpdate(req.user.id, req.body, { new: true });
        const {FirstName, LastName} = req.body;

        const touristNameControl = await userModel.findById(req.user.id);
        touristNameControl.FirstName = FirstName;
        touristNameControl.LastName = LastName;

        await touristNameControl.save();


        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json({ tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a tourist by ID
const deleteTourist = async (req, res) => {
    try {
        const tourist = await userModel.findByIdAndDelete(req.params.id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json({ message: 'Tourist deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all tourists
const getAllTourists = async (req, res) => {
    try {
        const tourists = await userModel.find({}).sort({ createdAt: -1 });
        if (tourists.length === 0) {
            return res.status(404).json({ message: 'No tourists found' });
        }
        res.status(200).json({ tourists });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Sort itineraries and activities by price
const sortAllByPrice = async (req, res) => {
    try {
        const itineraries = await sortItineraryByPrice();
        const activities = await sortActivityByPrice();

        // Combine both arrays and sort by price
        const combined = [...itineraries, ...activities].sort((a, b) => a.price - b.price);

        res.status(200).json(combined);
    } catch (err) {
        console.error("Error combining and sorting itineraries and activities by price:", err);
        res.status(500).json({ error: "Failed to fetch and sort data." });
    }
};

// Sort itineraries and activities by rating
const sortAllByRating = async (req, res) => {
    try {
        const itineraries = await sortItineraryByRating();
        const activities = await sortActivityByRating();

        // Combine both arrays and sort by rating
        const combined = [...itineraries, ...activities].sort((a, b) => b.rating - a.rating);

        res.status(200).json(combined);
    } catch (err) {
        console.error("Error combining and sorting itineraries and activities by rating:", err);
        res.status(500).json({ error: "Failed to fetch and sort data." });
    }
};

// Tourist login
const loginTourist = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user);  // Token creation
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

const editPassword = async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const touristId = req.user.id; // Assuming the tourist's ID is retrieved from the token

        // Find the tourist
        const tourist = await userModel.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, tourist.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password
        tourist.password = hashedPassword;
        await tourist.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error: error.message });
    }
}

const addDeliveryAddress = async (req, res) => {
    const { label, address, city, zipCode, country } = req.body;
    const touristId = req.user.id;

    try {
        const tourist = await userModel.findById(touristId);
        if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

        const newAddress = { label, address, city, zipCode, country };
        tourist.deliveryAddresses.push(newAddress);

        await tourist.save();
        res.status(200).json({ message: 'Address added successfully', addresses: tourist.deliveryAddresses });
    } catch (error) {
        res.status(500).json({ message: 'Error adding address', error: error.message });
    }
};

const getDeliveryAddresses = async (req, res) => {
    const touristId = req.user.id;

    try {
        const tourist = await userModel.findById(touristId);
        if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

        res.status(200).json({ addresses: tourist.deliveryAddresses });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

const deleteDeliveryAddress = async (req, res) => {
    const touristId = req.user.id;
    const { addressId } = req.params;

    try {
        const tourist = await userModel.findById(touristId);
        if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

        tourist.deliveryAddresses = tourist.deliveryAddresses.filter(
            (address, index) => index.toString() !== addressId
        );

        await tourist.save();
        res.status(200).json({ message: 'Address removed successfully', addresses: tourist.deliveryAddresses });
    } catch (error) {
        res.status(500).json({ message: 'Error removing address', error: error.message });
    }
};



module.exports = {
    createTourist,
    getTouristById,
    updateTourist,
    deleteTourist,
    getAllTourists,
    sortAllByPrice,
    sortAllByRating,
    loginTourist,
    editPassword,
    deleteReq,
    addDeliveryAddress,
    getDeliveryAddresses,
    deleteDeliveryAddress
};
