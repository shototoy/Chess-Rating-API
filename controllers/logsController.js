const pool = require('../db');

// Get recent server logs
const getLogs = async (req, res) => {
    try {
        const query = 'SELECT * FROM server_logs ORDER BY created_at DESC LIMIT 50';
        const result = await pool.query(query);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = { getLogs };
