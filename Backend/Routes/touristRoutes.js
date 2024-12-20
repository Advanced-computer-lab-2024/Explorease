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
const wishlistController = require('../Controllers/ProductControllers/wishlistController');
const promoCodeController = require('../Controllers/ProductControllers/PromoCodeController');
const savedActivityController = require('../Controllers/ActivityControllers/SavedActivityController');
const notificationController = require('../Controllers/UserControllers/NotificationController');
const savedItineraryController = require('../Controllers/ActivityControllers/SavedItinerary');
const flightController = require('../Controllers/flightController');
const hotelController = require('../Controllers/hotelController');


// Tourist-specific routes
router.get('/myProfile', roleAuth(['tourist']), touristControllers.getTouristById);  // Tourist can read their own profile
router.put('/myProfile', roleAuth(['tourist']), touristControllers.updateTourist);   // Tourist can update their profile

// Tourist-specific routes for products
router.get('/products', productControllers.getAllProducts);  // View all products
router.get('/products/filter-sort-search', optionalAuth(['tourist']), productControllers.getFilteredSortedProducts);  // Search products by name

//promo code 
router.get('/promocode/:name', optionalAuth(['tourist']), promoCodeController.getPromoCodeByName);
router.post('/promocode', roleAuth(['tourist']), promoCodeController.applyPromoCode);


//product review
router.post('/product/purchase', roleAuth(['tourist']), PurchaseController.createPurchase);
router.put('/purchase/:purchaseId/review', roleAuth(['tourist']), PurchaseController.addReviewAndRating);
router.get('/purchases/my-purchases', roleAuth(['tourist']), PurchaseController.getPurchasesByUser);
router.delete('/purchases/:purchaseId/cancel',roleAuth(['tourist']) , PurchaseController.cancelPurchase);


//cart functions
router.post('/cart/add', roleAuth(['tourist']), cartController.addToCart);
router.get('/cart', roleAuth(['tourist']), cartController.viewCart);
router.delete('/cart/:productId', roleAuth(['tourist']), cartController.removeFromCart);
router.delete('/cart', roleAuth(['tourist']), cartController.clearCart);
router.post('/cart/checkout', roleAuth(['tourist']), cartController.checkoutCart);
router.put('/cart/update', roleAuth(['tourist']), cartController.updateCartQuantity);
router.post('/cart/apply-promo', roleAuth(['tourist']), cartController.applyPromoCode);



// router.get('/getAllReviews',optionalAuth(['tourist']), ProductReviewControllers.getAllReviews); 
// router.get('/getMyReviews', optionalAuth(['tourist']), ProductReviewControllers.getMyReviews);
// router.post('/createProductReview', optionalAuth(['tourist']), ProductReviewControllers.createProductReview);
// router.put('/updateReviewDetails', optionalAuth(['tourist']), ProductReviewControllers.updateReviewDetails);
// router.delete('/deleteReview', optionalAuth(['tourist']), ProductReviewControllers.deleteReview);


// Tourist shared routes for viewing and filtering
// Guest shared routes for viewing and filtering
router.get('/activities',  activityControllers.getAllActivityTourist );  // View all activities
router.get('/itineraries', itineraryControllers.getAllActivatedItinerary);  // View all itineraries
router.get('/historical-places',historicalPlaceControllers.getallHistoricalPlaces);  // View all historical places

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

router.post('/subscribeToActivity/:activityId', roleAuth(['tourist']), activityControllers.subscribeToActivity);

// Route to add a review (accessible by tourists only)
router.post('/tourguideRev/add', roleAuth(['tourist']), TourGuideReviewController.addReview);

// Route to get all reviews for a specific tour guide
router.get('/getTGRevAll/:tourGuideId' , TourGuideReviewController.getReviewsForGuide);
router.get('/getTGRev/:tourGuideId',roleAuth(['tourist']), TourGuideReviewController.getReviewByTouristForGuide);

// Wishlist routes
router.post('/wishlist/add', roleAuth(['tourist']), wishlistController.addToWishlist );
router.get('/wishlist', roleAuth(['tourist']), wishlistController.getWishlist);
router.delete('/wishlist/:productId', roleAuth(['tourist']), wishlistController.removeFromWishlist);


//Delivery addresses
router.post('/delivery-address', roleAuth(['tourist']), touristControllers.addDeliveryAddress);

// Get all delivery addresses
router.get('/delivery-address', roleAuth(['tourist']), touristControllers.getDeliveryAddresses);

// Delete a delivery address
router.delete('/delivery-address/:addressId', roleAuth(['tourist']), touristControllers.deleteDeliveryAddress);

//get all notifications
router.get('/notifications', roleAuth(['tourist']), notificationController.getNotifications);

// stripe routes
router.post('/cart/stripe-session', roleAuth(['tourist']), cartController.createStripeSession);

router.post('/cart/stripe-success', roleAuth(['tourist']), cartController.stripeSuccess);

//saved activity routes
router.post('/saved-activity/:activityId', roleAuth(['tourist']), savedActivityController.saveActivity);
router.get('/saved-activity/', roleAuth(['tourist']), savedActivityController.getSavedActivities);
router.delete('/saved-activity/:activityId', roleAuth(['tourist']), savedActivityController.deleteSavedActivity);


//Saved Itinerary Routes : 
router.post('/save/:itineraryId',roleAuth(['tourist']) , savedItineraryController.saveItinerary); // Save itinerary
router.get('/saved-itineraries', roleAuth(['tourist']), savedItineraryController.getSavedItineraries); // Get saved itineraries
router.delete('/saved-itineraries/:itineraryId', roleAuth(['tourist']), savedItineraryController.deleteSavedItinerary); // Delete saved itinerary

// Stripe routes for itineraries
//router.post('/itineraries/stripe-session/:itineraryId', roleAuth(['tourist']), itineraryControllers.createStripeSession);
//router.get('/itineraries/stripe-success', roleAuth(['tourist']), itineraryControllers.stripeSuccess);

router.post('/activities/stripe-session', roleAuth(['tourist']), bookingController.createStripeSession);
router.post('/activities/stripe-success', roleAuth(['tourist']), bookingController.stripeSuccessActivity);

router.post('/itineraries/stripe-session', roleAuth(['tourist']), itineraryBookingController.createStripeSessionForItinerary);
router.post('/itineraries/stripe-success', roleAuth(['tourist']), itineraryBookingController.stripeSuccessItinerary);

router.post('/flights/stripe-session', roleAuth(['tourist']), flightController.createStripeSession);
router.post('/hotels/stripe-session', roleAuth(['tourist']), hotelController.createStripeSession);

router.get('/activities/booked/booked-activities', roleAuth(['tourist']), activityControllers.getBookedActivities);
router.get('/itineraries/booked/booked-itineraries', roleAuth(['tourist']), itineraryControllers.getBookedItineraries);
router.get('/products/getreviews/:productId', productControllers.getProductReviewsAndRatings);
router.get('/activities/getreviews/:activityId', activityControllers.getActivityReviewsAndRatings);
module.exports = router;
