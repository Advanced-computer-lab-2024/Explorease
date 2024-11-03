const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
  touristId: {
    type: Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  level: {
    type: String,
    enum: ['explorer', 'adventurer', 'pioneer'],
    default: 'explorer'
  },
  awardedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Badge = mongoose.model('Badge', BadgeSchema);
module.exports = Badge;

