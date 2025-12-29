const express = require('express');
const router = express.Router();
const { getStatus, toggleMaintenance } = require('../controllers/statusController');

// Public endpoints - no authentication required
router.get('/', getStatus);
router.post('/toggle', toggleMaintenance);
router.get('/redis-test', async (req, res) => {
    const redis = require('../utils/redis');
    try {
        await redis.set('test-key', 'hello-redis', { EX: 10 });
        const value = await redis.get('test-key');
        console.log('Redis test value:', value);
        res.json({ success: true, value });
    } catch (err) {
        console.error('Redis test error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;

