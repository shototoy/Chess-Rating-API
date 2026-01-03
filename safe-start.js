const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const startServer = async () => {
    try {
        console.log('🔌 Checking database status...');
        const client = await pool.connect();

        try {
            // Check if players table exists
            const res = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'players'
                );
            `);

            const tableExists = res.rows[0].exists;

            if (!tableExists) {
                console.log('⚠️ Database empty! Running full initialization (Wipe & Seed)...');
                // Run the full init-db logic
                const schemaPath = path.join(__dirname, 'schema_and_seeding.sql');
                const schemaSql = fs.readFileSync(schemaPath, 'utf8');
                await client.query(schemaSql);
                console.log('✅ Schema and seeding completed!');
            } else {
                console.log('✅ Database already populated. Skipping seed.');
            }

            // ALWAYS ensure triggers are set up (safe to run multiple times due to OR REPLACE)
            console.log('🔫 Ensures triggers are active...');
            const triggersPath = path.join(__dirname, 'triggers.sql');
            const triggersSql = fs.readFileSync(triggersPath, 'utf8');
            await client.query(triggersSql);
            console.log('✅ Triggers verified!');

        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ Startup initialization failed:', error);
        // We generally don't want to crash the process here, 
        // maybe the DB is down but we still want to try starting the server
    }
};

// Run the checks, then start the server
startServer().then(() => {
    console.log('🚀 Starting Express Server...');
    require('./index.js');
});
