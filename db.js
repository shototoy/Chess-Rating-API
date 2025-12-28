const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
// Enable SSL if connecting to Render (remote) even in dev, or if in production
const sslConfig = (isProduction || (connectionString && connectionString.includes('render.com')))
    ? { rejectUnauthorized: false }
    : false;

const pool = new Pool({
    connectionString,
    ssl: sslConfig
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
    process.exit(-1);
});

module.exports = pool;
