const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const startServer = async () => {
    const client = await pool.connect();

    try {
        console.log('🔌 Checking database status...');

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
            const schemaPath = path.join(__dirname, 'schema_and_seeding.sql');
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            await client.query(schemaSql);
            console.log('✅ Schema and seeding completed!');
        } else {
            console.log('✅ Database already populated. Skipping seed.');
        }

        console.log('🔫 Applying triggers...');
        const triggersPath = path.join(__dirname, 'triggers.sql');

        if (!fs.existsSync(triggersPath)) {
            throw new Error(`triggers.sql not found at ${triggersPath}`);
        }

        const triggersSql = fs.readFileSync(triggersPath, 'utf8');
        console.log(`📄 Read triggers.sql (${triggersSql.length} bytes)`);

        await client.query(triggersSql);

        const verification = await client.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.triggers 
            WHERE trigger_schema = 'public'
        `);

        const triggerCount = parseInt(verification.rows[0].count);
        console.log(`✅ Triggers verified! (${triggerCount} triggers active)`);

        if (triggerCount === 0) {
            throw new Error('No triggers were created!');
        }

    } catch (error) {
        console.error('❌ Startup initialization failed:', error);
        console.error('Stack:', error.stack);
        throw error;
    } finally {
        client.release();
    }
};

startServer()
    .then(() => {
        console.log('🚀 Starting Express Server...');
        require('./index.js');
    })
    .catch((error) => {
        console.error('💥 Failed to start server:', error.message);
        process.exit(1);
    });
