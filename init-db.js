const fs = require('fs');
const path = require('path');
const pool = require('./db');

const initDb = async () => {
    try {
        console.log('🔌 Connecting to database...');

        // Read schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('📝 Running schema.sql...');

        // Execute schema
        await pool.query(schemaSql);

        console.log('✅ Database initialized successfully!');

        // Add a default admin if not exists (optional, helps with setup)
        /*
        const { hashPassword } = require('./utils/hash');
        const defaultPass = await hashPassword('admin123');
        await pool.query(
            'INSERT INTO admins (username, password_hash) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING',
            ['admin', defaultPass]
        );
        console.log('👤 Default admin validated/created');
        */

        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

initDb();
