-- Enhanced Test Script with Debugging
-- This will help us see if triggers are actually firing

-- 1. Check if trigger functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'log_%_changes';

-- 2. Check if triggers are attached
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 3. Clean up test data
DELETE FROM logs WHERE row_id = 'TEST-002';
DELETE FROM players WHERE id = 'TEST-002';

-- 4. Insert a test player (should trigger log)
INSERT INTO players (id, first_name, last_name, rapid_rating)
VALUES ('TEST-002', 'Debug', 'Test', 1500);

-- 5. Check if log was created
SELECT * FROM logs WHERE row_id = 'TEST-002';

-- 6. Update the player (should trigger another log)
UPDATE players SET rapid_rating = 1600 WHERE id = 'TEST-002';

-- 7. Check logs again
SELECT * FROM logs WHERE row_id = 'TEST-002' ORDER BY created_at;

-- 8. Show all logs
SELECT COUNT(*) as total_logs FROM logs;
