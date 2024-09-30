const productModel = require('../../Models/ProductModels/Product.js');
const { default: mongoose } = require('mongoose');


const postProduct = async(req,res) => {
    try{
     const {Name, Price, Description, Seller, Ratings, Reviews , AvailableQuantity} = req.body; 
 
     if(!Name || !Price || !Description || !Seller || !Ratings || !Reviews || !AvailableQuantity){
       return res.status(400).json({message : "All fields are required."});
     }
 
     const newProduct = new productModel({Name, Price, Description, Seller, Ratings, Reviews , AvailableQuantity});

     await newProduct.save();

     res.status(200).json({message : "Product Posted successfully."});
   }catch(error){
    res.status(500).json({message : "Failed to create product. "});
 
   }
 }

const getAllProducts = async (req, res) => {
   try {
      const Product = await productModel.find({});

      res.status(200).json(Product);
   } catch (error) {
      res.status(500).json({message : "Failed to load Products"});
   }
  }

  const getProductbyName = async (req, res) => {
    try {
       const {Name } = req.body;
       const Product = await productModel.find({Name});

       res.status(200).json(Product);
    } catch (error) {
       res.status(500).json({message : "Failed to load Product"});
    }
   }

   const putProductPriceandDetails = async (req, res) => {
    try {
       const {_id,Price, Description} = req.body;
       const Product = await productModel.findById(_id);
 
       Product.Price = Price || Product.Price;
       Product.Description= Description || Product.Description;

 
       await Product.save();
       res.status(200).json({message : "Product  updated successfully"})
 

    } catch (error) {
       res.status(500).json({message : "Failed to update product "});
    }

   }

   const deleteProduct = async (req, res) => {
    try {
       const {_id } = req.body;
       await productModel.findByIdAndDelete(_id);
 
       res.status(200).json({message : "Product deleted successfully"})
 
    } catch (error) {
       res.status(500).json({message : "Failed to delete product"});
    }
  
   }
   const searchProductByName = async (req, res) => {
      try {
          const { Name } = req.body; // Extract product name from the request body
  
          if (!Name) {
              return res.status(400).json({ message: "Product name is required for search." });
          }
  
          // Use regex for case-insensitive, partial matching
          const products = await productModel.find({
              Name: { $regex: Name, $options: 'i' } // 'i' makes it case-insensitive
          });
  
          if (products.length === 0) {
              return res.status(404).json({ message: "No products found matching the given name." });
          }
  
          res.status(200).json(products);
      } catch (error) {
          res.status(500).json({ message: "Failed to search products.", error: error.message });
      }
  };

  const filterProductByPrice = async (req, res) => {
   try {
       const { minPrice, maxPrice } = req.body; // Extract minPrice and maxPrice from the request body

       // Validate if at least one price range is provided
       if (minPrice === undefined && maxPrice === undefined) {
           return res.status(400).json({ message: 'At least one of minPrice or maxPrice is required.' });
       }

       // Build the price filter based on provided minPrice and maxPrice
       let priceFilter = {};
       if (minPrice !== undefined) {
           priceFilter.$gte = minPrice; // Price greater than or equal to minPrice
       }
       if (maxPrice !== undefined) {
           priceFilter.$lte = maxPrice; // Price less than or equal to maxPrice
       }

       // Find products within the price range
       const products = await productModel.find({
           Price: priceFilter
       });

       if (products.length === 0) {
           return res.status(404).json({ message: 'No products found within the specified price range.' });
       }

       res.status(200).json(products);
   } catch (error) {
       res.status(500).json({ message: 'Failed to filter products by price.', error: error.message });
   }
};
 


   


 module.exports = {postProduct, getAllProducts, getProductbyName, putProductPriceandDetails,deleteProduct,searchProductByName,filterProductByPrice};