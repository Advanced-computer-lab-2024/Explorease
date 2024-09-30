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

 module.exports = {postProduct, getAllProducts, getProductbyName, putProductPriceandDetails,deleteProduct};