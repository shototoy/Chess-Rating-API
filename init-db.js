const fs = require('fs');
const path = require('path');
const pool = require('./db');
const initDb = async () => {
    try {
        console.log('🔌 Connecting to database...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('📝 Running schema.sql...');
        await pool.query(schemaSql);
        console.log('✅ Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('📌 Database initialization failed:', error);
        process.exit(1);
    }
};
initDb();
