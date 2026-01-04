import { randomUUID } from 'crypto';
import { User } from '../models/User.js';

export const getTasks = async (req, res, next) => {
  try {
    const { goalId } = req.query;
    const user = await User.findById(req.user._id);
    
    let tasks = user.tasks;
    
    if (goalId) {
      tasks = tasks.filter(t => t.goalId === goalId);
    }

    res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { goalId, title, description, startTime, duration, repeatType, repeatConfig, startDate, endDate, isActive, priority } = req.body;

    if (!goalId || !title || !startTime || !duration || !repeatType || !startDate || !priority) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: goalId, title, startTime, duration, repeatType, startDate, priority'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Validate goal exists
    const goal = user.goals.find(g => g.id === goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }

    const newTask = {
      id: randomUUID(),
      goalId,
      title,
      description: description || '',
      startTime,
      duration,
      repeatType,
      repeatConfig: repeatConfig || [],
      startDate,
      endDate,
      isActive: isActive !== undefined ? isActive : true,
      priority,
      createdAt: new Date()
    };

    user.tasks.push(newTask);
    await user.save();

    res.status(201).json({
      success: true,
      task: newTask
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const user = await User.findById(req.user._id);
    const taskIndex = user.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Validate goalId if being updated
    if (updates.goalId) {
      const goal = user.goals.find(g => g.id === updates.goalId);
      if (!goal) {
        return res.status(404).json({
          success: false,
          error: 'Goal not found'
        });
      }
    }

    // Update task fields
    const allowedFields = ['goalId', 'title', 'description', 'startTime', 'duration', 'repeatType', 'repeatConfig', 'startDate', 'endDate', 'isActive', 'priority'];
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        user.tasks[taskIndex][key] = updates[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      task: user.tasks[taskIndex]
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);
    const taskIndex = user.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Cascade delete: Remove all completions for this task
    user.completions = user.completions.filter(c => c.taskId !== taskId);

    // Remove the task
    user.tasks.splice(taskIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

