const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    isMainAdmin: { type: Boolean, default: false }, // Flag to mark the main admin
    permissions: { type: [String], default: [] }, // Array of permissions, not needed currently, when we add authorization. 
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;