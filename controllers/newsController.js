const pool = require('../db');
const { logAction } = require('../utils/logger');

// Get all news
const getNews = async (req, res) => {
    try {
        const cacheKey = 'news:all';
        // Redis caching removed
        const result = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
        // Redis caching removed
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Add news
const addNews = async (req, res) => {
    try {
        const { title, subtitle, category, body } = req.body;

        if (!title || !category || !body) {
            return res.status(400).json({ success: false, error: 'Title, category, and body are required' });
        }

        const query = `
            INSERT INTO news (title, subtitle, category, body)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const values = [title, subtitle || '', category, body];
        const result = await pool.query(query, values);
        const newItem = result.rows[0];

        // Log action
        await logAction('NEWS_ADDED', 'news', newItem.id, {
            title,
            category
        });

        // Redis cache clearing removed
        res.json({ success: true, data: newItem });
    } catch (error) {
        console.error('Error adding news:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Delete news
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'News item not found' });
        }

        // Log action
        await logAction('NEWS_DELETED', 'news', id);

        // Redis cache clearing removed
        res.json({ success: true, message: 'News deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    getNews,
    addNews,
    deleteNews
};
