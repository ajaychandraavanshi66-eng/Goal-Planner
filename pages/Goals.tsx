
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, X, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import { GlassCard } from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, RepeatType, Priority } from '../types';
import dayjs from 'dayjs';

const PRESET_COLORS = ['#22d3ee', '#a855f7', '#ec4899', '#22c55e', '#f59e0b'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Goals: React.FC = () => {
  const { goals, tasks, addGoal, deleteGoal, addTask, updateTask, deleteTask } = usePlannerStore();
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  
  // Goal Modal State
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    icon: '🎯',
    color: '#22d3ee',
    description: ''
  });

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [targetGoalId, setTargetGoalId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedGoal(expandedGoal === id ? null : id);
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;
    addGoal(newGoal);
    setIsGoalModalOpen(false);
    setNewGoal({ title: '', icon: '🎯', color: '#22d3ee', description: '' });
  };

  const openAddTask = (goalId: string) => {
    setTargetGoalId(goalId);
    setEditingTask({
      title: '',
      description: '',
      startTime: '09:00',
      duration: 30,
      priority: Priority.MEDIUM,
      repeatType: RepeatType.DAILY,
      repeatConfig: [],
      isActive: true,
      startDate: dayjs().format('YYYY-MM-DD')
    });
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTargetGoalId(task.goalId);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title?.trim() || !targetGoalId) return;

    if ('id' in editingTask) {
      updateTask(editingTask.id as string, editingTask);
    } else {
      addTask({
        ...editingTask as Omit<Task, 'id' | 'createdAt'>,
        goalId: targetGoalId
      });
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-outfit">Life <span className="text-pink-400">Goals</span></h1>
        <button 
          onClick={() => setIsGoalModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 rounded-xl font-bold shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => {
          const goalTasks = tasks.filter(t => t.goalId === goal.id);
          const isExpanded = expandedGoal === goal.id;

          return (
            <div key={goal.id} className="space-y-3">
              <GlassCard 
                borderColor={goal.color + '40'}
                className="cursor-pointer"
              >
                <div 
                  className="flex items-center justify-between"
                  onClick={() => toggleExpand(goal.id)}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-4xl">{goal.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold font-outfit" style={{ color: goal.color }}>{goal.title}</h2>
                      <p className="opacity-60 text-sm mt-1">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs opacity-40 uppercase font-bold">Active Tasks</p>
                      <p className="text-xl font-bold">{goalTasks.length}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 border-t border-white/5 mt-6 space-y-4">
                        <div className="flex justify-between items-center px-2">
                          <h3 className="text-sm font-bold opacity-40 uppercase tracking-widest">Linked Tasks</h3>
                          <button 
                            onClick={() => openAddTask(goal.id)}
                            className="text-xs text-cyan-400 hover:underline font-bold"
                          >
                            + Add Task
                          </button>
                        </div>
                        <div className="grid gap-3">
                          {goalTasks.length > 0 ? (
                            goalTasks.map(task => (
                              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div>
                                  <p className="font-medium">{task.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs opacity-50 capitalize">{task.repeatType}</span>
                                    <span className="text-[10px] opacity-30">•</span>
                                    <span className="text-xs opacity-50">{task.startTime}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                      task.priority === Priority.HIGH ? 'bg-pink-500/20 text-pink-400' :
                                      task.priority === Priority.MEDIUM ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
                                    }`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); openEditTask(task); }}
                                    className="p-1.5 hover:bg-white/10 rounded-md opacity-40 hover:opacity-100 transition-opacity"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                    className="p-1.5 hover:bg-white/10 rounded-md opacity-40 hover:opacity-100 transition-opacity text-red-400"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm opacity-30 px-2 italic">No tasks linked to this goal yet.</p>
                          )}
                        </div>
                        <div className="flex justify-end pt-4 gap-4">
                           <button onClick={() => deleteGoal(goal.id)} className="text-xs text-red-400 opacity-60 hover:opacity-100 hover:underline">Delete Entire Goal</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Goal Modal */}
      <AnimatePresence>
        {isGoalModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsGoalModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="glass w-full max-w-lg rounded-3xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-outfit">Create New <span className="text-cyan-400">Goal</span></h2>
                <button onClick={() => setIsGoalModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-60"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateGoal} className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Icon</label>
                    <input type="text" value={newGoal.icon} onChange={(e) => setNewGoal({ ...newGoal, icon: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-center text-2xl focus:border-cyan-400 outline-none transition-all" maxLength={2} />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Goal Title</label>
                    <input type="text" required placeholder="e.g. Master React" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-cyan-400 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Color Theme</label>
                  <div className="flex gap-3">
                    {PRESET_COLORS.map(color => (
                      <button key={color} type="button" onClick={() => setNewGoal({ ...newGoal, color })} className={`w-10 h-10 rounded-full border-2 transition-all ${newGoal.color === color ? 'border-white scale-110' : 'border-transparent opacity-60'}`} style={{ backgroundColor: color, boxShadow: newGoal.color === color ? `0 0 15px ${color}` : 'none' }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Description</label>
                  <textarea placeholder="What does success look like for this goal?" value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-24 focus:border-cyan-400 outline-none transition-all resize-none" />
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsGoalModalOpen(false)} className="flex-1 py-3 px-6 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform">Create Goal</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {isTaskModalOpen && editingTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTaskModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="glass w-full max-w-lg rounded-3xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-outfit">
                  {'id' in editingTask ? 'Edit' : 'Add'} <span className="text-purple-400">Task</span>
                </h2>
                <button onClick={() => setIsTaskModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full opacity-60"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveTask} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Task Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-400 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Start Time</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                      <input 
                        type="time" 
                        value={editingTask.startTime}
                        onChange={(e) => setEditingTask({ ...editingTask, startTime: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 focus:border-purple-400 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Duration (min)</label>
                    <input 
                      type="number" 
                      value={editingTask.duration}
                      onChange={(e) => setEditingTask({ ...editingTask, duration: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Priority</label>
                  <div className="flex gap-2">
                    {Object.values(Priority).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEditingTask({ ...editingTask, priority: p })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                          editingTask.priority === p 
                            ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                            : 'bg-white/5 border-white/10 text-slate-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Repeat Frequency</label>
                  <div className="flex gap-2 mb-3">
                    {[RepeatType.DAILY, RepeatType.WEEKLY].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEditingTask({ ...editingTask, repeatType: type, repeatConfig: [] })}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                          editingTask.repeatType === type 
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' 
                            : 'bg-white/5 border-white/10 text-slate-500'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {editingTask.repeatType === RepeatType.WEEKLY && (
                    <div className="flex justify-between p-2 bg-white/5 rounded-xl border border-white/5">
                      {WEEKDAYS.map(day => {
                        const isSelected = editingTask.repeatConfig?.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const current = editingTask.repeatConfig || [];
                              const next = isSelected 
                                ? current.filter(d => d !== day) 
                                : [...current, day];
                              setEditingTask({ ...editingTask, repeatConfig: next });
                            }}
                            className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                              isSelected ? 'bg-cyan-400 text-black' : 'text-slate-500 hover:text-white'
                            }`}
                          >
                            {day[0]}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold bg-white/5 border border-white/10">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/20">Save Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
