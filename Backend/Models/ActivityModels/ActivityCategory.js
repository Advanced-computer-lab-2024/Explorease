const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityCategorySchema = new Schema({
    name: { type: String, required: true, unique: true }, // Name of category (e.g., 'food', 'concert')
}, { timestamps: true });

const ActivityCategory = mongoose.model('ActivityCategory', ActivityCategorySchema);
module.exports = ActivityCategory;