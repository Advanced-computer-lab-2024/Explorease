// Dependencies Import
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// User Routes
// const roleAuth = require('../Middleware/AuthMiddleware');
const touristRoutes = require('./Routes/touristRoutes');
const tourGuideRoutes = require('./Routes/tourGuideRoutes');
const sellerRoutes = require('./Routes/sellerRoutes');
const advertiserRoutes = require('./Routes/advertiserRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const governorRoutes = require('./Routes/governorRoutes');

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

app.use('/tourguide', tourGuideRoutes);
app.use('/tourists', touristRoutes);
app.use('/advertiser', advertiserRoutes);
app.use('/admins', adminRoutes);
app.use('/governor', governorRoutes);
app.use('/seller', sellerRoutes);

const checkStatusController = require('./Controllers/checkUserStatus');
app.post('/check-user-status' , checkStatusController.checkUserStatus );

// Routes to upload documents for specific user types
const { uploadPDF, uploadSellerDocuments, uploadAdvertiserDocuments, uploadTourGuideDocuments } = require('./Controllers/uploadController');

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

// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // The catch-all handler: for any request that doesn't match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });

