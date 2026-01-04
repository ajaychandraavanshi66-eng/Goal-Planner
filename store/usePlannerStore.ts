import { useState, useEffect } from 'react';
import { Goal, Task, Completion, UserSettings } from '../types';
import { api } from '../utils/api';
import dayjs from 'dayjs';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  accentColor: '#22d3ee',
  glassIntensity: 8,
  timeFormat24h: true,
  startWeekOnMonday: true,
};

export const usePlannerStore = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [goalsRes, tasksRes, completionsRes, settingsRes] = await Promise.all([
          api.getGoals(),
          api.getTasks(),
          api.getCompletions(),
          api.getSettings(),
        ]);

        setGoals(goalsRes.goals || []);
        setTasks(tasksRes.tasks || []);
        setCompletions(completionsRes.completions || []);
        setSettings(settingsRes.settings || DEFAULT_SETTINGS);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        // If unauthorized, clear token
        if (err.message.includes('authorized') || err.message.includes('401')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Goals
  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    try {
      const response = await api.createGoal(goal);
      setGoals(prev => [...prev, response.goal]);
      return response.goal;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const response = await api.updateGoal(id, updates);
      setGoals(prev => prev.map(g => g.id === id ? response.goal : g));
      return response.goal;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await api.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      // Tasks and completions are cascade deleted on backend
      setTasks(prev => prev.filter(t => {
        if (t.goalId === id) {
          setCompletions(prevComps => prevComps.filter(c => c.taskId !== t.id));
          return false;
        }
        return true;
      }));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Tasks
  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const response = await api.createTask(task);
      setTasks(prev => [...prev, response.task]);
      return response.task;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await api.updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? response.task : t));
      return response.task;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      // Completions are cascade deleted on backend
      setCompletions(prev => prev.filter(c => c.taskId !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Completions
  const toggleCompletion = async (taskId: string, date: string) => {
    try {
      const response = await api.toggleCompletion(taskId, date);
      if (response.completion) {
        setCompletions(prev => [...prev, response.completion]);
      } else {
        setCompletions(prev => prev.filter(c => !(c.taskId === taskId && c.date === date)));
      }
      return response.completion;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const response = await api.updateSettings(updates);
      setSettings(response.settings);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: response.settings }));
      return response.settings;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    goals,
    tasks,
    completions,
    settings,
    loading,
    error,
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
