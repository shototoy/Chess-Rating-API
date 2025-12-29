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
app.get('/api/download-seed', (req, res) => {
  const filePath = path.join(__dirname, 'new_seed.sql');
  // Run export script first
  exec('node exportIncremental.js', { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error('Export script error:', err, stderr);
      return res.status(500).send('Failed to generate seed file.');
    }
    res.download(filePath, 'new_seed.sql', err => {
      if (err) {
        res.status(404).send('Seed file not found.');
      }
    });
  });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
