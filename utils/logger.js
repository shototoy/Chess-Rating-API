const pool = require('../db');

const logAction = async (action, entityType = null, entityId = null, details = null) => {
    try {
        await pool.query(
            'INSERT INTO server_logs (action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4)',
            [action, entityType, entityId, details ? JSON.stringify(details) : null]
        );
    } catch (error) {
        console.error('Failed to log action:', error);
    }
};

module.exports = { logAction };
