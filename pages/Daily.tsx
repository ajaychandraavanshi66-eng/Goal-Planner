
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { usePlannerStore } from '../store/usePlannerStore';
import { isTaskDueOnDate, calculateStreak } from '../utils/dateUtils';
import { GlassCard } from '../components/GlassCard';
import { ProgressBar } from '../components/ProgressBar';
// Added Calendar as CalendarIcon to fixed the undefined name error
import { CheckCircle2, Circle, Clock, Flame, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Daily: React.FC = () => {
  const { tasks, completions, goals, toggleCompletion, settings } = usePlannerStore();
  const today = dayjs().format('YYYY-MM-DD');
  
  const dailyTasks = useMemo(() => tasks.filter(t => t.isActive && isTaskDueOnDate(t, today)), [tasks, today]);
  const completedIds = useMemo(() => completions
    .filter(c => c.date === today && c.isCompleted)
    .map(c => c.taskId), [completions, today]);
  
  const completionRate = dailyTasks.length > 0 
    ? (completedIds.length / dailyTasks.length) * 100 
    : 0;

  const currentStreak = useMemo(() => calculateStreak(completions, tasks), [completions, tasks]);

  const groupedTasks = useMemo(() => goals.map(goal => ({
    goal,
    tasks: dailyTasks.filter(t => t.goalId === goal.id)
  })).filter(group => group.tasks.length > 0), [goals, dailyTasks]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Summary */}
      <GlassCard className="neon-border-cyan overflow-visible">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 font-outfit tracking-tight">Today's <span className="text-cyan-400">Focus</span></h1>
            <p className="opacity-60 text-sm font-medium">{dayjs().format('dddd, MMMM D, YYYY')}</p>
          </div>
          <div className="flex gap-8 items-center">
            <div className="text-center group cursor-help relative">
              <div className="flex items-center gap-2 text-orange-400 mb-1 transition-transform group-hover:scale-110">
                <Flame size={24} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                <span className="text-2xl font-black font-outfit">{currentStreak}</span>
              </div>
              <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Day Streak</p>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 glass rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                Keep completing all tasks to grow your streak!
              </div>
            </div>
            <div className="w-32 md:w-48">
              <ProgressBar value={completionRate} color={settings.accentColor} label="Daily Goal" />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-8">
        <AnimatePresence mode="popLayout">
          {groupedTasks.length > 0 ? (
            groupedTasks.map(({ goal, tasks: goalTasks }) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 ml-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xl bg-white/5 border border-white/5 shadow-inner">
                    {goal.icon}
                  </div>
                  <h2 className="text-lg font-bold font-outfit tracking-wide" style={{ color: goal.color }}>
                    {goal.title}
                  </h2>
                </div>
                
                <div className="grid gap-3">
                  {goalTasks.map(task => {
                    const isCompleted = completedIds.includes(task.id);
                    return (
                      <GlassCard 
                        key={task.id} 
                        className={`transition-all duration-500 border-l-4 ${isCompleted ? 'opacity-50 grayscale-[0.2]' : ''}`}
                        borderColor={isCompleted ? 'rgba(128,128,128,0.1)' : goal.color + '30'}
                        hoverEffect={!isCompleted}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <button 
                              onClick={() => toggleCompletion(task.id, today)}
                              className="focus:outline-none transition-all active:scale-90"
                            >
                              {isCompleted ? (
                                <div className="relative">
                                  <CheckCircle2 className="w-9 h-9 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
                                  <motion.div 
                                    initial={{ scale: 0 }} 
                                    animate={{ scale: 1.5, opacity: 0 }} 
                                    className="absolute inset-0 bg-green-400 rounded-full"
                                  />
                                </div>
                              ) : (
                                <Circle className="w-9 h-9 text-slate-400/50 hover:text-cyan-400 hover:scale-105 transition-all" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <h3 className={`font-bold text-lg leading-tight truncate transition-all ${isCompleted ? 'line-through opacity-40 translate-x-1' : ''}`}>
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-3 text-[11px] opacity-50 mt-1 font-medium">
                                <span className="flex items-center gap-1.5">
                                  <Clock size={12} className="text-cyan-400/70" />
                                  {task.startTime}
                                </span>
                                <span className="opacity-30">•</span>
                                <span>{task.duration} mins</span>
                                {task.priority === 'high' && (
                                  <span className="flex items-center gap-1 text-pink-500 font-black uppercase tracking-tighter animate-pulse">
                                    <span className="w-1 h-1 rounded-full bg-pink-500" />
                                    Priority
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {task.description && (
                            <div className="hidden lg:block text-xs opacity-40 italic max-w-[200px] truncate text-right">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-32 flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <CalendarIcon size={32} className="opacity-20" />
              </div>
              <p className="opacity-40 text-xl font-outfit italic">Your schedule is clear for today.</p>
              <button 
                onClick={() => window.location.hash = '#/goals'}
                className="px-6 py-2 rounded-xl bg-cyan-400/10 text-cyan-400 font-bold border border-cyan-400/20 hover:bg-cyan-400/20 transition-all active:scale-95"
              >
                Plan your next goals
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Daily;
