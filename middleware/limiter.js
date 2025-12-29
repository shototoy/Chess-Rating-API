const rateLimit = require('express-rate-limit');
const searchLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    // 30 requests per 10 minutes per IP for public endpoints (search, etc.)
    max: 30,
    message: {
        success: false,
        error: 'Too many requests from this IP. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.user && req.user.isAdmin
});
module.exports = { searchLimiter };