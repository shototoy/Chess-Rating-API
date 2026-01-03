const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/players');
const newsRoutes = require('./routes/news');
const logsRoutes = require('./routes/logs');
const statusRoutes = require('./routes/status');
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/status', statusRoutes);
app.get('/', (req, res) => {
  res.json({
    message: 'Chess Ratings API',
    version: '1.0.0',
    status: 'running'
  });
});
app.get('/api/download-seed', async (req, res) => {
  try {
    const pool = require('./db');
    const { rows } = await pool.query('SELECT * FROM logs ORDER BY created_at ASC');
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch logs:', err);
    res.status(500).send('Failed to fetch logs.');
  }
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
