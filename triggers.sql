-- Database Triggers for Automatic Logging
-- This file contains triggers that automatically log all INSERT and UPDATE operations
-- on players and news tables to the logs table

-- Trigger function to log player changes
CREATE OR REPLACE FUNCTION log_player_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO logs (table_name, row_id, action, data, created_at)
        VALUES ('players', NEW.id, 'added', row_to_json(NEW)::jsonb, NOW());
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO logs (table_name, row_id, action, data, created_at)
        VALUES ('players', NEW.id, 'updated', row_to_json(NEW)::jsonb, NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to log news changes
CREATE OR REPLACE FUNCTION log_news_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO logs (table_name, row_id, action, data, created_at)
        VALUES ('news', NEW.id::text, 'added', row_to_json(NEW)::jsonb, NOW());
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO logs (table_name, row_id, action, data, created_at)
        VALUES ('news', NEW.id::text, 'updated', row_to_json(NEW)::jsonb, NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS players_insert_trigger ON players;
DROP TRIGGER IF EXISTS players_update_trigger ON players;
DROP TRIGGER IF EXISTS news_insert_trigger ON news;
DROP TRIGGER IF EXISTS news_update_trigger ON news;

-- Create triggers for players table
CREATE TRIGGER players_insert_trigger
AFTER INSERT ON players
FOR EACH ROW
EXECUTE FUNCTION log_player_changes();

CREATE TRIGGER players_update_trigger
AFTER UPDATE ON players
FOR EACH ROW
EXECUTE FUNCTION log_player_changes();

-- Create triggers for news table
CREATE TRIGGER news_insert_trigger
AFTER INSERT ON news
FOR EACH ROW
EXECUTE FUNCTION log_news_changes();

CREATE TRIGGER news_update_trigger
AFTER UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION log_news_changes();
