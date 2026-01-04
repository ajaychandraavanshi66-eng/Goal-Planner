import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const goalSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => randomUUID()
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => randomUUID()
  },
  goalId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  repeatType: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  repeatConfig: {
    type: [String],
    default: []
  },
  startDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  endDate: {
    type: String,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const completionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: () => randomUUID()
  },
  taskId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  isCompleted: {
    type: Boolean,
    default: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'dark'
  },
  accentColor: {
    type: String,
    default: '#22d3ee'
  },
  glassIntensity: {
    type: Number,
    default: 8
  },
  timeFormat24h: {
    type: Boolean,
    default: true
  },
  startWeekOnMonday: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  goals: {
    type: [goalSchema],
    default: []
  },
  tasks: {
    type: [taskSchema],
    default: []
  },
  completions: {
    type: [completionSchema],
    default: []
  },
  settings: {
    type: settingsSchema,
    default: () => ({
      theme: 'dark',
      accentColor: '#22d3ee',
      glassIntensity: 8,
      timeFormat24h: true,
      startWeekOnMonday: true
    })
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to find goal by id
userSchema.methods.findGoalById = function(goalId) {
  return this.goals.find(g => g.id === goalId);
};

// Method to find task by id
userSchema.methods.findTaskById = function(taskId) {
  return this.tasks.find(t => t.id === taskId);
};

// Method to find completion by id
userSchema.methods.findCompletionById = function(completionId) {
  return this.completions.find(c => c.id === completionId);
};

export const User = mongoose.model('User', userSchema);

