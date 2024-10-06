const jwt = require('jsonwebtoken');

const optionalAuth = (allowedRoles) => {
    return (req, res, next) => {
        next();
    };
};

const roleAuth = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid format' });
        }

        try {
            const actualToken = token.split(' ')[1];  // Extract token
            const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);  // Verify token
            
            console.log(decoded.role);

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            req.user = { id: decoded.id, role: decoded.role };  // Attach user info to req

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
        }
    };
};

module.exports = { roleAuth, optionalAuth };