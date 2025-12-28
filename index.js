const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/players');

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Chess Ratings API',
        version: '1.0.0',
        status: 'running'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
