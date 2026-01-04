import dayjs from 'dayjs';
import { User } from '../models/User.js';
import {
  getDayCompletions,
  getWeeklyStats as getWeeklyStatsUtil,
  getMonthStats,
  getGoalPerformance as getGoalPerformanceUtil,
  calculateStreak,
  calculateBestStreak,
  isTaskDueOnDate
} from '../utils/dateUtils.js';

export const getDailyStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const today = dayjs().format('YYYY-MM-DD');
    
    const dailyTasks = user.tasks.filter(t => t.isActive && isTaskDueOnDate(t, today));
    
    const completedIds = user.completions
      .filter(c => c.date === today && c.isCompleted)
      .map(c => c.taskId);
    
    const completionRate = dailyTasks.length > 0 
      ? (completedIds.length / dailyTasks.length) * 100 
      : 0;

    const currentStreak = calculateStreak(user.completions, user.tasks);

    res.status(200).json({
      success: true,
      data: {
        completionRate: Math.round(completionRate),
        currentStreak,
        totalTasks: dailyTasks.length,
        completedTasks: completedIds.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const weeklyData = getWeeklyStatsUtil(user.completions, user.tasks);

    res.status(200).json({
      success: true,
      data: weeklyData
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyStats = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const user = await User.findById(req.user._id);
    
    let targetMonth;
    if (month && year) {
      targetMonth = dayjs(`${year}-${month}-01`);
    } else {
      targetMonth = dayjs();
    }

    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
      const date = dayjs().subtract(5 - i, 'month');
      const monthStr = date.format('MMM');
      const value = getMonthStats(user.completions, user.tasks, date);
      return { month: monthStr, value: Math.round(value) };
    });

    res.status(200).json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    next(error);
  }
};

export const getGoalPerformance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const performance = getGoalPerformanceUtil(user.goals, user.tasks, user.completions);

    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    next(error);
  }
};

export const getStreakStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const currentStreak = calculateStreak(user.completions, user.tasks);
    const bestStreak = calculateBestStreak(user.completions, user.tasks);

    res.status(200).json({
      success: true,
      data: {
        currentStreak,
        bestStreak
      }
    });
  } catch (error) {
    next(error);
  }
};

