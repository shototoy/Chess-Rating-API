const rateLimit = require('express-rate-limit');
const searchLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 600,
    message: {
        success: false,
        error: 'Too many requests from this IP. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.user && req.user.isAdmin
});
module.exports = { searchLimiter };