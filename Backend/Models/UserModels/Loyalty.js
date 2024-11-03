const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoyaltySchema = new Schema({
  touristId: {
    type: Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  redeemableAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Loyalty = mongoose.model('Loyalty', LoyaltySchema);
module.exports = Loyalty;