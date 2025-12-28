const pool = require('../db');
const { logAction } = require('../utils/logger');

// Get all players
const getPlayers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM players ORDER BY rapid_rating DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Search players
const searchPlayers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ success: true, data: [] });

        const query = `
            SELECT * FROM players 
            WHERE 
                LOWER(first_name) LIKE LOWER($1) OR 
                LOWER(last_name) LIKE LOWER($1) OR 
                id LIKE $1
            ORDER BY rapid_rating DESC
        `;
        const result = await pool.query(query, [`%${q}%`]);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error searching players:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Add player
const addPlayer = async (req, res) => {
    try {
        const { id, firstName, lastName, title, rapidRating, bYear } = req.body;

        // Basic validation
        if (!id || !firstName || !lastName || !rapidRating || !bYear) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO players (id, first_name, last_name, title, rapid_rating, birth_year)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [id, firstName, lastName, title || '', rapidRating, bYear];
        const result = await pool.query(query, values);
        const newPlayer = result.rows[0];

        // Log action
        await logAction('PLAYER_ADDED', 'player', id, {
            name: `${lastName}, ${firstName}`,
            rating: rapidRating
        });

        res.json({ success: true, data: newPlayer });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ success: false, error: 'Player ID already exists' });
        }
        console.error('Error adding player:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Update player
const updatePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, title, rapidRating, bYear } = req.body;

        const query = `
            UPDATE players 
            SET first_name = $1, last_name = $2, title = $3, rapid_rating = $4, birth_year = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;

        const values = [firstName, lastName, title, rapidRating, bYear, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Player not found' });
        }

        const updatedPlayer = result.rows[0];

        // Log action
        await logAction('PLAYER_UPDATED', 'player', id, {
            name: `${lastName}, ${firstName}`,
            rating: rapidRating
        });

        res.json({ success: true, data: updatedPlayer });
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Delete player
const deletePlayer = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM players WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Player not found' });
        }

        // Log action
        await logAction('PLAYER_DELETED', 'player', id);

        res.json({ success: true, message: 'Player deleted successfully' });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    getPlayers,
    searchPlayers,
    addPlayer,
    updatePlayer,
    deletePlayer
};
