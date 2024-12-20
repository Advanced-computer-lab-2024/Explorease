const productModel = require('../../Models/ProductModels/Product.js');
const { default: mongoose } = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const Purchase = require('../../Models/ProductModels/Purchase.js');
const Tourist = require('../../Models/UserModels/Tourist.js');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const createProductAdmin = async (req, res) => {
    const { Name, Price, Description, AvailableQuantity } = req.body;
    const Admin = req.admin.id;
    let imageUrl;

    try {
        // If an image file is provided, upload it to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products',  // Optional: organize your images in folders
            });
            imageUrl = result.secure_url;  // Store the image URL
        }

        // Validate that required fields are provided
        if (!Name || !Price || !Description || !AvailableQuantity || !imageUrl) {
            return res.status(400).json({ message: 'All fields (Name, Price, Description, AvailableQuantity, Image) are required.' });
        }

        const product = new productModel({
            Name,
            Price,
            Description,
            Admin,
            AvailableQuantity,
            imageUrl  // Save the image URL
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

const createProduct = async (req, res) => {
    const { Name, Price, Description, AvailableQuantity } = req.body;
    const Seller = req.user.id;
    let imageUrl;

    try {
        // If an image file is provided, upload it to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products',  // Optional: organize your images in folders
            });
            imageUrl = result.secure_url;  // Store the image URL
        }

        // Validate that required fields are provided
        if (!Name || !Price || !Description || !AvailableQuantity || !imageUrl) {
            return res.status(400).json({ message: 'All fields (Name, Price, Description, AvailableQuantity, Image) are required.' });
        }

        const product = new productModel({
            Name,
            Price,
            Description,
            Seller,
            AvailableQuantity,
            imageUrl  // Save the image URL
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};


// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({ AvailableQuantity: { $gte: 0 } });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }
        const filteredProduct = products.filter(product => !product.Archived);
        if(filteredProduct.length === 0){
            return res.status(404).json({ message: "No products found." });
        }

        res.status(200).json(filteredProduct);
    } catch (error) {
        res.status(500).json({ message: "Failed to load products.", error: error.message });
    }
};



const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await productModel.find({});
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to load products.", error: error.message });
    }
};
const getMyAdminProducts = async (req, res) => {
    const AdminId = req.admin.id // Assume req.user is set by authentication middleware

    try {
        const products = await productModel.find({ Admin: AdminId });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};


//Get my products
const getMyProducts = async (req, res) => {
    const sellerId = req.user.id; 

    try {
        const products = await productModel.find({ Seller: sellerId });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!id) {
            return res.status(400).json({ message: "Product ID is required." });
        }
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Find product by ID
        const product = await productModel.findById(id);

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Check if the user is the owner (seller) of the product
        if (userRole === 'seller' && product.Seller.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this product." });
        }

        // Delete the product
        await productModel.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product.", error: error.message });
    }
};


const deleteProduct2 = async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        const product = await productModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product.", error: error.message });
    }
};

