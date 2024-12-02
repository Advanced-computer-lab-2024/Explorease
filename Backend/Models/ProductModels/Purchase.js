const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist', // Assuming User is the model for the buyer
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default : 1    
    },
    totalPrice: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    review : {
        type : String, 
        required: false
    },
    rating : {
        type : Number, 
        required : false
    },
    address : {
        type : String, 
        required : false,
    },
    delivered : {
        type : Boolean, 
        required : true,
        default : false,
    },
    paymentMethod : {
        type : String, required : false,
    }

});

module.exports = mongoose.model('Purchase', purchaseSchema);
