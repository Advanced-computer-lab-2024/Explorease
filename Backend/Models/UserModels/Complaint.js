const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ComplaintSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    CreatedAt: {
        type: Date,
        default: Date.now
      },
    status: {
      type: String,
      enum: ['Pending', 'Resolved'],
      default: 'Pending'
    },
    touristId: {
      type: Schema.Types.ObjectId,
      ref: 'Tourist',
      required: true
    },
    adminResponse: {
      type: String
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    }
  }, { timestamps: true });

const Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports = Complaint ;