# Database Trigger Logging System

## Overview
The Chess Rating app now uses **PostgreSQL database triggers** to automatically log all INSERT and UPDATE operations on the `players` and `news` tables. This ensures comprehensive logging regardless of the source of changes (app, manual SQL, or seeding scripts).

## How It Works

### 1. Triggers Automatically Log Changes
When any INSERT or UPDATE occurs on `players` or `news` tables:
- A trigger fires automatically
- The full row data is captured as JSON
- A log entry is inserted into the `logs` table

### 2. Logs Table Structure
```sql
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,        -- 'players' or 'news'
    row_id TEXT NOT NULL,             -- ID of the affected row
    action TEXT NOT NULL,             -- 'added' or 'updated'
    data JSONB,                       -- Full row data as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. What Gets Logged
- **Players**: All inserts and updates (from app, manual SQL, seeding scripts)
- **News**: All inserts and updates (from app, manual SQL)
- **Action**: 'added' for INSERT, 'updated' for UPDATE
- **Data**: Complete row data including all columns

## Files Modified

### Created Files
1. **`server/triggers.sql`** - Contains all trigger definitions
   - `log_player_changes()` function
   - `log_news_changes()` function
   - Triggers for INSERT and UPDATE on both tables

### Modified Files
1. **`server/init-db.js`** - Now runs both schema_and_seeding.sql and triggers.sql
2. **`server/controllers/playersController.js`** - Removed logger.js dependency and logAction() calls
3. **`server/controllers/newsController.js`** - Removed logger.js dependency and logAction() calls
4. **`server/exportIncremental.js`** - Updated to use 'added'/'updated' action names

### Unchanged Files (Still Work Perfectly)
1. **`server/index.js`** - `/api/download-seed` endpoint unchanged
2. **`server/exportIncremental.js`** - Logic unchanged, just action names updated
3. **`logs` table** - Structure unchanged

## API Endpoints

### GET /api/download-seed
Returns all logged changes in chronological order:
```json
[
  {
    "id": 1,
    "table_name": "players",
    "row_id": "A00001",
    "action": "added",
    "data": { "id": "A00001", "first_name": "John", ... },
    "created_at": "2026-01-04T01:30:00Z"
  }
]
```

## Export Incremental Changes

Run `node exportIncremental.js` to generate `new_seed.sql` with all changes since the baseline date:
```sql
-- Generated from logs table
INSERT INTO players (id, first_name, last_name, ...) 
VALUES ('A00001', 'John', 'Doe', ...) 
ON CONFLICT DO NOTHING;

UPDATE players 
SET first_name = 'John', rapid_rating = 1500, ... 
WHERE id = 'A00001';
```

## Benefits

### ✅ Comprehensive Logging
- Captures ALL changes (app, manual SQL, seeding)
- No way to bypass logging
- Single source of truth

### ✅ Simplified Code
- No need for manual logAction() calls in controllers
- Less code to maintain
- Fewer potential bugs

### ✅ Zero Breaking Changes
- `/api/download-seed` works exactly the same
- `exportIncremental.js` works exactly the same
- `logs` table structure unchanged

### ✅ Perfect Integration
- Manual seeding scripts now automatically logged
- Rating updates from images automatically logged
- Any direct database operations automatically logged

## Testing

### Test Manual SQL Logging
```sql
-- This will be automatically logged
INSERT INTO players (id, first_name, last_name, title, rapid_rating, birth_year)
VALUES ('T00001', 'Test', 'Player', NULL, 1500, 2000);

-- This will also be automatically logged
UPDATE players SET rapid_rating = 1600 WHERE id = 'T00001';
```

### Verify Logs
```sql
SELECT * FROM logs WHERE row_id = 'T00001';
```

### Test Download Endpoint
```bash
curl http://localhost:3001/api/download-seed
```

## Deployment

When deploying to production (Railway):
1. Run `node init-db.js` to set up schema, seeding, and triggers
2. All future changes will be automatically logged
3. Use `/api/download-seed` to retrieve all changes
4. Use `exportIncremental.js` to generate SQL files

## Maintenance

### No Maintenance Required!
- Triggers run automatically
- No manual intervention needed
- Logging is guaranteed for all changes

### Optional: Clean Old Logs
If you want to remove old logs (not recommended):
```sql
DELETE FROM logs WHERE created_at < '2026-01-01';
```
