const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getNews,
    addNews,
    deleteNews
} = require('../controllers/newsController');

// Public routes
router.get('/', getNews);

// Protected routes
router.post('/', authMiddleware, addNews);
router.delete('/:id', authMiddleware, deleteNews);

module.exports = router;
