const express = require('express');
const router = express.Router();
const touristControllers = require('../Controllers/UserControllers/touristController');
const productControllers = require('../Controllers/ProductControllers/ProductController');
const activityControllers = require('../Controllers/ActivityControllers/ActivityController');
const itineraryControllers = require('../Controllers/ActivityControllers/ItineraryController');
const historicalPlaceControllers = require('../Controllers/ActivityControllers/HistoricalPlacesController');
const complaintControllers= require('../Controllers/UserControllers/ComplaintController');
const bookingController = require('../Controllers/ActivityControllers/BookingController');
const loyaltyController = require('../Controllers/UserControllers/LoyaltyController');
const{ roleAuth, optionalAuth } = require('../Middleware/authMiddleware');  
const itineraryBookingController = require('../Controllers/ActivityControllers/BookingItenController');
const tourGuideController = require('../Controllers/UserControllers/tourGuideController');
const PurchaseController = require('../Controllers/ProductControllers/PurchaseController');
const TourGuideReviewController = require('../Controllers/TourGuideReview');
const cartController = require('../Controllers/ProductControllers/cartController');

// Tourist-specific routes
router.get('/myProfile', roleAuth(['tourist']), touristControllers.getTouristById);  // Tourist can read their own profile
router.put('/myProfile', roleAuth(['tourist']), touristControllers.updateTourist);   // Tourist can update their profile

// Tourist-specific routes for products
router.get('/products', optionalAuth(['tourist']), productControllers.getAllProducts);  // View all products
router.get('/products/filter-sort-search', optionalAuth(['tourist']), productControllers.getFilteredSortedProducts);  // Search products by name


//product review
router.post('product/purchase', roleAuth(['tourist']), PurchaseController.createPurchase);
router.put('/purchase/:purchaseId/review', roleAuth(['tourist']), PurchaseController.addReviewAndRating);
router.get('/purchases/my-purchases', roleAuth(['tourist']), PurchaseController.getPurchasesByUser);

//cart functions
router.post('/cart/add', roleAuth(['tourist']), cartController.addToCart);
router.get('/cart', roleAuth(['tourist']), cartController.viewCart);
router.delete('/cart/:productId', roleAuth(['tourist']), cartController.removeFromCart);
router.delete('/cart', roleAuth(['tourist']), cartController.clearCart);
router.post('/cart/checkout', roleAuth(['tourist']), cartController.checkoutCart);


// router.get('/getAllReviews',optionalAuth(['tourist']), ProductReviewControllers.getAllReviews); 
// router.get('/getMyReviews', optionalAuth(['tourist']), ProductReviewControllers.getMyReviews);
// router.post('/createProductReview', optionalAuth(['tourist']), ProductReviewControllers.createProductReview);
// router.put('/updateReviewDetails', optionalAuth(['tourist']), ProductReviewControllers.updateReviewDetails);
// router.delete('/deleteReview', optionalAuth(['tourist']), ProductReviewControllers.deleteReview);


// Tourist shared routes for viewing and filtering
// Guest shared routes for viewing and filtering
router.get('/activities', optionalAuth(['tourist', 'guest']), activityControllers.getAllActivity );  // View all activities
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
router.get('/getComplaintsByTouristAndStatus', roleAuth(['tourist']), complaintControllers.getComplaintsByTouristAndStatus);
router.get('/getComplaintsByTourist', roleAuth(['tourist']), complaintControllers.getComplaintsByTourist); 
router.delete('/deleteComplaint', roleAuth(['tourist']), complaintControllers.deleteComplaint);  

router.post('/activities/book/:activityId', roleAuth(['tourist']), activityControllers.bookActivity);
router.post('/itineraries/book/:itineraryId', roleAuth(['tourist']), itineraryControllers.bookItinerary);

router.get('/itineraries/bookings', roleAuth(['tourist']), itineraryBookingController.getMyItineraryBookings );
router.get('/activities/bookings', roleAuth(['tourist']), bookingController.getMyBookings );


router.get('/activities/:id', optionalAuth(['tourist', 'guest']), activityControllers.getActivityById);

router.post('/bookings/cancelBooking/:bookingId', roleAuth(['tourist']), bookingController.deleteBooking);
router.post('/bookings/cancelBookingItinerary/:bookingId', roleAuth(['tourist']), itineraryBookingController.cancelBookingItinerary);

router.post('/activity-bookings/add-rating/:bookingId', roleAuth(['tourist']), bookingController.setRatingForActivityBooking);
router.post('/activity-bookings/add-comment/:bookingId', roleAuth(['tourist']), bookingController.setCommentForActivityBooking);

// Itinerary Booking Routes
router.post('/itinerary-bookings/add-rating/:bookingId', roleAuth(['tourist']), itineraryBookingController.setRatingForItineraryBooking);
router.post('/itinerary-bookings/add-comment/:bookingId', roleAuth(['tourist']), itineraryBookingController.setCommentForItineraryBooking);
router.get('/itineraries/:id', optionalAuth(['tourist', 'guest']),itineraryControllers.getItineraryById);

router.get('/get-my-guides/:id',roleAuth(['tourist']), tourGuideController.getTourGuideByIdParam );

// Points and Loyalty Routes
router.get('/myPoints', roleAuth(['tourist']), loyaltyController.getPoints);
router.post('/addpoints', roleAuth(['tourist']), loyaltyController.addPoints);
router.post('/convertPointsToRedeemableAmount', roleAuth(['tourist']), loyaltyController.convertPointsToRedeemableAmount);

router.get('/myBadge', roleAuth(['tourist']), loyaltyController.getBadge);
router.put('/deleteTouristRequest', roleAuth(['tourist']), touristControllers.deleteReq);

// Route to add a review (accessible by tourists only)
router.post('/tourguideRev/add', roleAuth(['tourist']), TourGuideReviewController.addReview);

// Route to get all reviews for a specific tour guide
router.get('/getTGRevAll/:tourGuideId' , TourGuideReviewController.getReviewsForGuide);
router.get('/getTGRev/:tourGuideId',roleAuth(['tourist']), TourGuideReviewController.getReviewByTouristForGuide);

module.exports = router;
