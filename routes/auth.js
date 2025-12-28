const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { comparePassword, hashPassword } = require('../utils/hash');

// Login (Password Only)
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, error: 'Password required' });
        }

        // Get the single admin row
        const result = await pool.query('SELECT * FROM admin LIMIT 1');

        if (result.rows.length === 0) {
            return res.status(500).json({ success: false, error: 'Admin not initialized' });
        }

        const admin = result.rows[0];
        const isValid = await comparePassword(password, admin.password_hash);

        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            token,
            admin: { id: admin.id, role: 'admin' }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Verify token
router.get('/verify', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ success: true, admin: decoded });
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

// Register (one-time setup - remove in production)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password required' });
        }

        const hashedPassword = await hashPassword(password);

        const result = await pool.query(
            'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        res.json({ success: true, admin: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ success: false, error: 'Username already exists' });
        }
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
