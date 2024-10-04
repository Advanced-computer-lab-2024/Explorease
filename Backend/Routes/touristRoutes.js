const express = require('express');
const router = express.Router();
const touristControllers = require('../Controllers/UserControllers/touristController');
const productControllers = require('../Controllers/ProductControllers/ProductController');
const activityControllers = require('../Controllers/ActivityControllers/ActivityController');
const itineraryControllers = require('../Controllers/ActivityControllers/ItineraryController');
const historicalPlaceControllers = require('../Controllers/ActivityControllers/HistoricalPlacesController');
const{ roleAuth, optionalAuth } = require('../Middleware/authMiddleware');  // For tourist-specific routes
  // For tourist/guest shared routes

// Tourist-specific routes
router.get('/myProfile', roleAuth(['tourist']), touristControllers.getTouristById);  // Tourist can read their own profile
router.put('/myProfile', roleAuth(['tourist']), touristControllers.updateTourist);   // Tourist can update their profile

// Tourist-specific routes for products
router.get('/products', roleAuth(['tourist']), productControllers.getAllProducts);  // View all products
router.get('/products/search', roleAuth(['tourist']), productControllers.searchProductByName);  // Search products by name
router.get('/products/filter', roleAuth(['tourist']), productControllers.filterProductByPrice);  // Filter products by price
router.get('/products/sortByRating', roleAuth(['tourist']), productControllers.sortProductsByRatings);  // Sort products by rating

// Tourist/Guest shared routes for viewing and filtering
router.get('/activities', optionalAuth(['tourist', 'guest']), activityControllers.getAllActivity);  // View all activities
router.get('/itineraries', optionalAuth(['tourist', 'guest']), itineraryControllers.getAllItinerary);  // View all itineraries
router.get('/historical-places', optionalAuth(['tourist', 'guest']), historicalPlaceControllers.getallHistoricalPlaces);  // View all historical places

// Filtering and searching (Activities, Itineraries, Historical Places)
router.get('/activities/search', optionalAuth(['tourist', 'guest']), activityControllers.searchActivitiesByNameOrCategoryOrTag);  // Search activities by name, category, or tag
router.get('/itineraries/search', optionalAuth(['tourist', 'guest']), itineraryControllers.searchItinerariesByNameOrCategoryOrTag);  // Search itineraries by name, category, or tag
router.get('/historical-places/search', optionalAuth(['tourist', 'guest']), historicalPlaceControllers.searchHistoricalPlaces);  // Search historical places by tag

// Filter routes for activities, itineraries, and historical places
router.get('/activities/filter', optionalAuth(['tourist', 'guest']), activityControllers.filterActivitiesByBudgetOrDateOrCategoryOrRating);  // Filter activities by budget, date, category, or ratings
router.get('/activities/sort', optionalAuth(['tourist', 'guest']), activityControllers.sortActivity);  // Filter activities by budget, date, category, or ratings
router.get('/itineraries/filter', optionalAuth(['tourist', 'guest']), itineraryControllers.filterUpcomingItineraries);  // Filter itineraries by budget, date, preferences, or language
router.get('/historical-places/filter', optionalAuth(['tourist', 'guest']), historicalPlaceControllers.filterHistoricalPlaceByTag);  // Filter historical places by tag

router.get('/itineraries/sort', optionalAuth(['tourist', 'guest']), itineraryControllers.sortItineraries);
module.exports = router;
