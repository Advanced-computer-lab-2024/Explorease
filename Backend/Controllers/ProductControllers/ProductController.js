const productModel = require('../../Models/ProductModels/Product.js');
const { default: mongoose } = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        const products = await productModel.find({});
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to load products.", error: error.message });
    }
};


//Get my products
const getMyProducts = async (req, res) => {
    const sellerId = req.user.id; // Assume req.user is set by authentication middleware

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
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        const product = await productModel.findByIdAndDelete(_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product.", error: error.message });
    }
};

// Search product by name (case-insensitive, partial match)
const searchProductByName = async (req, res) => {
    const { name } = req.query;

    try {
        if (!name) {
            return res.status(400).json({ message: 'Product name is required' });
        }

        const products = await productModel.find({ Name: { $regex: name, $options: 'i' } }); // Case-insensitive search
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found with the specified name' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for product', error: error.message });
    }
};
// Filter products by price range
const filterProductByPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.query;

    try {
        // Build the price filter
        const priceFilter = {};
        if (minPrice) priceFilter.$gte = minPrice;
        if (maxPrice) priceFilter.$lte = maxPrice;

        // Find products within the specified price range
        const products = await productModel.find({ Price: priceFilter });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found in this price range.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering products by price', error: error.message });
    }
};

const sortProductsByRatings = async (req, res) => {
    try {
        // Find and sort products by ratings in descending order (-1)
        const sortedProducts = await productModel.find().sort({ Ratings: -1 });

        if (sortedProducts.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        res.status(200).json(sortedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error sorting products by ratings', error: error.message });
    }
};

const updateProductDetails = async (req, res) => {
    const { id } = req.params;
    const { Price, AvailableQuantity } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    console.log(userId);
    
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


module.exports = {
    createProduct,
    getAllProducts,
    deleteProduct,
    searchProductByName,
    filterProductByPrice,
    getMyProducts,
    sortProductsByRatings,
    updateProductDetails
};