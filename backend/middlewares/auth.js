const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from the "Bearer TOKEN" format

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401));
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler('User not found with this token', 401));
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return next(new ErrorHandler('Invalid token. Please log in again.', 401));
    }
});

// Handling User roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role (${req.user.role}) is not allowed to access this resource` });
        }
        next(); // Proceed to the next middleware or route handler
    }
};
