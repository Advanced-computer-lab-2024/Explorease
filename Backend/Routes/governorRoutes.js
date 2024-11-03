const express = require('express');
const router = express.Router();
const historicalPlaceController = require('../Controllers/ActivityControllers/HistoricalPlacesController');
const preferenceTagController = require('../Controllers/ActivityControllers/PreferenceTagsController');
const touristGovernorController = require('../Controllers/UserControllers/tourismGovernorController');
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

// Get My Profile
router.get('/myProfile', roleAuth(['touristGovernor']), touristGovernorController.getTouristGovernorById);

// Update My Profile   
router.put('/updateProfile', roleAuth(['touristGovernor']), touristGovernorController.updateTouristGovernor);

// Delete My Profile
router.delete('/deleteProfile', roleAuth(['touristGovernor']), touristGovernorController.deleteTouristGovernor);

router.put('/editPassword', roleAuth(['touristGovernor']), touristGovernorController.editPassword);

module.exports = router;
