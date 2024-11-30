const Notification = require('../../Models/UserModels/Notification');
const Activity = require('../../Models/ActivityModels/Activity');
const Tourist = require('../../Models/UserModels/Tourist');

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const { user, role, type, message, data, global } = req.body;

        const newNotification = new Notification({
            user,
            role,
            type,
            message,
            data,
            global: global || false, // Default to false if not provided
        });

        const savedNotification = await newNotification.save();
        res.status(201).json({ msg: 'Notification created successfully', notification: savedNotification });
    } catch (err) {
        console.error('Error creating notification:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

const getNotifications = async (req, res) => {
    try {
        const { role, isRead } = req.query;

        // Build the query based on whether it's an admin or a regular user
        let query = { $or: [{ global: true }] }; // Always include global notifications

        if (req.admin) {
            // If the request is from an admin
            query.$or.push({ user: req.admin.id });
        } else if (req.user) {
            // If the request is from a regular user
            query.$or.push({ user: req.user.id });
        } else {
            return res.status(401).json({ message: 'User or admin not authenticated' });
        }

        if (role) query.role = role; // Filter by role if provided
        if (isRead !== undefined) query.isRead = isRead === 'true'; // Filter by read status

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};


// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.status(200).json({ msg: 'Notification marked as read', notification });
    } catch (err) {
        console.error('Error marking notification as read:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.status(200).json({ msg: 'Notification deleted successfully' });
    } catch (err) {
        console.error('Error deleting notification:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

// // Create notifications for multiple users (e.g., global broadcast)
// const createBulkNotifications = async (req, res) => {
//     try {
//         const { users, role, type, message, data } = req.body;

//         const notifications = users.map((userId) => ({
//             user: userId,
//             role,
//             type,
//             message,
//             data,
//         }));

//         const savedNotifications = await Notification.insertMany(notifications);
//         res.status(201).json({ msg: 'Bulk notifications created successfully', notifications: savedNotifications });
//     } catch (err) {
//         console.error('Error creating bulk notifications:', err.message);
//         res.status(500).json({ error: 'Server Error' });
//     }
// };

const markAllAsRead = async (req, res) => {
    try {
        const query = { user: req.admin.id };
        const updated = await Notification.updateMany(query, { isRead: true });
        res.status(200).json({ msg: 'All notifications marked as read', updatedCount: updated.nModified });
    } catch (err) {
        console.error('Error marking notifications as read:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};
const notifySubscribedUsers = async () => {
    try {
        // Fetch activities with bookingOpen set to true and having subscribedUsers
        const activities = await Activity.find({
            bookingOpen: true,
            subscribedUsers: { $exists: true, $not: { $size: 0 } },
        });

        for (const activity of activities) {
            const subscribedUsers = activity.subscribedUsers;

            for (const userId of subscribedUsers) {
                // Create a notification for each user
                await Notification.create({
                    user: userId,
                    role: 'Tourist',
                    type: 'activity_booking',
                    message: `The activity "${activity.name}" is now open for booking!`,
                    data: { activityId: activity._id },
                });

                // Remove the user from the subscribedUsers list
                activity.subscribedUsers = activity.subscribedUsers.filter(
                    (subscriberId) => subscriberId.toString() !== userId.toString()
                );
            }

            // Save the updated activity with modified subscribedUsers
            await activity.save();
        }

        console.log('Notifications sent and subscribers removed for activities with open booking.');
    } catch (error) {
        console.error('Error sending notifications and updating subscriber list:', error.message);
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    markAllAsRead,
    notifySubscribedUsers,
    //createBulkNotifications,
};
