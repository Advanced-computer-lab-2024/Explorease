// Dependencies Import
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const schedule = require('node-schedule');
const Tourist = require('./Models/UserModels/Tourist');
const { createBirthdayPromoCode } = require('./Controllers/ProductControllers/PromoCodeController');
const { notifySubscribedUsers } = require('./Controllers/UserControllers/NotificationController');

// User Routes
// const roleAuth = require('../Middleware/AuthMiddleware');
const touristRoutes = require('./Routes/touristRoutes');
const tourGuideRoutes = require('./Routes/tourGuideRoutes');
const sellerRoutes = require('./Routes/sellerRoutes');
const advertiserRoutes = require('./Routes/advertiserRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const governorRoutes = require('./Routes/governorRoutes');
const flightsRoute = require('./Routes/flights');
const hotelsRoute = require('./Routes/hotel'); // Add this line
const { generateBirthdayPromoCodes } = require('./utils/promoCodeService');
//const notificationController = require('./Controllers/UserControllers/NotificationController');
const { sendBookingReminders } = require('./Controllers/ActivityControllers/BookingController');

mongoose.set('strictQuery', false);
require('dotenv').config();

// App Variables
const app = express();
app.use(express.json());
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials : true
  }));
  app.options('*', cors());  // Enable pre-flight across the board



// MongoDB Connection
mongoose.connect(process.env.Mongo_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }).catch(err => console.log(err));

// Middleware

// Unified Registration Route
const registerController = require('./Controllers/registerController');
app.post('/register', registerController.registerUser);

// Unified Login Route
const unifiedLoginController = require('./Controllers/loginController');


app.post('/login', unifiedLoginController);


const forgetPasswordController = require('./Controllers/ForgetPasswordController');

app.post('/send-otp', forgetPasswordController.sendOTP);
app.post('/verify-otp', forgetPasswordController.verifyOTP);
app.post('/reset-password', forgetPasswordController.resetPassword);

app.use('/tourguide', tourGuideRoutes);
app.use('/tourists', touristRoutes);
app.use('/advertiser', advertiserRoutes);
app.use('/admins', adminRoutes);
app.use('/governor', governorRoutes);
app.use('/seller', sellerRoutes);

//check user status
const {checkUserStatus, acceptTermsAndConditions }= require('./Controllers/checkUserStatus');
app.post('/check-user-status' , checkUserStatus );
app.post('/accept-terms', acceptTermsAndConditions);
// Routes to upload documents for specific user types
const { uploadPDF, uploadSellerDocuments, uploadAdvertiserDocuments, uploadTourGuideDocuments } = require('./Controllers/uploadController');

// //notifications routes
// app.post('/notifications', notificationController.createNotification);
// app.get('/notifications', notificationController.getNotifications);
// app.put('/notifications/:id', notificationController.markNotificationAsRead);
// app.delete('/notifications/:id', notificationController.deleteNotification);

app.post('/upload-documents/seller', uploadPDF.fields([
    { name: 'ID', maxCount: 1 },
    { name: 'TaxationRegistry', maxCount: 1 }
]), uploadSellerDocuments);

// Advertiser document upload route
app.post('/upload-documents/advertiser', uploadPDF.fields([
    { name: 'ID', maxCount: 1 },
    { name: 'TaxationRegistry', maxCount: 1 }
]), uploadAdvertiserDocuments);

// Tour Guide document upload route
app.post('/upload-documents/tourguide', uploadPDF.fields([
    { name: 'ID', maxCount: 1 },
    { name: 'Certificates', maxCount: 1 }
]), uploadTourGuideDocuments);

app.use('/api/flights', flightsRoute);
// backend/App.js
app.use('/api/hotels', hotelsRoute); // Register the new route

app.get('/transit-route', async (req, res) => {
    const { origin, destination } = req.query; // Expected format: "lat,lng"

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required' });
    }

    try {
        const response = await axios.get('https://transit.hereapi.com/v8/routes', {
            params: {
                origin: origin,
                destination: destination,
                return: 'travelSummary',
                transportMode: 'publicTransport',
                apiKey: 'BHQGHZGH973nk4Gkx-jQQO_wabymB17n5Y-KhBE32zs'
            }
        });
        console.log(response.data);

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching transit route:', error.message);
        res.status(500).json({ error: 'Failed to fetch transit route' });
    }
});

// Schedule the birthday promo code task to run every 24 hours
schedule.scheduleJob('0 0 * * *', generateBirthdayPromoCodes);

// Schedule the reminder function to run every day at 9:00 AM using node-schedule
schedule.scheduleJob('0 9 * * *', async () => {
    //console.log('Running daily booking reminder task...');
    await sendBookingReminders();
});

//Schedule task to notify subscribed users about activities with open booking
// schedule.scheduleJob('0 * * * *', async () => {
//     console.log('Running scheduled task to notify subscribed users...');
//     await notifySubscribedUsers();
// });

schedule.scheduleJob('*/1 * * * *', async () => {
    //console.log('Running scheduled task to notify subscribed users every 5 minutes...');
    await notifySubscribedUsers();
});


// Schedule the birthday promo code task every 5 minutes
//schedule.scheduleJob('*/5 * * * *', generateBirthdayPromoCodes);





// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // The catch-all handler: for any request that doesn't match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

