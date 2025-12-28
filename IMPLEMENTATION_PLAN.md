# Chess Ratings App - Backend Implementation Plan

## Overview
Migrate from localStorage mock data to a full-stack application with Express.js API and PostgreSQL database.

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma (or raw SQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod or Joi
- **Environment**: dotenv

### Development Tools
- **API Testing**: Thunder Client / Postman
- **Database GUI**: pgAdmin or TablePlus
- **Process Manager**: PM2 (for production)

---

## Database Schema

### Tables

#### 1. `players`
```sql
CREATE TABLE players (
    id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(10),
    rapid_rating INTEGER NOT NULL,
    birth_year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `news`
```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. `admins`
```sql
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Implementation Batches

### **BATCH 1: Project Setup & Database** ✅
**Goal**: Set up backend infrastructure and database

**Tasks**:
1. Initialize Node.js project in `/server`
   ```bash
   npm init -y
   npm install express cors dotenv pg
   npm install -D nodemon
   ```

2. Install PostgreSQL locally or use cloud service (Supabase, Railway, Neon)

3. Create database and tables using schema above

4. Set up `.env` file:
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/chess_ratings
   JWT_SECRET=your-secret-key
   ```

5. Create basic Express server (`server/index.js`)

6. Test database connection

**Deliverables**:
- ✅ Working Express server
- ✅ PostgreSQL database with tables
- ✅ Environment configuration

---

### **BATCH 2: Players API Endpoints** 🔄
**Goal**: Implement CRUD operations for players

**Tasks**:
1. Create `server/routes/players.js`
2. Implement endpoints:
   - `GET /api/players` - Get all players
   - `GET /api/players/search?q=` - Search players
   - `POST /api/players` - Add new player (protected)
   - `PUT /api/players/:id` - Update player (protected)
   - `DELETE /api/players/:id` - Delete player (protected)

3. Create `server/controllers/playersController.js`
4. Add input validation
5. Test all endpoints

**Frontend Changes**:
- Update `src/services/data.js` to call API instead of localStorage
- Add API base URL configuration
- Handle loading states and errors

**Deliverables**:
- ✅ Working Players API
- ✅ Frontend integrated with Players API

---

### **BATCH 3: News API Endpoints** 🔄
**Goal**: Implement CRUD operations for news

**Tasks**:
1. Create `server/routes/news.js`
2. Implement endpoints:
   - `GET /api/news` - Get all news
   - `POST /api/news` - Add news (protected)
   - `PUT /api/news/:id` - Update news (protected)
   - `DELETE /api/news/:id` - Delete news (protected)

3. Create `server/controllers/newsController.js`
4. Add category validation (Tournament, App Changelog, Community)
5. Test all endpoints

**Frontend Changes**:
- Update news fetching in `src/services/data.js`
- Remove gradient from POST (keep frontend rendering)

**Deliverables**:
- ✅ Working News API
- ✅ Frontend integrated with News API

---

### **BATCH 4: Authentication System** 🔄
**Goal**: Secure admin endpoints with JWT authentication

**Tasks**:
1. Install authentication packages:
   ```bash
   npm install bcryptjs jsonwebtoken
   ```

2. Create `server/routes/auth.js`
3. Implement endpoints:
   - `POST /api/auth/login` - Admin login
   - `POST /api/auth/register` - Create admin (one-time setup)
   - `GET /api/auth/verify` - Verify token

4. Create `server/middleware/auth.js` - JWT verification middleware

5. Protect routes:
   - POST/PUT/DELETE for players
   - POST/PUT/DELETE for news

**Frontend Changes**:
- Update Dashboard login to call API
- Store JWT token in localStorage
- Add Authorization header to protected requests
- Handle token expiration

**Deliverables**:
- ✅ Working authentication system
- ✅ Protected API endpoints
- ✅ Frontend login integrated

---

### **BATCH 5: Error Handling & Validation** 🔄
**Goal**: Robust error handling and input validation

**Tasks**:
1. Create `server/middleware/errorHandler.js`
2. Add validation schemas for:
   - Player creation/update
   - News creation/update
   - Login credentials

3. Implement consistent error responses:
   ```json
   {
     "success": false,
     "error": "Error message",
     "code": "ERROR_CODE"
   }
   ```

4. Add request logging middleware

**Frontend Changes**:
- Add error handling UI
- Display validation errors
- Add loading spinners

**Deliverables**:
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Better UX for errors

---

### **BATCH 6: Database Seeding & Migration** 🔄
**Goal**: Populate database with initial data

**Tasks**:
1. Create `server/seeds/` folder
2. Create seed scripts:
   - `seedPlayers.js` - Add initial players
   - `seedNews.js` - Add initial news
   - `seedAdmin.js` - Create default admin

3. Create migration scripts for schema changes

4. Document seeding process in README

**Deliverables**:
- ✅ Seed scripts
- ✅ Initial data in database
- ✅ Migration documentation

---

### **BATCH 7: Performance & Optimization** 🔄
**Goal**: Optimize API performance

**Tasks**:
1. Add database indexing:
   - Index on `players.last_name`
   - Index on `players.rapid_rating`
   - Index on `news.created_at`

2. Implement pagination for large datasets:
   - `GET /api/players?page=1&limit=50`

3. Add caching for frequently accessed data

4. Implement rate limiting

**Deliverables**:
- ✅ Optimized database queries
- ✅ Pagination support
- ✅ Rate limiting

---

### **BATCH 8: Deployment** 🔄
**Goal**: Deploy to production

**Tasks**:
1. Choose hosting:
   - **Backend**: Railway, Render, Fly.io
   - **Database**: Supabase, Railway, Neon
   - **Frontend**: Vercel, Netlify

2. Set up production environment variables

3. Configure CORS for production domain

4. Set up CI/CD pipeline (optional)

5. Monitor and logging setup

**Deliverables**:
- ✅ Production deployment
- ✅ Environment configuration
- ✅ Monitoring setup

---

## API Endpoint Summary

### Players
- `GET /api/players` - List all players
- `GET /api/players/search?q=query` - Search players
- `POST /api/players` - Create player (protected)
- `PUT /api/players/:id` - Update player (protected)
- `DELETE /api/players/:id` - Delete player (protected)

### News
- `GET /api/news` - List all news
- `POST /api/news` - Create news (protected)
- `PUT /api/news/:id` - Update news (protected)
- `DELETE /api/news/:id` - Delete news (protected)

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register admin
- `GET /api/auth/verify` - Verify token

---

## Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chess_ratings

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Next Steps

1. **Start with Batch 1**: Set up the basic infrastructure
2. **Test each batch thoroughly** before moving to the next
3. **Keep frontend working** with mock data until API is ready
4. **Document API endpoints** as you build them
5. **Version control**: Commit after each batch

---

## Notes

- Keep mock data service as fallback during development
- Use feature flags to switch between mock and API
- Test on mobile devices after each batch
- Consider adding TypeScript for better type safety
- Plan for future features (tournaments, statistics, etc.)
