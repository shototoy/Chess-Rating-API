const express = require('express');
const router = express.Router();
const { getStatus, toggleMaintenance } = require('../controllers/statusController');

// Public endpoints - no authentication required
router.get('/', getStatus);
router.post('/toggle', toggleMaintenance);

module.exports = router;