const updateProductDetails = async (req, res) => {
    const { id } = req.params;
    const { Name, Price, AvailableQuantity, Description } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    
    try {
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        if (userRole === 'seller' && !product.Seller.equals(userId)) {
            return res.status(403).json({ message: 'You are not authorized to edit this product.' });
        }

        if (Price) product.Price = Price;
        if (AvailableQuantity) product.AvailableQuantity = AvailableQuantity;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Update (archive/unarchive) product's Archived status
const toggleProductArchiveStatus = async (req, res) => {
    const { id } = req.params; // Use id from params
    try {
        // Find the product by ID
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.Archived = !product.Archived; 

        await product.save();
        res.status(200).json({ message: 'Product archive status updated', product });
    } catch (error) {
        console.error('Error updating product archive status:', error);
        res.status(500).json({ message: 'Error updating product archive status' });
    }
};

const updateProductDetailsForAdmin = async (req, res) => {
    const { id } = req.params;
    const { Price, AvailableQuantity } = req.body;

    try {
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        if (Price) product.Price = Price;
        if (AvailableQuantity) product.AvailableQuantity = AvailableQuantity;

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Unified controller to search, filter by price, and sort products
const getFilteredSortedProducts = async (req, res) => {
    const { name, minPrice, maxPrice, sortByRatings } = req.query;

    try {
        // Create the filter object
        let filter = {};

        filter.AvailableQuantity.$gte = 0;
        // If a name is provided, add it to the filter with a case-insensitive regex
        if (name) {
            filter.Name = { $regex: name, $options: 'i' }; // Case-insensitive regex for partial matches
        }

        // If price filtering is provided, add the price range to the filter
        if (minPrice || maxPrice) {
            filter.Price = {};
            if (minPrice) filter.Price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
            if (maxPrice) filter.Price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
        }

        // Initialize sorting object
        let sortOption = {};

        // If sorting by ratings is requested, add it to the sort option
        if (sortByRatings) {
            sortOption.Ratings = sortByRatings === 'desc' ? -1 : 1; // Sort ratings in descending or ascending order
        }

        // Fetch products based on the filter and sorting criteria
        const products = await productModel.find(filter).sort(sortOption);

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

const getFilteredSortedProductsBySeller = async (req, res) => {
    const { name, minPrice, maxPrice, sortByRatings } = req.query;

    try {
        // Create the filter object and ensure only the seller's products are fetched
        let filter = { Seller: req.user.id }; // This ensures the products returned belong to the authenticated seller

        // If a name is provided, add it to the filter with a case-insensitive regex
        if (name) {
            filter.Name = { $regex: name, $options: 'i' }; // Case-insensitive regex for partial matches
        }

        // If price filtering is provided, add the price range to the filter
        if (minPrice || maxPrice) {
            filter.Price = {};
            if (minPrice) filter.Price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
            if (maxPrice) filter.Price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
        }

        // Initialize sorting object
        let sortOption = {};

        // If sorting by ratings is requested, add it to the sort option
        if (sortByRatings) {
            sortOption.Ratings = sortByRatings === 'desc' ? -1 : 1; // Sort ratings in descending or ascending order
        }

        // Fetch products based on the filter and sorting criteria
        const products = await productModel.find(filter).sort(sortOption);

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

const getProductsBySellerId = async (req, res) => {
    try {
        const { id } = req.params; // Extract seller ID from request parameters

        // Find all products that match the seller's ID
        const products = await productModel.find({ Seller: id });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }

        // Delete all products related to the seller ID
        await productModel.deleteMany({ Seller: id });

        res.status(200).json({ message: 'Products retrieved and deleted successfully', deletedProducts: products });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving or deleting products', error: error.message });
    }
};

// Controller to fetch reviews, ratings, and usernames by product
const getProductReviewsAndRatings = async (req, res) => {
    try {
        const { productId } = req.params;  // Get productId from request parameters

        // Fetch all purchases for the given product with associated buyer details
        const purchases = await Purchase.find({ productId })
            .populate('productId', 'name') // Populate product details (e.g., name)
            .populate('buyerId', 'username') // Populate buyer (tourist) details (e.g., username)
            .select('productId review rating buyerId'); // Select relevant fields from purchases

        // Check if there are any purchases for the product
        if (purchases.length === 0) {
            return res.status(404).json({ message: 'No reviews or ratings found for this product' });
        }

        // Create a map of reviews and ratings by userId to ensure one entry per user
        const productReviews = purchases.reduce((acc, purchase) => {
            const userId = purchase.buyerId._id.toString();

            // If the user hasn't already left a review and rating for this product, add them
            if (!acc[userId]) {
                acc[userId] = {
                    review: purchase.review || null,  // If review exists, use it
                    rating: purchase.rating || null,  // If rating exists, use it
                    username: purchase.buyerId.username,
                };
            } else {
                // If the user has left a review or rating, we update the existing entry
                if (purchase.review) {
                    acc[userId].review = purchase.review;
                }
                if (purchase.rating) {
                    acc[userId].rating = purchase.rating;
                }
            }

            return acc;
        }, {});

        // Prepare the reviews and ratings data for response
        const reviews = [];
        const ratings = [];

        // Populate reviews and ratings arrays
        for (const userId in productReviews) {
            const userReview = productReviews[userId];
            if (userReview.review) {
                reviews.push({
                    review: userReview.review,
                    username: userReview.username,
                });
            }
            if (userReview.rating) {
                ratings.push({
                    rating: userReview.rating,
                    username: userReview.username,
                });
            }
        }

        // Prepare the final result
        const result = {
            productId,
            productName: purchases[0].productId.name, // All reviews will be for the same product, so we can get the name from the first item
            reviews,
            ratings,
        };

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching product reviews and ratings:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};



module.exports = {
    getProductReviewsAndRatings,
};



module.exports = {
    createProduct,
    getAllProducts,
    deleteProduct,
    getMyProducts,
    updateProductDetails,
    toggleProductArchiveStatus,
    getFilteredSortedProducts,
    getFilteredSortedProductsBySeller,
    deleteProduct2,
    updateProductDetailsForAdmin,
    getAllProductsAdmin,
    getMyAdminProducts,
    createProductAdmin,
    getProductsBySellerId,
    getProductReviewsAndRatings
};