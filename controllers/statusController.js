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

// Toggle maintenance mode (public endpoint - no auth)
const toggleMaintenance = async (req, res) => {
    try {
        // Get current state
        const currentState = await pool.query(
            'SELECT maintenance_mode FROM app_settings ORDER BY id LIMIT 1'
        );

        const currentMode = currentState.rows.length > 0 ? currentState.rows[0].maintenance_mode : false;
        const newMode = !currentMode; // Toggle

        // Update to opposite state
        await pool.query(
            'UPDATE app_settings SET maintenance_mode = $1, updated_at = CURRENT_TIMESTAMP',
            [newMode]
        );

        console.log(`🔧 Maintenance mode ${newMode ? 'ACTIVATED' : 'DEACTIVATED'}`);

        res.json({
            maintenanceMode: newMode,
            message: `Maintenance mode ${newMode ? 'activated' : 'deactivated'}`
        });
    } catch (error) {
        console.error('Error toggling maintenance mode:', error);
        res.status(500).json({ error: 'Failed to toggle maintenance mode' });
    }
};

module.exports = {
    getStatus,
    toggleMaintenance
};
