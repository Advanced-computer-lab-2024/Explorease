const mongoose = require('mongoose');
const Admin = require('../UserModels/Admin');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    Name: { type: String, required: true },
    Price: { type: Number, required: true },
    Description: { type: String, required: true },
    Seller: { type: Schema.Types.ObjectId , ref : 'Seller'},
    Admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
    AvailableQuantity: { type: Number, required: true },
    Archived: { type: Boolean, default: false },
    Sales: { type: Number, default: 0 },
    imageUrl : {type : String, required: true},
    Ratings : {type : Number, max : 5}
});
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;