const fs = require('fs');
const path = require('path');
const pool = require('./db');
const initDb = async () => {
    try {
        console.log('🔌 Connecting to database...');
        const schemaPath = path.join(__dirname, 'schema_and_seeding.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('📝 Running schema_and_seeding.sql...');
        await pool.query(schemaSql);
        console.log('✅ Schema and seeding completed!');
        const triggersPath = path.join(__dirname, 'triggers.sql');
        const triggersSql = fs.readFileSync(triggersPath, 'utf8');
        console.log('📝 Running triggers.sql...');
        await pool.query(triggersSql);
        console.log('✅ Triggers created successfully!');
        console.log('✅ Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('📌 Database initialization failed:', error);
        process.exit(1);
    }
};
initDb();
