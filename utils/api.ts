// Detect if we're in production (deployed on Render)
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isProduction 
    ? 'https://goal-planner-backend-pm5i.onrender.com/api' 
    : 'http://localhost:5000/api');

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  }

  // Auth
  async register(email: string, password: string) {
    return this.request<{ success: boolean; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request<{ success: boolean; user: any }>('/auth/me');
  }

  // Goals
  async getGoals() {
    return this.request<{ success: boolean; goals: any[] }>('/goals');
  }

  async createGoal(goal: any) {
    return this.request<{ success: boolean; goal: any }>('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  }

  async updateGoal(goalId: string, updates: any) {
    return this.request<{ success: boolean; goal: any }>(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteGoal(goalId: string) {
    return this.request<{ success: boolean }>(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  }

  // Tasks
  async getTasks(goalId?: string) {
    const query = goalId ? `?goalId=${goalId}` : '';
    return this.request<{ success: boolean; tasks: any[] }>(`/tasks${query}`);
  }

  async createTask(task: any) {
    return this.request<{ success: boolean; task: any }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(taskId: string, updates: any) {
    return this.request<{ success: boolean; task: any }>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: string) {
    return this.request<{ success: boolean }>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Completions
  async getCompletions(date?: string, taskId?: string) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (taskId) params.append('taskId', taskId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ success: boolean; completions: any[] }>(`/completions${query}`);
  }

  async toggleCompletion(taskId: string, date: string) {
    return this.request<{ success: boolean; completion: any | null }>('/completions/toggle', {
      method: 'POST',
      body: JSON.stringify({ taskId, date }),
    });
  }

  async deleteCompletion(completionId: string) {
    return this.request<{ success: boolean }>(`/completions/${completionId}`, {
      method: 'DELETE',
    });
  }

  // Settings
  async getSettings() {
    return this.request<{ success: boolean; settings: any }>('/settings');
  }

  async updateSettings(updates: any) {
    return this.request<{ success: boolean; settings: any }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Analytics
  async getDailyStats() {
    return this.request<{ success: boolean; data: any }>('/analytics/daily');
  }

  async getWeeklyStats() {
    return this.request<{ success: boolean; data: any[] }>('/analytics/weekly');
  }

  async getMonthlyStats() {
    return this.request<{ success: boolean; data: any[] }>('/analytics/monthly');
  }

  async getGoalPerformance() {
    return this.request<{ success: boolean; data: any[] }>('/analytics/goals');
  }

  async getStreakStats() {
    return this.request<{ success: boolean; data: any }>('/analytics/streak');
  }
}

export const api = new ApiService();

