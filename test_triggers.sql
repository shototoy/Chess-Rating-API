-- Test Script for Database Triggers
-- Run this after setting up the database to verify triggers are working

-- 1. Cleanup previous test data to allow re-running
DELETE FROM players WHERE id = 'TEST-001';
DELETE FROM news WHERE title = 'Test News';

-- 2. Test Player Insert (should be logged automatically)
INSERT INTO players (id, first_name, last_name, title, rapid_rating, birth_year)
VALUES ('TEST-001', 'Trigger', 'Test', NULL, 1500, 2000);

-- 3. Test Player Update (should be logged automatically)
UPDATE players SET rapid_rating = 1600 WHERE id = 'TEST-001';

-- 4. Test News Insert (should be logged automatically)
INSERT INTO news (title, subtitle, category, body)
VALUES ('Test News', 'Testing triggers', 'App Changelog', 'This is a test to verify triggers are working.');

-- 4. Verify logs were created
SELECT 
    id,
    table_name,
    row_id,
    action,
    created_at
FROM logs 
WHERE row_id IN ('TEST-001') OR table_name = 'news'
ORDER BY created_at DESC
LIMIT 10;

-- 5. View full log data for TEST-001
SELECT * FROM logs WHERE row_id = 'TEST-001';

-- 6. Cleanup test data (optional)
-- DELETE FROM players WHERE id = 'TEST-001';
-- DELETE FROM news WHERE title = 'Test News';
-- DELETE FROM logs WHERE row_id = 'TEST-001';
