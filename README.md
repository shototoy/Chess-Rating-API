# Chess Ratings API Server

Backend API for the Chess Ratings mobile application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Hosting**: Railway

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/chess_ratings
JWT_SECRET=your-secret-key
```

3. Run database migrations (coming soon)

4. Start development server:
```bash
npm run dev
```

## API Endpoints

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed API documentation.

## Deployment

This server is deployed on Railway. Push to `main` branch to trigger automatic deployment.

## Environment Variables (Railway)

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ALLOWED_ORIGINS` - CORS allowed origins (frontend URL)
