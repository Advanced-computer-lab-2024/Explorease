const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sellerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    name: { type: String, required: false },
    description: { type: String, required: false },
    isAccepted: { type: Boolean, default: false },
    deleteRequest : {type : Boolean , default : true , required: false},
    createdProduct : [{type : Schema.Types.ObjectId , ref : 'Product'}],
    documents: {
        ID: { type: String , required : false},  // URL to the uploaded ID document
        TaxationRegistry: { type: String , required : false },  // URL to the uploaded Taxation Registry document
    },
    imageUrl : {type : String, required: false},
    canLogin : {type : Boolean , required : false, default : false},
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;