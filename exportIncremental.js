const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configure your database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use your Render DB URL
});

// Set this to the date/time of your initial deployment/seed
const BASELINE_DATE = '2025-12-29T13:00:00Z'; // 9pm Philippine time (UTC+8)

async function exportInserts() {
  const client = await pool.connect();
  try {
    // List tables to export
    const tables = ['players', 'news']; // Add more tables if needed
    let sql = '';

    for (const table of tables) {
      // Assumes each table has a created_at timestamp
      const res = await client.query(`SELECT * FROM ${table} WHERE created_at > $1`, [BASELINE_DATE]);
      res.rows.forEach(row => {
        const columns = Object.keys(row).map(col => `"${col}"`).join(', ');
        const values = Object.values(row).map(val =>
          val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`
        ).join(', ');
        sql += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
      });
    }

    // Save to file in backend folder
    const filePath = path.join(__dirname, 'new_seed.sql');
    fs.writeFileSync(filePath, sql);
    console.log('Exported to', filePath);
  } finally {
    client.release();
  }
  process.exit();
}

exportInserts();
