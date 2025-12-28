const pool = require('../db');
const { logAction } = require('../utils/logger');

// Get all players with pagination and sorting
const getPlayers = async (req, res) => {
    try {
        const { page = 1, limit = 50, sortBy = 'rapid_rating', order = 'desc' } = req.query;
        const offset = (page - 1) * limit;

        // Validate sort column to prevent SQL injection
        // Validate sort column to prevent SQL injection
        let sortColumn = 'rapid_rating';
        if (sortBy === 'name') {
            sortColumn = 'last_name, first_name';
        } else if (['first_name', 'last_name', 'rapid_rating', 'birth_year', 'id'].includes(sortBy)) {
            sortColumn = sortBy;
        }
        const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        const query = `
            SELECT * FROM players 
            ORDER BY ${sortColumn} ${sortOrder} 
            LIMIT $1 OFFSET $2
        `;

        const result = await pool.query(query, [limit, offset]);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Search players with pagination
const searchPlayers = async (req, res) => {
    try {
        const { q, page = 1, limit = 50, sortBy = 'rapid_rating', order = 'desc' } = req.query;
        if (!q) return res.json({ success: true, data: [] });

        const offset = (page - 1) * limit;

        // Validate sort column
        const validColumns = ['first_name', 'last_name', 'rapid_rating'];
        // Map frontend sort keys to DB columns if needed, assuming 'name' -> 'last_name' or similar logic
        // But for simplicity let's stick to what we use: 'name' usually implies sorting by last_name then first_name
        let sortColumn = 'rapid_rating';

        if (sortBy === 'name') {
            sortColumn = 'last_name, first_name'; // Multi-column sort
        } else if (sortBy === 'rapid') {
            sortColumn = 'rapid_rating';
        } else if (validColumns.includes(sortBy)) {
            sortColumn = sortBy;
        }

        const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        const query = `
            SELECT * FROM players 
            WHERE 
                LOWER(first_name) LIKE LOWER($1) OR 
                LOWER(last_name) LIKE LOWER($1) OR 
                id LIKE $1
            ORDER BY ${sortColumn} ${sortOrder}
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [`%${q}%`, limit, offset]);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error searching players:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Add player
const addPlayer = async (req, res) => {
    try {
        const { firstName, lastName, title, rapidRating, bYear } = req.body;

        // Basic validation
        if (!firstName || !lastName || !rapidRating) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Generate ID based on Last Name
        const letter = lastName.charAt(0).toUpperCase();

        // Find the latest ID that starts with this letter
        // We look for patterns like 'P%' and order by length desc, then alphabetically desc to catch 'P10000' > 'P9999' correctly if needed
        // But simply casting substring to int is safer if format is consistent.
        const idQuery = `
            SELECT id FROM players 
            WHERE id LIKE $1 
            ORDER BY LENGTH(id) DESC, id DESC 
            LIMIT 1
        `;
        const idResult = await pool.query(idQuery, [`${letter}%`]);

        let nextNum = 1;
        if (idResult.rows.length > 0) {
            const lastId = idResult.rows[0].id;
            // Assuming format L00000
            const numPart = parseInt(lastId.substring(1));
            if (!isNaN(numPart)) {
                nextNum = numPart + 1;
            }
        }

        // Pad with 5 zeros
        const newId = `${letter}${nextNum.toString().padStart(5, '0')}`;

        const query = `
            INSERT INTO players (id, first_name, last_name, title, rapid_rating, birth_year)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [newId, firstName, lastName, title || '', rapidRating, bYear || null];
        const result = await pool.query(query, values);
        const newPlayer = result.rows[0];

        // Log action
        await logAction('PLAYER_ADDED', 'player', newId, {
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

        const values = [firstName, lastName, title, rapidRating, bYear || null, id];
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
