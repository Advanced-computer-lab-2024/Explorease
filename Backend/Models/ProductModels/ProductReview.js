const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductReviewSchema = new Schema({
Tourist: {type: Schema.Types.ObjectId , ref : 'Tourist' , required: true },
Product: {type: Schema.Types.ObjectId , ref : 'Product' , required: true},
Rating: { type: Number, min: 1, max: 5, default: 1, required: true},
Details: {type: [String], default: "" , required : true},
CreatedAt : {type: Date, default: Date.now , required : true}
}, { timestamps: true });
const ProductReview = mongoose.model('ProductReview', ProductReviewSchema);
module.exports = ProductReview;