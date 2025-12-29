const express = require('express');
const cors = require('cors');
require('dotenv').config();
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
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
