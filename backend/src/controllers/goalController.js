import { randomUUID } from 'crypto';
import { User } from '../models/User.js';

export const getGoals = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      goals: user.goals
    });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { title, icon, color, description } = req.body;

    if (!title || !icon || !color) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, icon, and color'
      });
    }

    const newGoal = {
      id: randomUUID(),
      title,
      icon,
      color,
      description: description || '',
      createdAt: new Date()
    };

    const user = await User.findById(req.user._id);
    user.goals.push(newGoal);
    await user.save();

    res.status(201).json({
      success: true,
      goal: newGoal
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.user._id);
    const goalIndex = user.goals.findIndex(g => g.id === goalId);

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Update goal fields
    Object.keys(updates).forEach(key => {
      if (['title', 'icon', 'color', 'description'].includes(key)) {
        user.goals[goalIndex][key] = updates[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      goal: user.goals[goalIndex]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;

    const user = await User.findById(req.user._id);
    const goalIndex = user.goals.findIndex(g => g.id === goalId);

    if (goalIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    // Cascade delete: Remove all tasks associated with this goal
    user.tasks = user.tasks.filter(t => {
      if (t.goalId === goalId) {
        // Cascade delete: Remove all completions for these tasks
        user.completions = user.completions.filter(c => c.taskId !== t.id);
        return false;
      }
      return true;
    });

    // Remove the goal
    user.goals.splice(goalIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

