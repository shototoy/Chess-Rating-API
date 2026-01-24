const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getLogs } = require('../controllers/logsController');


router.get('/', authMiddleware, getLogs);

module.exports = router;
