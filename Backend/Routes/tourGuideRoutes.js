const express = require('express');
const router = express.Router();
const itineraryController = require('../Controllers/ActivityControllers/ItineraryController');
const tourGuideController = require('../Controllers/UserControllers/tourGuideController');
const { roleAuth } = require('../Middleware/authMiddleware');

// Routes for Tour Guide to create, read, update, and delete itineraries

// Create Itinerary (Tour Guide specific)
router.post('/createItinerary', roleAuth(['tourGuide']), itineraryController.createItinerary);

// Read all itineraries created by the tour guide
router.get('/myItineraries', roleAuth(['tourGuide']), itineraryController.readItinerary);

//Read all itineraries 
router.get('/allItineraries', itineraryController.getAllItinerary);

// Update an itinerary
router.put('/updateItinerary/:id', roleAuth(['tourGuide']), itineraryController.updateItinerary);

// Delete an itinerary
router.delete('/deleteItinerary/:id', roleAuth(['tourGuide']), itineraryController.deleteItinerary);

//Get my profile.
router.get('/myProfile', roleAuth(['tourGuide']), tourGuideController.getTourGuideById);

// Update the tour guide's profile
router.put('/updateProfile', roleAuth(['tourGuide']), tourGuideController.updateTourGuide);

module.exports = router;
