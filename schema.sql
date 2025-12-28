-- Create tables for Chess Ratings API

-- Admin table (Single Row, Password Only)
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    password_hash TEXT NOT NULL
);

-- Insert 'admin123' (Hash: $2b$10$VOC8Or/Ea6mHLuuFkdw8.nDKaLQ9jOdE/H5qCshE.d)
INSERT INTO admin (password_hash) 
SELECT '$2b$10$VOC8Or/Ea6mHLuuFkdw8.nDKaLQ9jOdE/H5qCshE.d'
WHERE NOT EXISTS (SELECT 1 FROM admin);

-- Players table (ALREADY SEEDED - DO NOT TOUCH)
-- CREATE TABLE players (
--     id VARCHAR(50) PRIMARY KEY,
--     first_name VARCHAR(100) NOT NULL,
--     last_name VARCHAR(100) NOT NULL,
--     title VARCHAR(10),
--     rapid_rating INTEGER NOT NULL,
--     birth_year INTEGER,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_players_last_name ON players(last_name);
-- CREATE INDEX idx_players_rating ON players(rapid_rating DESC);

-- News table (ALREADY SEEDED)
-- CREATE TABLE news (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     subtitle VARCHAR(255),
--     category VARCHAR(50) NOT NULL CHECK (category IN ('Tournament', 'App Changelog', 'Community')),
--     body TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_news_created ON news(created_at DESC);

-- Server logs table (DROPPED - Using Console Logs)
DROP TABLE IF EXISTS server_logs;

-- CREATE TABLE server_logs (
--     id SERIAL PRIMARY KEY,
--     action VARCHAR(50) NOT NULL,
--     entity_type VARCHAR(20),
--     entity_id VARCHAR(50),
--     details JSONB,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE INDEX idx_logs_created ON server_logs(created_at DESC);
-- CREATE INDEX idx_logs_action ON server_logs(action);
