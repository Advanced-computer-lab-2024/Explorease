// Dependencies Import
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); 

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

//Unified Login Route
const unifiedLoginController = require('./Controllers/loginController');
app.post('/login', unifiedLoginController);

app.use('/tourguide', tourGuideRoutes);
app.use('/tourists', touristRoutes);
app.use('/advertiser', advertiserRoutes);
app.use('/admins', adminRoutes);
app.use('/governor', governorRoutes);
app.use('/seller', sellerRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The catch-all handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from the frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials : true
  }));

app.options('*', cors());
