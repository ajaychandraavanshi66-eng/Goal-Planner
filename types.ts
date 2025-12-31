
export enum RepeatType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Goal {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  createdAt: string;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  description: string;
  startTime: string; // HH:mm
  duration: number; // minutes
  repeatType: RepeatType;
  repeatConfig: string[]; // ['Mon', 'Tue'] for weekly, ['1', '15'] for monthly
  startDate: string;
  endDate?: string;
  isActive: boolean;
  priority: Priority;
  createdAt: string;
}

export interface Completion {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD
  isCompleted: boolean;
  completedAt?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  accentColor: string;
  glassIntensity: number;
  timeFormat24h: boolean;
  startWeekOnMonday: boolean;
}
