import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database.js';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import completionRoutes from './routes/completionRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Connect to database
connectDatabase();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || config.frontendUrl || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/completions', completionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || config.port || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

