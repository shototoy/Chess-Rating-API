-- PostgreSQL Schema and Seeding Script
-- Generated from: NATIONAL RATING LIST by Biyaherong Arbiter.xlsx
-- Generated at: 2025-12-31 03:42:20
-- Total records: 33894
-- Skipped records: 0 (See skipped_ids.txt)

-- Drop existing tables if they exist (for clean re-seeding)
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS server_logs CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS app_settings CASCADE;
DROP TABLE IF EXISTS admin CASCADE;

-- Create tables for Chess Ratings API

-- Admin table (Single Row, Password Only)
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    password_hash TEXT NOT NULL
);

-- Insert 'admin123' (Hash: $2b$10$VOC8Or/Ea6mHLuuFkdw8.nDKaLQ9jOdE/H5qCshE.d)
-- Insert 'admin123' (Verified Hash)
INSERT INTO admin (password_hash) 
SELECT '$2b$10$.eUGbpbY2pb2D20hdHANpeulSodC/fi2m2Rc5Jw6e3seFXk4BqkWa'
WHERE NOT EXISTS (SELECT 1 FROM admin);

-- App Settings table (for maintenance mode, etc.)
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO app_settings (maintenance_mode) 
SELECT FALSE
WHERE NOT EXISTS (SELECT 1 FROM app_settings);

-- Players table (ALREADY SEEDED - DO NOT TOUCH)
CREATE TABLE IF NOT EXISTS players (
     id VARCHAR(50) PRIMARY KEY,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     title VARCHAR(10),
     rapid_rating INTEGER NOT NULL,
     standard_rating INTEGER,
     blitz_rating INTEGER,
     birth_year INTEGER,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

CREATE INDEX idx_players_last_name ON players(last_name);
CREATE INDEX idx_players_rating ON players(rapid_rating DESC);
CREATE INDEX idx_players_standard_rating ON players(standard_rating DESC);
CREATE INDEX idx_players_blitz_rating ON players(blitz_rating DESC);

-- News table (ALREADY SEEDED)
CREATE TABLE IF NOT EXISTS news (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     subtitle VARCHAR(255),
     category VARCHAR(50) NOT NULL CHECK (category IN ('Tournament', 'App Changelog', 'Community')),
     body TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

 CREATE INDEX idx_news_created ON news(created_at DESC);

-- Ensure created_at and updated_at columns exist for players and news
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='created_at') THEN
        ALTER TABLE players ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='players' AND column_name='updated_at') THEN
        ALTER TABLE players ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='created_at') THEN
        ALTER TABLE news ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='news' AND column_name='updated_at') THEN
        ALTER TABLE news ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END$$;

-- Create logs table for all adds and updates
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    row_id TEXT NOT NULL,
    action TEXT NOT NULL, -- 'added' or 'updated'
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO news (title, subtitle, category, body, created_at) 
VALUES (
    'Version 1.0: Official Launch',
    'Philippines Chess Rating System is now live!',
    'App Changelog',
    '<h3>Welcome to the Philippines Chess Rating System</h3><div>Your comprehensive platform for tracking chess ratings and staying connected with the Philippine chess community.</div><div><br></div><h3>What You Can Do</h3><div><b>Find Any Player</b></div><div>Search through our complete database of registered chess players. Look up ratings, titles, and player information instantly.</div><div><br></div><div><b>Track Ratings</b></div><div>View rapid chess ratings for all players. See who''s climbing the ranks and follow your favorite players'' progress.</div><div><br></div><div><b>Stay Updated</b></div><div>Get the latest news about tournaments, rating updates, and important announcements from the chess community.</div><div><br></div><div><b>Easy to Use</b></div><div>Clean, modern interface designed for both mobile and desktop. Find what you need quickly with our intuitive search and navigation.</div><div><br></div><h3>For Everyone</h3><div>Whether you''re a tournament player checking your rating, a coach tracking students, or a fan following the local chess scene - this platform is built for you.</div><div><br></div><div><i>Welcome to the future of Philippine chess ratings. Let''s grow the game together!</i></div>',
    CURRENT_TIMESTAMP
);

