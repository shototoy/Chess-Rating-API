const pool = require('../db');

// Get app status (maintenance mode, etc.)
const getStatus = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT maintenance_mode FROM app_settings ORDER BY id LIMIT 1'
        );

        const maintenanceMode = result.rows.length > 0 ? result.rows[0].maintenance_mode : false;

        res.json({ maintenanceMode });
    } catch (error) {
        console.error('Error fetching app status:', error);
        // Return false on error to allow app to load
        res.json({ maintenanceMode: false });
    }
};

module.exports = {
    getStatus
};
