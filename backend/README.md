# Goal Planner Backend API

Backend API for the Goal Planner application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Goals management (CRUD)
- Tasks management (CRUD)
- Task completions tracking
- User settings management
- Analytics and progress tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/goal-planner
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Goals
- `GET /api/goals` - Get all goals (protected)
- `POST /api/goals` - Create goal (protected)
- `PUT /api/goals/:goalId` - Update goal (protected)
- `DELETE /api/goals/:goalId` - Delete goal (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected, optional: `?goalId=xxx`)
- `POST /api/tasks` - Create task (protected)
- `PUT /api/tasks/:taskId` - Update task (protected)
- `DELETE /api/tasks/:taskId` - Delete task (protected)

### Completions
- `GET /api/completions` - Get completions (protected, optional: `?date=YYYY-MM-DD`, `?taskId=xxx`)
- `POST /api/completions/toggle` - Toggle completion (protected)
- `DELETE /api/completions/:completionId` - Delete completion (protected)

### Settings
- `GET /api/settings` - Get user settings (protected)
- `PUT /api/settings` - Update user settings (protected)

### Analytics
- `GET /api/analytics/daily` - Daily stats (protected)
- `GET /api/analytics/weekly` - Weekly stats (protected)
- `GET /api/analytics/monthly` - Monthly trends (protected)
- `GET /api/analytics/goals` - Goal performance (protected)
- `GET /api/analytics/streak` - Streak stats (protected)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Structure

The application uses MongoDB with nested documents. Each user document contains:
- Goals array
- Tasks array
- Completions array
- Settings object

