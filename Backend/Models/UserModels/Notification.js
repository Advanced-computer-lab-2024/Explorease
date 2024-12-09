const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to any user (Tourist, Admin, etc.)
    },
    role: {
        type: String,
        enum: ['Admin', 'Tourist', 'TourGuide', 'Advertiser', 'Seller', 'Guest'],
        required: true,
    },
    type: {
        type: String,
        enum: [
            'sales_report',
            'product_out_of_stock',
            'event_flagged',
            'new_users',
            'guide_steps',
            'payment_receipt',
            'wallet_update',
            'activity_booking',
            'activity_history',
            'saved_event',
            'wishlist_product',
            'event_reminder',
            'product_reminder',
            'birthday_gift',
        ],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Additional details, e.g., IDs
        default: null,
    },
    global: {
        type: Boolean,
        default: false, // True if notification is sent to all users
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Notification', NotificationSchema);
