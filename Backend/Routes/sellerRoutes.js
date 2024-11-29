const express = require('express');
const router = express.Router();
const sellerController = require('../Controllers/UserControllers/sellerController');
const productController = require('../Controllers/ProductControllers/ProductController');  // Ensure correct path
const { roleAuth } = require('../Middleware/authMiddleware');
const notificationController = require('../Controllers/UserControllers/NotificationController');

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // This is now defined after the package is installed
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'products',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
});

const upload = multer({ storage });

// Seller-specific routes

// Get Seller profile
router.get('/myProfile', roleAuth(['seller']), sellerController.getSellerById);

// Update Seller profile
router.put('/myProfile', roleAuth(['seller']), sellerController.updateSeller);

// Create a new product
router.post('/createProduct', roleAuth(['seller']), upload.single('image'), productController.createProduct);


//Get my products
router.get('/myproducts', roleAuth(['seller']), productController.getMyProducts);
router.get('/products',roleAuth(['seller']), productController.getAllProducts);
router.get('/myproducts/filter-sort-search', roleAuth(['seller']), productController.getFilteredSortedProductsBySeller);
router.delete('/productsBySeller/:id', productController.getProductsBySellerId);
router.get('/')


// Update a product
router.put('/updateProduct/:id', roleAuth(['seller']), productController.updateProductDetails);
router.delete('/deleteProduct/:id', roleAuth(['seller']), productController.deleteProduct);
router.put('/archiveProduct/:id', roleAuth(['seller']), productController.toggleProductArchiveStatus);
router.put('/editPassword', roleAuth(['seller']), sellerController.updatePassword);

// router.get('/searchProduct', roleAuth(['seller']) , productController.searchProductByName);
router.get('/getall', sellerController.getAllSellers);

router.put('/deleteSellerRequest' , roleAuth(['seller']), sellerController.deleteReq);

router.post(
    '/upload-photo',
    roleAuth(['seller']), // Role authentication for sellers only
    sellerController.upload.single('photo'), // Single file upload middleware with field 'photo'
    sellerController.uploadSellerPhoto // Controller method for uploading
);

//notifications routes
router.post('/notifications', notificationController.createNotification);
router.get('/notifications', roleAuth(['seller']), notificationController.getNotifications);
router.put('/notifications/:id', roleAuth(['seller']), notificationController.markNotificationAsRead);
router.delete('/notifications/:id', roleAuth(['seller']), notificationController.deleteNotification);

// Export only the router
module.exports = router;
