const jwt = require('jsonwebtoken');

const optionalAuth = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers['authorization'];

        if (token && token.startsWith('Bearer ')) {
            try {
                const actualToken = token.split(' ')[1]; // Extract the token after 'Bearer'
                const decoded = jwt.verify(actualToken, process.env.JWT_SECRET); // Verify the token

                // Attach user information (id and role) to req.user
                req.user = { id: decoded.id, role: decoded.role };

                // Check if the role in the token is allowed
                if (!allowedRoles.includes(decoded.role)) {
                    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
                }
            } catch (error) {
                return res.status(401).json({ message: 'Invalid token', error: error.message });
            }
        }

        // If no token is provided or if it's valid, proceed to the next middleware
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
            const actualToken = token.split(' ')[1];  // Extract the token
            const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);  // Verify the token

            // Check if the role in the token is allowed
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            // Attach user data (id and role) to the request object
            req.user = { id: decoded.id, role: decoded.role }; // Ensure the 'id' is set correctly

            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
        }
    };
};

module.exports = { roleAuth, optionalAuth };