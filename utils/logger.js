const pool = require('../db');

const logAction = async (action, entityType = null, entityId = null, details = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ACTION: ${action} | ENTITY: ${entityType} (${entityId}) | DETAILS:`, details ? JSON.stringify(details) : 'None');

    // Only log to DB for add/update actions
    if (['PLAYER_ADDED', 'PLAYER_UPDATED', 'NEWS_ADDED', 'NEWS_UPDATED'].includes(action)) {
        try {
            await pool.query(
                'INSERT INTO logs (table_name, row_id, action, data, created_at) VALUES ($1, $2, $3, $4, NOW())',
                [entityType, String(entityId), action.replace('PLAYER_', '').replace('NEWS_', '').toLowerCase(), details ? JSON.stringify(details) : null]
            );
        } catch (e) {
            console.error('Failed to log action to DB:', e);
        }
    }
};
module.exports = { logAction };
