const jwt = require('jsonwebtoken');
const Admin = require('../Models/UserModels/Admin.js'); // Assuming you have an admin model

const authenticateAdmin = async(req, res, next) => {
    const token = req.headers['authorization'];

    if (!token.startsWith('Bearer ')) {
        return res.status(400).json({ message: 'Token format is invalid' });
    }


    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        const actualToken = token.split(' ')[1];
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        req.admin = admin; // Attach admin to the request
        req.admin.isMainAdmin = decoded.isMainAdmin; // Attach isMainAdmin to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid', error });
    }
};

module.exports = authenticateAdmin;