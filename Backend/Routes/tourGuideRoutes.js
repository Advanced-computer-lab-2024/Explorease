const express = require('express');
const router = express.Router();
const itineraryController = require('../Controllers/ActivityControllers/ItineraryController');
const tourGuideController = require('../Controllers/UserControllers/tourGuideController');
const { roleAuth } = require('../Middleware/authMiddleware');

// Routes for Tour Guide to create, read, update, and delete itineraries
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Ensure Cloudinary is configured as before
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage specifically for PDFs
const pdfStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tourguide-documents', // Store PDFs in a "documents" folder
        resource_type: 'raw', // Allows non-image files such as PDFs
        allowedFormats: ['pdf'],
    },
});


const uploadPDF = multer({ storage: pdfStorage });

module.exports = uploadPDF;
// Create Itinerary (Tour Guide specific)
router.post('/createItinerary', roleAuth(['tourGuide']), itineraryController.createItinerary);

// Read all itineraries created by the tour guide
router.get('/myItineraries', roleAuth(['tourGuide']), itineraryController.readItinerary);

//Read all itineraries 
router.get('/allItineraries', itineraryController.getAllItinerary);

// Update an itinerary
router.put('/updateItinerary/:id', roleAuth(['tourGuide']), itineraryController.updateItinerary);
router.put('/activateItinerary/:id', roleAuth(['tourGuide']), itineraryController.activateItinerary);
router.put('/deactivateItinerary/:id', roleAuth(['tourGuide']), itineraryController.deactivateItinerary);

// Delete an itinerary
router.delete('/deleteItinerary/:id', roleAuth(['tourGuide']), itineraryController.deleteItinerary);

//Get my profile.
router.get('/myProfile', roleAuth(['tourGuide']), tourGuideController.getTourGuideById);

// Update the tour guide's profile
router.put('/updateProfile', roleAuth(['tourGuide']), tourGuideController.updateTourGuide);

const storage = multer.memoryStorage(); // Use memory storage if you're only uploading to Cloudinary
const upload = multer({ storage });

// Define the route
router.post(
    '/upload-photo', roleAuth(['tourGuide']),
    upload.single('photo'), // Use `single` middleware for single-file upload with field name `photo`
    tourGuideController.uploadTourGuidePhoto
);


router.put('/editPassword', roleAuth(['tourGuide']), tourGuideController.updatePassword);
router.get('/getall', tourGuideController.getAllTourGuides);
module.exports = router;
