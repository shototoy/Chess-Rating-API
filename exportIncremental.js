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
    let sql = '';
    // Get all add/update logs since baseline
    const logsRes = await client.query(
      `SELECT * FROM logs WHERE created_at > $1 AND action IN ('added', 'updated') ORDER BY created_at ASC`,
      [BASELINE_DATE]
    );
    for (const log of logsRes.rows) {
      const table = log.table_name;
      const rowId = log.row_id;
      const action = log.action;
      const data = log.data || {};
      if (action === 'added') {
        // Build INSERT
        const columns = Object.keys(data).map(col => `"${col}"`).join(', ');
        const values = Object.values(data).map(val =>
          val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`
        ).join(', ');
        sql += `INSERT INTO ${table} (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
      } else if (action === 'updated') {
        // Build UPDATE
        const setClause = Object.entries(data)
          .map(([col, val]) => `"${col}" = ${val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`}`)
          .join(', ');
        sql += `UPDATE ${table} SET ${setClause} WHERE id = '${rowId}';\n`;
      }
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

// For automation: run every 6 hours (21600000 ms) if run as a persistent process
if (require.main === module) {
  exportInserts();
  // Uncomment below to run every 6 hours automatically
  // setInterval(exportInserts, 21600000);
}
