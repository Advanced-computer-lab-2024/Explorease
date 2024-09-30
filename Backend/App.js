// Dependecies Export
const { check } = require('express-validator');
const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('./Middleware/authMiddleware.js');
const authenticateAdmin = require('./Middleware/adminAuthMiddleware');
const touristControllers = require('./Controllers/UserControllers/touristController');
const sellerController = require('./Controllers/UserControllers/sellerController');
const tourGuideController = require('./Controllers/UserControllers/tourGuideController');
const advertiserController = require('./Controllers/UserControllers/advertiserController');
const adminController = require('./Controllers/UserControllers/adminController');
const activityControllers = require('./Controllers/ActivityControllers/ActivityController');
const historicLocationController = require('./Controllers/ActivityControllers/HistoricalPlacesController');
const productControllers = require('./Controllers/ProductControllers/ProductController');
const iteniraryControllers = require('./Controllers/ActivityControllers/IteniraryController');
const activityCategoryController = require('./Controllers/ActivityControllers/ActivityCategoryController');
const preferenceTagController = require('./Controllers/ActivityControllers/PreferenceTagsController.js')


mongoose.set('strictQuery', false);
require('dotenv').config();

// App Variables
const app = express();
const port = 3000;


mongoose.connect(process.env.Mongo_URI)
    .then(() => {
        console.log("MongoDB is now connected!");
        app.listen(port, () => {
            console.log(`Listening to requests on http://localhost:${port}`);
        });
    }).catch(err => console.log(err));

app.use(express.json());


// Tourist Routers 
app.post('/createTourist', touristControllers.createTourist);
app.get('/getTourists', touristControllers.getAllTourists);
app.put('/updateTourist/:id', touristControllers.updateTourist);
app.delete('/deleteTourist/:id', touristControllers.deleteTourist);
app.get('/getTourist/:id', touristControllers.getTouristById);

// Tourist Guide Routers
app.post('/createGuide', tourGuideController.createTourGuide);
app.get('/getTourGuides', tourGuideController.getAllTourGuides);
app.get('/getTourGuide/:id', tourGuideController.getTourGuideById);
app.put('/updateGuide/:id', tourGuideController.updateTourGuide);
app.delete('/deleteGuide/:id', tourGuideController.deleteTourGuide);
app.post('/loginTourGuide', tourGuideController.loginTourGuide);


// Seller Routers
app.post('/createSeller', sellerController.createSeller);
app.get('/getSellers', sellerController.getAllSellers);
app.get('/getSeller/:id', sellerController.getSellerById);
app.put('/updateSeller/:id', sellerController.updateSeller);
app.delete('/deleteSeller/:id', sellerController.deleteSeller);

// Advertiser Routers 
app.post('/createAdvertiser', advertiserController.createAdvertiser);
app.get('/getAdvertisers', advertiserController.getAllAdvertisers);
app.get('/getAdvertiser/:id', advertiserController.getAdvertiserById);
app.put('/updateAdvertiser/:id', advertiserController.updateAdvertiser);
app.delete('/deleteAdvertiser/:id', advertiserController.deleteAdvertiser);
app.post('/loginAdvertiser', advertiserController.loginAdvertiser);


// Admin Activity Category Routers
app.post('/category', authenticateAdmin, activityCategoryController.createCategory); // Admin can create a category
app.get('/categories', activityCategoryController.getAllCategories); // Anyone can get all categories
app.put('/category/:id', authenticateAdmin, activityCategoryController.updateCategory); // Admin can update a category
app.delete('/category/:id', authenticateAdmin, activityCategoryController.deleteCategory); // Admin can delete a category

//Activity Routers 
app.post('/createActivity', authenticate, activityControllers.createActivity); // Protected route with authentication
app.get('/getActivities', activityControllers.readActivities); // Open route
app.put('/updateActivity/:id', authenticate, activityControllers.updateActivity); // Protected route
app.delete('/deleteActivity/:id', authenticate, activityControllers.deleteActivity); // Protected route

 //Filter activity by budget and date
 app.get('/filterUpcomingActivityByBudget', activityControllers.filterUpcomingActivityByBudget); 
 app.get('/filterUpcomingActivityByDate', activityControllers.filterUpcomingActivityByDate); 


//Historic Location Router
app.post('/createLocation', authenticate, historicLocationController.createHistoricalPlace);
app.get('/getHistoricLocations', historicLocationController.getHistoricalPlaces);
app.get('/getTicketPrice', historicLocationController.getTicketPrice);
app.get('/getHistoricLocationsByType', historicLocationController.getHistoricalPlacesByType);
app.put('/updateHistoricalLocation/:id', historicLocationController.updateHistoricalPlace);
app.delete('/deleteHistoricLocation', historicLocationController.deleteHistoricalPlace);


//Product Routers
app.post('/createProduct', authenticate, productControllers.postProduct);
app.get('/getProducts', productControllers.getAllProducts);
app.put('/updateProductPriceDetails', productControllers.putProductPriceandDetails);
app.delete('/deleteProduct', productControllers.deleteProduct);

// Itenirary Routers
app.post('/createItenirary', authenticate, iteniraryControllers.createItenirary);
app.get('/getItenraries', iteniraryControllers.readItenirary);
app.put('/updateItenirary/:id', iteniraryControllers.updateItenirary);
app.delete('/deleteItenirary/:id', iteniraryControllers.deleteItenirary);


//Admin Routers
app.delete('/deleteAdmin/:id', authenticateAdmin, adminController.deleteAdminAccount);
app.post('/loginAdmin', adminController.loginAdmin);
app.post('/addAdmin',
    authenticateAdmin, [
        check('username').notEmpty().withMessage('Username is required'),
        check('email').isEmail().withMessage('Enter a valid email'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    adminController.addAdmin);

app.post('/addTourismGovernor',
    authenticateAdmin, [
        check('username').notEmpty().withMessage('Username is required'),
        check('email').isEmail().withMessage('Enter a valid email'),
        check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    adminController.addTourismGovernor);

app.post('/createMainAdmin', adminController.createMainAdmin);

// preference tags routers
app.post('/createTag', preferenceTagController.createTag);
app.get('/tags', preferenceTagController.getAllTags);
app.get('/tags/:id', preferenceTagController.getTagById);
app.put('/updateTag', preferenceTagController.updateTag);
app.delete('/deleteTag/:id', preferenceTagController.deleteTag);