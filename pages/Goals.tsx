import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, X, Clock, Calendar as CalendarIcon, Bell, BellOff } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import { GlassCard } from '../components/GlassCard';
import { ProgressBar } from '../components/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, RepeatType, Priority } from '../types';
import { getGoalRecentProgress } from '../utils/dateUtils';
import dayjs from 'dayjs';

const PRESET_COLORS = ['#22d3ee', '#a855f7', '#ec4899', '#22c55e', '#f59e0b', '#f43f5e'];
const PRESET_EMOJIS = ['🎯', '🏃', '💰', '📚', '🌱', '💻', '🧘', '🎨', '🚀', '🧠', '🎧', '⚡'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const Goals: React.FC = () => {
  const { goals, tasks, completions, addGoal, deleteGoal, addTask, updateTask, deleteTask } = usePlannerStore();
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    icon: '🎯',
    color: '#22d3ee',
    description: ''
  });

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
        <div>
          <h1 className="text-3xl font-bold font-outfit">Life <span className="text-pink-400">Goals</span></h1>
          <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-1">Define your long-term success</p>
        </div>
        <button 
          onClick={() => setIsGoalModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform text-white"
        >
          <Plus size={20} />
          New Goal
        </button>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => {
          const goalTasks = tasks.filter(t => t.goalId === goal.id);
          const isExpanded = expandedGoal === goal.id;
          const recentProgress = getGoalRecentProgress(completions, tasks, goal.id);

          return (
            <div key={goal.id} className="space-y-3">
              <GlassCard 
                borderColor={goal.color + '40'}
                className="cursor-pointer"
              >
                <div 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => toggleExpand(goal.id)}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{goal.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold font-outfit truncate" style={{ color: goal.color }}>{goal.title}</h2>
                      <div className="w-32 mt-2">
                        <ProgressBar value={recentProgress} color={goal.color} height="h-1" label="7d Consistency" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Linked Tasks</p>
                      <p className="text-xl font-black">{goalTasks.length}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="opacity-40" /> : <ChevronDown className="opacity-40" />}
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
                          <h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Routine Breakdown</h3>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openAddTask(goal.id); }}
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                          >
                            <Plus size={14} /> Add Task
                          </button>
                        </div>
                        <div className="grid gap-3">
                          {goalTasks.length > 0 ? (
                            goalTasks.map(task => (
                              <div key={task.id} className="flex items-center justify-between p-4 rounded-xl glass-inner border border-white/5 hover:border-white/10 transition-colors">
                                <div className="min-w-0">
                                  <p className="font-bold text-sm truncate">{task.title}</p>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                    <span className="text-[10px] opacity-50 uppercase font-bold tracking-wider">{task.repeatType}</span>
                                    <span className="text-[10px] opacity-20">•</span>
                                    <span className="text-[10px] opacity-50 flex items-center gap-1">
                                      <Clock size={10} /> {task.startTime}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                                      task.priority === Priority.HIGH ? 'bg-pink-500/20 text-pink-400' :
                                      task.priority === Priority.MEDIUM ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
                                    }`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 ml-4">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); openEditTask(task); }}
                                    className="p-2 hover:bg-white/10 rounded-lg opacity-40 hover:opacity-100 transition-opacity"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                    className="p-2 hover:bg-white/10 rounded-lg opacity-40 hover:opacity-100 transition-opacity text-red-400"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 opacity-20 italic text-sm">No tasks assigned yet.</div>
                          )}
                        </div>
                        <div className="flex justify-end pt-4">
                           <button onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline opacity-50 hover:opacity-100">Delete Entire Goal</button>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsGoalModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="glass w-full max-w-lg rounded-3xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-outfit">Define New <span className="text-cyan-400">Goal</span></h2>
                <button onClick={() => setIsGoalModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-60"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateGoal} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40">Choose Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_EMOJIS.map(emoji => (
                      <button 
                        key={emoji} 
                        type="button" 
                        onClick={() => setNewGoal({ ...newGoal, icon: emoji })}
                        className={`text-2xl p-2 rounded-xl border-2 transition-all ${newGoal.icon === emoji ? 'border-cyan-400 glass' : 'border-transparent hover:bg-white/5'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Goal Title</label>
                  <input type="text" required placeholder="e.g. Peak Fitness" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} className="w-full glass-inner rounded-xl p-4 focus:border-cyan-400 outline-none transition-all font-bold" />
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Theme Color</label>
                  <div className="flex flex-wrap gap-3">
                    {PRESET_COLORS.map(color => (
                      <button key={color} type="button" onClick={() => setNewGoal({ ...newGoal, color })} className={`w-10 h-10 rounded-full border-2 transition-all ${newGoal.color === color ? 'border-white scale-110' : 'border-transparent opacity-60'}`} style={{ backgroundColor: color, boxShadow: newGoal.color === color ? `0 0 15px ${color}80` : 'none' }} />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Description (Optional)</label>
                  <textarea placeholder="Why is this important to you?" value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} className="w-full glass-inner rounded-xl p-4 h-24 focus:border-cyan-400 outline-none transition-all resize-none" />
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsGoalModalOpen(false)} className="flex-1 py-4 px-6 rounded-xl font-bold glass-inner hover:bg-white/10 transition-colors">Discard</button>
                  <button type="submit" className="flex-1 py-4 px-6 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 hover:scale-[1.02] transition-transform text-white">Activate Goal</button>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTaskModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="glass w-full max-w-lg rounded-3xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-outfit">
                  {('id' in editingTask) ? 'Refine' : 'Add'} <span className="text-purple-400">Task</span>
                </h2>
                <button onClick={() => setIsTaskModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full opacity-60"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveTask} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Task Title</label>
                  <input 
                    type="text" 
                    required
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full glass-inner rounded-xl p-3 focus:border-purple-400 outline-none transition-all font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Schedule Start</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                      <input 
                        type="time" 
                        value={editingTask.startTime}
                        onChange={(e) => setEditingTask({ ...editingTask, startTime: e.target.value })}
                        className="w-full glass-inner rounded-xl p-3 pl-10 focus:border-purple-400 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Duration (min)</label>
                    <input 
                      type="number" 
                      value={editingTask.duration}
                      onChange={(e) => setEditingTask({ ...editingTask, duration: parseInt(e.target.value) })}
                      className="w-full glass-inner rounded-xl p-3 focus:border-purple-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Priority Rank</label>
                  <div className="flex gap-2">
                    {Object.values(Priority).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setEditingTask({ ...editingTask, priority: p })}
                        className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all border ${
                          editingTask.priority === p 
                            ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                            : 'glass-inner border-transparent opacity-60'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">Repeat Type</label>
                  <div className="flex gap-2 mb-3">
                    {[RepeatType.DAILY, RepeatType.WEEKLY, RepeatType.MONTHLY].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEditingTask({ ...editingTask, repeatType: type, repeatConfig: [] })}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all border ${
                          editingTask.repeatType === type 
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                            : 'glass-inner border-transparent opacity-60'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {editingTask.repeatType === RepeatType.WEEKLY && (
                    <div className="flex justify-between p-2 glass-inner rounded-xl">
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
                            className={`w-9 h-9 rounded-lg text-[10px] font-bold transition-all ${
                              isSelected ? 'bg-cyan-400 text-black shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'opacity-40 hover:opacity-100'
                            }`}
                          >
                            {day[0]}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {editingTask.repeatType === RepeatType.MONTHLY && (
                    <div className="grid grid-cols-7 gap-1 p-2 glass-inner rounded-xl">
                      {MONTH_DAYS.map(day => {
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
                            className={`aspect-square rounded-md text-[10px] font-bold transition-all ${
                              isSelected ? 'bg-cyan-400 text-black' : 'opacity-40 hover:opacity-100 hover:bg-white/5'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="col-span-2 flex items-center justify-between p-3 glass-inner rounded-xl">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Enable Reminders</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setEditingTask({ ...editingTask, isActive: !editingTask.isActive })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${editingTask.isActive ? 'bg-cyan-500' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${editingTask.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="pt-6 flex gap-4 sticky bottom-0 bg-[#0b0f1a]/50 backdrop-blur-md -mx-8 px-8 py-4 border-t border-white/5">
                  <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold glass-inner hover:bg-white/10">Discard</button>
                  <button type="submit" className="flex-1 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 text-white hover:scale-[1.02] transition-transform">Save Routine</button>
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