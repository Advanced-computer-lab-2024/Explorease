// Dependencies Import
const express = require('express');
const mongoose = require('mongoose');

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
const port = 3000;

// MongoDB Connection
mongoose.connect(process.env.Mongo_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    }).catch(err => console.log(err));

// Middleware
app.use(express.json());

// Unified Registration Route
const registerController = require('./Controllers/registerController');
app.post('/register', registerController.registerUser);

//Unified Login Route
const unifiedLoginController = require('./Controllers/loginController');
app.post('/login', unifiedLoginController);

app.use('/tourguide', tourGuideRoutes);
app.use('/tourists', touristRoutes);
app.use('/advertiser', advertiserRoutes);
app.use('/admins', adminRoutes);
app.use('/governor', governorRoutes);
app.use('/seller', sellerRoutes);
