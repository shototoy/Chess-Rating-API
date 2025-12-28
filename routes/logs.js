const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getLogs } = require('../controllers/logsController');

// All logs routes are protected
router.get('/', authMiddleware, getLogs);

module.exports = router;
