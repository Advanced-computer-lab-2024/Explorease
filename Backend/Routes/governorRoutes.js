const express = require('express');
const router = express.Router();
const historicalPlaceController = require('../Controllers/ActivityControllers/HistoricalPlacesController');
const preferenceTagController = require('../Controllers/ActivityControllers/PreferenceTagsController');
const { roleAuth } = require('../Middleware/authMiddleware');

// Tourist Governor Routes

// Create Historical Place (Tourist Governor only)
router.post('/createHistoricalPlace', roleAuth(['touristGovernor']), historicalPlaceController.createHistoricalPlace);

// Update Historical Place (Tourist Governor only)
router.put('/updateHistoricalPlace/:id', roleAuth(['touristGovernor']), historicalPlaceController.updateHistoricalPlace);

// Get Historical Places created by the Governor (Tourist Governor only)
router.get('/getMyHistoricalPlaces', roleAuth(['touristGovernor']), historicalPlaceController.getHistoricalPlaceByGov);

// Get all Historical Places (open to all roles)
router.get('/getAllHistoricalPlaces', historicalPlaceController.getallHistoricalPlaces);

// Delete Historical Place (Tourist Governor only)
router.delete('/deleteHistoricalPlace/:id', roleAuth(['touristGovernor']), historicalPlaceController.deleteHistoricalPlace);

// Create Tags for Historical Locations (Tourist Governor only)
router.post('/createTag', roleAuth(['touristGovernor']), preferenceTagController.createTag);

module.exports = router;