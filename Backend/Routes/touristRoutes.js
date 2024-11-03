const express = require('express');
const router = express.Router();
const touristControllers = require('../Controllers/UserControllers/touristController');
const productControllers = require('../Controllers/ProductControllers/ProductController');
const activityControllers = require('../Controllers/ActivityControllers/ActivityController');
const itineraryControllers = require('../Controllers/ActivityControllers/ItineraryController');
const historicalPlaceControllers = require('../Controllers/ActivityControllers/HistoricalPlacesController');
const complaintControllers= require('../Controllers/UserControllers/ComplaintController');
const{ roleAuth, optionalAuth } = require('../Middleware/authMiddleware');  // For tourist-specific routes
  // For tourist/guest shared routes

// Tourist-specific routes
router.get('/myProfile', roleAuth(['tourist']), touristControllers.getTouristById);  // Tourist can read their own profile
router.put('/myProfile', roleAuth(['tourist']), touristControllers.updateTourist);   // Tourist can update their profile

// Tourist-specific routes for products
router.get('/products', optionalAuth(['tourist']), productControllers.getAllProducts);  // View all products
router.get('/products/filter-sort-search', optionalAuth(['tourist']), productControllers.getFilteredSortedProducts);  // Search products by name


// Tourist shared routes for viewing and filtering
// Guest shared routes for viewing and filtering
router.get('/activities', optionalAuth(['tourist', 'guest']), activityControllers.filterSortSearchActivities );  // View all activities
router.get('/itineraries', optionalAuth(['tourist', 'guest']), itineraryControllers.getAllActivatedItinerary);  // View all itineraries
router.get('/historical-places', optionalAuth(['tourist', 'guest']), historicalPlaceControllers.getallHistoricalPlaces);  // View all historical places

// Filtering and searching (Activities, Itineraries, Historical Places)
router.get('/activities/filter-sort-search', optionalAuth(['tourist', 'guest']), activityControllers.filterSortSearchActivities );  // Search activities by name, category, or tag
router.get('/itineraries/filter-sort-search', optionalAuth(['tourist', 'guest']), itineraryControllers.filterSortSearchItineraries);  // Search itineraries by name, category, or tag
router.get('/historical-places/filter-sort-search', optionalAuth(['tourist', 'guest']), historicalPlaceControllers.filterSortSearchHistoricalPlaces);  // Search historical places by tag

// Filter routes for activities, itineraries, and historical places
router.put('/editPassword', roleAuth(['tourist']), touristControllers.editPassword);

// Tourist can file a complaint
router.post('/addComplaint', roleAuth(['tourist']), complaintControllers.addComplaint);   

module.exports = router;
