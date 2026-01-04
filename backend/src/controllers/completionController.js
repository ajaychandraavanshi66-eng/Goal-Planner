import { randomUUID } from 'crypto';
import { User } from '../models/User.js';

export const getCompletions = async (req, res, next) => {
  try {
    const { date, taskId } = req.query;
    const user = await User.findById(req.user._id);
    
    let completions = user.completions;
    
    if (date) {
      completions = completions.filter(c => c.date === date);
    }
    
    if (taskId) {
      completions = completions.filter(c => c.taskId === taskId);
    }

    res.status(200).json({
      success: true,
      completions
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCompletion = async (req, res, next) => {
  try {
    const { taskId, date } = req.body;

    if (!taskId || !date) {
      return res.status(400).json({
        success: false,
        error: 'Please provide taskId and date'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Validate task exists
    const task = user.tasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Check if completion already exists
    const completionIndex = user.completions.findIndex(
      c => c.taskId === taskId && c.date === date
    );

    if (completionIndex !== -1) {
      // Remove completion (toggle off)
      user.completions.splice(completionIndex, 1);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Completion removed',
        completion: null
      });
    } else {
      // Create completion (toggle on)
      const newCompletion = {
        id: randomUUID(),
        taskId,
        date,
        isCompleted: true,
        completedAt: new Date()
      };

      user.completions.push(newCompletion);
      await user.save();

      return res.status(201).json({
        success: true,
        message: 'Completion added',
        completion: newCompletion
      });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCompletion = async (req, res, next) => {
  try {
    const { completionId } = req.params;

    const user = await User.findById(req.user._id);
    const completionIndex = user.completions.findIndex(c => c.id === completionId);

    if (completionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Completion not found'
      });
    }

    user.completions.splice(completionIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Completion deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

