const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    Tourist: { type: Schema.Types.ObjectId , ref : 'Tourist' , required: true },
    Activity: {type: Schema.Types.ObjectId , ref : 'Activity' , required: true },
    Status: {type: String, enum: ['Active', 'Cancelled'],default: 'Cancelled'},
    BookedAt : {type: Date, default: Date.now ,required : true},
    CancellationDeadline : {type: Date, required : true}
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;