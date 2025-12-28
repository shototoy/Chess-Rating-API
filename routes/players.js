const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getPlayers,
    searchPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer
} = require('../controllers/playersController');

// Public routes
router.get('/', getPlayers);
router.get('/search', searchPlayers);

// Protected routes
router.post('/', authMiddleware, addPlayer);
router.put('/:id', authMiddleware, updatePlayer);
router.delete('/:id', authMiddleware, deletePlayer);

module.exports = router;
