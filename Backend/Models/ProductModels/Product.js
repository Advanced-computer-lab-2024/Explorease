const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    Name: { type: String, required: true },
    Price: { type: Number, required: true },
    Description: { type: String, required: true },
    Seller: { type: Schema.Types.ObjectId , ref : 'Seller' , required: true },
    Ratings: { type: Number, min: 1, max: 5, default: 1, required: false },
    Reviews: { type: [String], default: "" },
    AvailableQuantity: { type: Number, required: true },
    imageUrl : {type : String, required: true}
});
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;