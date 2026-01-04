import express from 'express';
import {
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  getGoalPerformance,
  getStreakStats
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/daily', getDailyStats);
router.get('/weekly', getWeeklyStats);
router.get('/monthly', getMonthlyStats);
router.get('/goals', getGoalPerformance);
router.get('/streak', getStreakStats);

export default router;

