const express = require('express');
const router = express.Router();
const { getStatus } = require('../controllers/statusController');

// Public endpoint - no authentication required
router.get('/', getStatus);

module.exports = router;
