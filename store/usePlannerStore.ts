
import { useState, useEffect, useCallback } from 'react';
import { Goal, Task, Completion, RepeatType, Priority, UserSettings } from '../types';
import dayjs from 'dayjs';

const STORAGE_KEY = 'neon_planner_data';

interface PlannerData {
  goals: Goal[];
  tasks: Task[];
  completions: Completion[];
  settings: UserSettings;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  accentColor: '#22d3ee',
  glassIntensity: 8,
  timeFormat24h: true,
  startWeekOnMonday: true,
};

// Initial mock data if empty
const INITIAL_GOALS: Goal[] = [
  { id: 'g1', title: 'Health', icon: '🏃', color: '#22d3ee', description: 'Physical and mental well-being', createdAt: dayjs().toISOString() },
  { id: 'g2', title: 'Wealth', icon: '💰', color: '#a855f7', description: 'Financial growth and planning', createdAt: dayjs().toISOString() },
  { id: 'g3', title: 'Wisdom', icon: '📚', color: '#ec4899', description: 'Learning and communication', createdAt: dayjs().toISOString() }
];

const INITIAL_TASKS: Task[] = [
  { 
    id: 't1', 
    goalId: 'g1', 
    title: 'Morning Meditation', 
    description: '15 mins focus', 
    startTime: '06:00', 
    duration: 15, 
    repeatType: RepeatType.DAILY, 
    repeatConfig: [], 
    startDate: dayjs().format('YYYY-MM-DD'), 
    isActive: true, 
    priority: Priority.HIGH, 
    createdAt: dayjs().toISOString() 
  },
  { 
    id: 't2', 
    goalId: 'g2', 
    title: 'Market Review', 
    description: 'Check portfolio', 
    startTime: '09:00', 
    duration: 30, 
    repeatType: RepeatType.WEEKLY, 
    repeatConfig: ['Mon', 'Wed', 'Fri'], 
    startDate: dayjs().format('YYYY-MM-DD'), 
    isActive: true, 
    priority: Priority.MEDIUM, 
    createdAt: dayjs().toISOString() 
  }
];

export const usePlannerStore = () => {
  const [data, setData] = useState<PlannerData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration for new settings
      if (!parsed.settings.theme) parsed.settings.theme = 'dark';
      return parsed;
    }
    return {
      goals: INITIAL_GOALS,
      tasks: INITIAL_TASKS,
      completions: [],
      settings: DEFAULT_SETTINGS
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Goals
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal = { ...goal, id: crypto.randomUUID(), createdAt: dayjs().toISOString() };
    setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  };

  const deleteGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
      tasks: prev.tasks.filter(t => t.goalId !== id)
    }));
  };

  // Tasks
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = { ...task, id: crypto.randomUUID(), createdAt: dayjs().toISOString() };
    setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
      completions: prev.completions.filter(c => c.taskId !== id)
    }));
  };

  // Completions
  const toggleCompletion = (taskId: string, date: string) => {
    setData(prev => {
      const existingIdx = prev.completions.findIndex(c => c.taskId === taskId && c.date === date);
      if (existingIdx > -1) {
        const newCompletions = [...prev.completions];
        newCompletions.splice(existingIdx, 1);
        return { ...prev, completions: newCompletions };
      } else {
        const newCompletion = {
          id: crypto.randomUUID(),
          taskId,
          date,
          isCompleted: true,
          completedAt: dayjs().toISOString()
        };
        return { ...prev, completions: [...prev.completions, newCompletion] };
      }
    });
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  };

  return {
    ...data,
    addGoal,
    updateGoal,
    deleteGoal,
    addTask,
    updateTask,
    deleteTask,
    toggleCompletion,
    updateSettings
  };
};
