const rateLimit = require('express-rate-limit');
const searchLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    // 600 requests per 5 minutes per IP for public endpoints (search, etc.)
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