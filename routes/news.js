const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getNews,
    addNews,
    deleteNews
} = require('../controllers/newsController');


router.get('/', getNews);


router.post('/', authMiddleware, addNews);
router.delete('/:id', authMiddleware, deleteNews);

module.exports = router;
