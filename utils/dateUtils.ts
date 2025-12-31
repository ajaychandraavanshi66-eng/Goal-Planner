
import dayjs from 'dayjs';
import { Task, RepeatType, Completion } from '../types';

export const isTaskDueOnDate = (task: Task, date: string): boolean => {
  const targetDate = dayjs(date);
  const start = dayjs(task.startDate);
  
  if (targetDate.isBefore(start, 'day')) return false;
  if (task.endDate && targetDate.isAfter(dayjs(task.endDate), 'day')) return false;

  switch (task.repeatType) {
    case RepeatType.DAILY:
      return true;
    case RepeatType.WEEKLY:
      const dayName = targetDate.format('ddd');
      return task.repeatConfig.includes(dayName);
    case RepeatType.MONTHLY:
      const dayOfMonth = targetDate.date().toString();
      return task.repeatConfig.includes(dayOfMonth);
    case RepeatType.YEARLY:
      const monthDay = targetDate.format('MM-DD');
      return task.repeatConfig.includes(monthDay);
    default:
      return false;
  }
};

export const getDayCompletions = (completions: Completion[], tasks: Task[], date: string) => {
  const dueTasks = tasks.filter(t => t.isActive && isTaskDueOnDate(t, date));
  if (dueTasks.length === 0) return 0;
  
  const dayCompletions = completions.filter(c => c.date === date && c.isCompleted);
  const completedCount = dueTasks.filter(t => 
    dayCompletions.some(c => c.taskId === t.id)
  ).length;

  return (completedCount / dueTasks.length) * 100;
};

export const calculateStreak = (completions: Completion[], tasks: Task[]) => {
  let streak = 0;
  let current = dayjs().startOf('day');
  
  // Check today first. If not complete but yesterday was, the streak is still valid until today ends.
  // Actually, standard streak: count back from yesterday, and include today if finished.
  
  const isDaySuccessful = (date: dayjs.Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    const due = tasks.filter(t => t.isActive && isTaskDueOnDate(t, dateStr));
    if (due.length === 0) return true; // Passive success if nothing due
    const finished = completions.filter(c => c.date === dateStr && c.isCompleted);
    return finished.length >= due.length;
  };

  // Start from today or yesterday
  if (!isDaySuccessful(current)) {
    current = current.subtract(1, 'day');
  }

  while (streak < 1000) { // Safety break
    if (isDaySuccessful(current)) {
      streak++;
      current = current.subtract(1, 'day');
    } else {
      break;
    }
  }
  
  return streak;
};

export const getWeeklyStats = (completions: Completion[], tasks: Task[]) => {
  return Array.from({ length: 7 }).map((_, i) => {
    const date = dayjs().subtract(6 - i, 'day');
    return {
      name: date.format('ddd'),
      completion: getDayCompletions(completions, tasks, date.format('YYYY-MM-DD')),
      date: date.format('YYYY-MM-DD')
    };
  });
};

export const getGoalPerformance = (goals: any[], tasks: Task[], completions: Completion[]) => {
  return goals.map(goal => {
    const goalTasks = tasks.filter(t => t.goalId === goal.id);
    if (goalTasks.length === 0) return { name: goal.title, value: 0, color: goal.color };
    
    // Average completion over last 30 days for this goal
    let totalScore = 0;
    for (let i = 0; i < 30; i++) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      const due = goalTasks.filter(t => t.isActive && isTaskDueOnDate(t, date));
      if (due.length > 0) {
        const finished = completions.filter(c => c.date === date && c.isCompleted && due.some(dt => dt.id === c.taskId));
        totalScore += (finished.length / due.length);
      } else {
        totalScore += 1; // Count days with no tasks as successful for consistency
      }
    }
    
    return {
      name: goal.title,
      value: Math.round((totalScore / 30) * 100),
      color: goal.color
    };
  });
};
