// advertiserRouter.js
const express = require('express');
const router = express.Router();
const advertiserController = require('../Controllers/UserControllers/advertiserController');
const activityController = require('../Controllers/ActivityControllers/ActivityController');
const { roleAuth } = require('../Middleware/authMiddleware'); // Assuming roleAuth is already defined

// Advertiser-specific routes
router.get('/myProfile', roleAuth(['advertiser']), advertiserController.getAdvertiserById);  // Get own profile
router.put('/updateProfile',roleAuth(['advertiser']), advertiserController.updateAdvertiser);
router.delete('/deleteProfile', roleAuth(['advertiser']), advertiserController.deleteAdvertiser); // Delete own profile

// Advertiser can create activities
router.post('/createActivity', roleAuth(['advertiser']), activityController.createActivity);
router.get('/getMyActivities',  roleAuth(['advertiser']) , activityController.readActivities);
router.get('/filter-sort-search', roleAuth(['advertiser']), activityController.filterSortSearchActivitiesByAdvertiser);
router.delete('/deleteActivity/:id', roleAuth(['advertiser']), activityController.deleteActivity);
// Add the update activity route
router.put('/updateActivity/:id', roleAuth(['advertiser']), activityController.updateActivity);

// Export the router
module.exports = router;
