const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const BASELINE_DATE = '2025-12-29T13:00:00Z';

async function exportInserts() {
  const client = await pool.connect();
  try {
    let sql = '';
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
        const columns = Object.keys(data).map(col => `"${col}"`).join(', ');
        const values = Object.values(data).map(val =>
          val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`
        ).join(', ');
        sql += `INSERT INTO ${table} (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
      } else if (action === 'updated') {
        const setClause = Object.entries(data)
          .map(([col, val]) => `"${col}" = ${val === null ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`}`)
          .join(', ');
        sql += `UPDATE ${table} SET ${setClause} WHERE id = '${rowId}';\n`;
      }
    }
    const filePath = path.join(__dirname, 'new_seed.sql');
    fs.writeFileSync(filePath, sql);
    console.log('Exported to', filePath);
  } finally {
    client.release();
  }
  process.exit();
}


