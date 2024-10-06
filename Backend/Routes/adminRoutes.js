// adminRouter.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const adminController = require('../Controllers/UserControllers/adminController');
const authenticateAdmin = require('../Middleware/adminAuthMiddleware');
const tagController = require('../Controllers/ActivityControllers/PreferenceTagsController');
const activityController = require('../Controllers/ActivityControllers/ActivityCategoryController');
const productController = require('../Controllers/ProductControllers/ProductController'); // Ensure correct path
const {optionalAuth} = require('../Middleware/authMiddleware');
// Admin Routes

// Add Main Admin (can be used once to create the first admin)
router.post('/createMainAdmin', adminController.createMainAdmin);

// Add Admin (Only main admin can add other admins)
router.post('/add', [
    authenticateAdmin,
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], adminController.addAdmin);

// Login Admin
router.post('/login', adminController.loginAdmin);
router.get('/all', authenticateAdmin, adminController.getAllAdmins);

// Add Tourism Governor
router.post('/addGovernor', [
    authenticateAdmin,
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], adminController.addTourismGovernor);

// Delete Admin Account (Only the main admin can delete admins)
router.delete('/delete/:id', authenticateAdmin, adminController.deleteAdminAccount);

// Product Management by Admin (search/filter)
// router.get('/searchProductByName', authenticateAdmin, searchProductByName);
// router.get('/filterProductByPrice', authenticateAdmin, filterProductByPrice);

router.post('/createTags',authenticateAdmin, tagController.createTag);
router.put('/updateTag/:id', authenticateAdmin, tagController.updateTag);
router.get('/getTags',optionalAuth(['guest']), tagController.getAllTags);
router.delete('/deleteTag/:id', authenticateAdmin, tagController.deleteTag);



// must add another middleware to check the activity I create category for is free.
router.post('/createCategory', authenticateAdmin, activityController.createCategory);
router.put('/updateCategory/:id', authenticateAdmin, activityController.updateCategory);
router.get('/getCategories', optionalAuth(['guest']), activityController.getAllCategories);
router.delete('/deleteCategory/:id', authenticateAdmin, activityController.deleteCategory);

router.get('/products', authenticateAdmin, productController.getAllProducts);
// router.get('/searchProductByName', authenticateAdmin, productController.searchProductByName);
// router.get('/products', authenticateAdmin, productController.getAllProducts);
// router.get('/products/filter', authenticateAdmin, productController.filterProductByPrice);  // Filter products by price
// router.get('/products/sortByRating', authenticateAdmin, productController.sortProductsByRatings);
router.put('/updateProduct/:id', authenticateAdmin, productController.updateProductDetails);


router.get('/tourists', authenticateAdmin, adminController.getAllTourists);
router.get('/sellers', authenticateAdmin, adminController.getAllSellers);
router.get('/tourismGovernors', authenticateAdmin, adminController.getAllTourismGovernors);
router.get('/tourGuides', authenticateAdmin, adminController.getAllTourguides);
router.get('/advertisers', authenticateAdmin, adminController.getAllAdvertisers);

// Delete user by ID (universal delete route for any user)
router.delete('/deleteUser/:id/:userType', authenticateAdmin, adminController.deleteUser);
 

module.exports = router;
