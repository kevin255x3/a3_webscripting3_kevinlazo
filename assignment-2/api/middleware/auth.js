// authentication middleware
// verifies JWT token and attaches user data to request
const jwt = require('jsonwebtoken');

// JWT secret key - should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

module.exports = (req, res, next) => {
    try {
        // get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication failed: No token provided' });
        }

        // format should be "Bearer [token]"
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: Token format invalid' });
        }

        // verify the token
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // add user data to request object
        req.userData = {
            userId: decodedToken.userId,
            email: decodedToken.email
        };

        // continue to the protected route
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed: Invalid token',
            error: error.message
        });
    }
};