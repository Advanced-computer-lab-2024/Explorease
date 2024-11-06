const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductReviewSchema = new Schema({
Tourist: {type: Schema.Types.ObjectId , ref : 'Tourist' , required: false},
Product: {type: Schema.Types.ObjectId , ref : 'Product' , required: false},
Rating: { type: Number, min: 1, max: 5, default: 1, required: false},
Details: {type: [String], default: "" , required : false},
CreatedAt : {type: Date, default: Date.now }
}, { timestamps: true });
const ProductReview = mongoose.model('ProductReview', ProductReviewSchema);
module.exports = ProductReview;