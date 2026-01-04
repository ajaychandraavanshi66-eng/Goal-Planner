import dayjs from 'dayjs';

export const isTaskDueOnDate = (task, date) => {
  const targetDate = dayjs(date);
  const start = dayjs(task.startDate);
  
  if (targetDate.isBefore(start, 'day')) return false;
  if (task.endDate && targetDate.isAfter(dayjs(task.endDate), 'day')) return false;

  switch (task.repeatType) {
    case 'daily':
      return true;
    case 'weekly':
      const dayName = targetDate.format('ddd');
      return task.repeatConfig.includes(dayName);
    case 'monthly':
      const dayOfMonth = targetDate.date().toString();
      return task.repeatConfig.includes(dayOfMonth);
    case 'yearly':
      const monthDay = targetDate.format('MM-DD');
      return task.repeatConfig.includes(monthDay);
    default:
      return false;
  }
};

export const getDayCompletions = (completions, tasks, date) => {
  const dueTasks = tasks.filter(t => t.isActive && isTaskDueOnDate(t, date));
  if (dueTasks.length === 0) return 0;
  
  const dayCompletions = completions.filter(c => c.date === date && c.isCompleted);
  const completedCount = dueTasks.filter(t => 
    dayCompletions.some(c => c.taskId === t.id)
  ).length;

  return (completedCount / dueTasks.length) * 100;
};

export const getGoalRecentProgress = (completions, tasks, goalId) => {
  const goalTasks = tasks.filter(t => t.goalId === goalId);
  if (goalTasks.length === 0) return 0;
  
  let totalDue = 0;
  let totalDone = 0;
  
  for (let i = 0; i < 7; i++) {
    const d = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    const due = goalTasks.filter(t => isTaskDueOnDate(t, d));
    const done = completions.filter(c => c.date === d && c.isCompleted && due.some(dt => dt.id === c.taskId));
    totalDue += due.length;
    totalDone += done.length;
  }
  
  return totalDue > 0 ? (totalDone / totalDue) * 100 : 0;
};

export const getMonthStats = (completions, tasks, month) => {
  const start = dayjs(month).startOf('month');
  const daysInMonth = dayjs(month).daysInMonth();
  let totalDue = 0;
  let totalCompleted = 0;

  for (let i = 0; i < daysInMonth; i++) {
    const current = start.add(i, 'day');
    const dateStr = current.format('YYYY-MM-DD');
    const due = tasks.filter(t => t.isActive && isTaskDueOnDate(t, dateStr));
    const finished = completions.filter(c => c.date === dateStr && c.isCompleted);
    
    totalDue += due.length;
    totalCompleted += finished.filter(c => due.some(d => d.id === c.taskId)).length;
  }

  return totalDue > 0 ? (totalCompleted / totalDue) * 100 : 0;
};

const isDaySuccessful = (date, completions, tasks) => {
  const dateStr = dayjs(date).format('YYYY-MM-DD');
  const due = tasks.filter(t => t.isActive && isTaskDueOnDate(t, dateStr));
  if (due.length === 0) return true;
  const finished = completions.filter(c => c.date === dateStr && c.isCompleted);
  return finished.length >= due.length;
};

export const calculateStreak = (completions, tasks) => {
  let streak = 0;
  let current = dayjs().startOf('day');
  
  if (!isDaySuccessful(current, completions, tasks)) {
    current = current.subtract(1, 'day');
  }

  while (streak < 1000) {
    if (isDaySuccessful(current, completions, tasks)) {
      streak++;
      current = current.subtract(1, 'day');
    } else {
      break;
    }
  }
  return streak;
};

export const calculateBestStreak = (completions, tasks) => {
  let best = 0;
  let currentStreak = 0;
  for (let i = 0; i < 365; i++) {
    const date = dayjs().subtract(i, 'day');
    if (isDaySuccessful(date, completions, tasks)) {
      currentStreak++;
      if (currentStreak > best) best = currentStreak;
    } else {
      currentStreak = 0;
    }
  }
  return best;
};

export const getWeeklyStats = (completions, tasks) => {
  return Array.from({ length: 7 }).map((_, i) => {
    const date = dayjs().subtract(6 - i, 'day');
    return {
      name: date.format('ddd'),
      completion: getDayCompletions(completions, tasks, date.format('YYYY-MM-DD')),
      date: date.format('YYYY-MM-DD')
    };
  });
};

export const getGoalPerformance = (goals, tasks, completions) => {
  return goals.map(goal => {
    const goalTasks = tasks.filter(t => t.goalId === goal.id);
    if (goalTasks.length === 0) return { name: goal.title, value: 0, color: goal.color };
    
    let totalScore = 0;
    for (let i = 0; i < 30; i++) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      const due = goalTasks.filter(t => t.isActive && isTaskDueOnDate(t, date));
      if (due.length > 0) {
        const finished = completions.filter(c => c.date === date && c.isCompleted && due.some(dt => dt.id === c.taskId));
        totalScore += (finished.length / due.length);
      } else {
        totalScore += 1;
      }
    }
    
    return {
      name: goal.title,
      value: Math.round((totalScore / 30) * 100),
      color: goal.color
    };
  });
};

