const { Pool } = require('pg');
require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const sslConfig = (isProduction || (connectionString && connectionString.includes('render.com')))
    ? { rejectUnauthorized: false }
    : false;
const pool = new Pool({
    connectionString,
    ssl: sslConfig
});
const logDbConnectionWithIp = async () => {
    let ip = 'unknown';
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (res.ok) {
            const data = await res.json();
            ip = data.ip;
        }
    } catch (e) {}
    console.log(`✅ Connected to PostgreSQL database (server IP: ${ip})`);
};
pool.on('connect', () => {
    logDbConnectionWithIp();
});
pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
    process.exit(-1);
});
module.exports = pool;
