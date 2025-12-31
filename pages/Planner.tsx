
import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, X, CheckCircle2, Circle, Clock, Calendar as CalendarIcon, ArrowRight, LayoutGrid, CalendarDays } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { usePlannerStore } from '../store/usePlannerStore';
import { getDayCompletions, isTaskDueOnDate, getMonthStats, calculateBestStreak } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';

const Planner: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const { tasks, completions, goals, toggleCompletion, settings } = usePlannerStore();

  const startOfMonth = currentDate.startOf('month');
  const daysInMonth = currentDate.daysInMonth();
  const startDay = startOfMonth.day();

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    const date = startOfMonth.add(day - 1, 'day');
    return {
      date,
      isCurrentMonth: i >= startDay && i < startDay + daysInMonth,
      isToday: date.isSame(dayjs(), 'day'),
      formattedDate: date.format('YYYY-MM-DD')
    };
  });

  const monthsOfYear = Array.from({ length: 12 }, (_, i) => {
    return dayjs().year(currentDate.year()).month(i);
  });

  const nextMonth = () => setCurrentDate(prev => prev.add(viewMode === 'month' ? 1 : 12, 'month'));
  const prevMonth = () => setCurrentDate(prev => prev.subtract(viewMode === 'month' ? 1 : 12, 'month'));

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const tasksForSelectedDay = selectedDate 
    ? tasks.filter(t => t.isActive && isTaskDueOnDate(t, selectedDate)) 
    : [];

  const completedForSelectedDay = selectedDate
    ? completions.filter(c => c.date === selectedDate && c.isCompleted).map(c => c.taskId)
    : [];

  const yearSummary = useMemo(() => {
    const currentYear = currentDate.year();
    const yearlyCompletions = completions.filter(c => dayjs(c.date).year() === currentYear).length;
    const bestStreak = calculateBestStreak(completions, tasks);
    
    // Calculate average month consistency for the year
    let totalCons = 0;
    monthsOfYear.forEach(m => {
      totalCons += getMonthStats(completions, tasks, m);
    });
    const avgConsistency = totalCons / 12;

    return {
      totalCompletions: yearlyCompletions,
      bestStreak,
      avgConsistency: Math.round(avgConsistency)
    };
  }, [completions, tasks, currentDate.year()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit flex items-center gap-2">
            Life <span className={viewMode === 'month' ? 'text-purple-400' : 'text-cyan-400'}>Planner</span>
          </h1>
          <p className="text-xs opacity-40 font-bold uppercase tracking-[0.2em] mt-1">
            {viewMode === 'month' ? 'Monthly Execution' : 'Yearly Progress Heatmap'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex glass-inner p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-white/10 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
            >
              <CalendarDays size={14} />
              Month
            </button>
            <button 
              onClick={() => setViewMode('year')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'year' ? 'bg-white/10 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
            >
              <LayoutGrid size={14} />
              Year
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={prevMonth} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-bold min-w-[100px] text-center font-outfit">
              {viewMode === 'month' ? currentDate.format('MMMM YYYY') : currentDate.format('YYYY')}
            </span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'month' ? (
          <motion.div
            key="month-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <GlassCard className="p-4 md:p-8" hoverEffect={false}>
              <div className="grid grid-cols-7 gap-1 md:gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-[10px] font-bold opacity-30 uppercase pb-4 tracking-widest">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, i) => {
                  const completion = getDayCompletions(completions, tasks, day.formattedDate);
                  const dueTasksCount = tasks.filter(t => t.isActive && isTaskDueOnDate(t, day.formattedDate)).length;
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.005 }}
                      onClick={() => handleDayClick(day.formattedDate)}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer group
                        ${day.isCurrentMonth ? 'bg-white/5 border-white/10' : 'opacity-10 border-transparent pointer-events-none'}
                        ${day.isToday ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-[#0b0f1a]' : ''}
                        hover:bg-white/10 hover:border-white/20
                      `}
                    >
                      <span className={`text-sm font-bold z-10 ${day.isToday ? 'text-cyan-400' : 'opacity-60'}`}>
                        {day.date.date()}
                      </span>
                      
                      {day.isCurrentMonth && completion > 0 && (
                        <div 
                          className="absolute inset-0 rounded-xl pointer-events-none opacity-20 blur-[2px] transition-opacity group-hover:opacity-40"
                          style={{ 
                            backgroundColor: settings.accentColor,
                            opacity: (completion / 100) * 0.4
                          }}
                        />
                      )}

                      {day.isCurrentMonth && dueTasksCount > 0 && (
                        <div className="mt-1 flex gap-0.5 z-10">
                          {Array.from({ length: Math.min(dueTasksCount, 4) }).map((_, dotIdx) => (
                              <div 
                                key={dotIdx}
                                className={`w-1 h-1 rounded-full ${completion > (dotIdx * 25) ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'bg-slate-700'}`}
                              />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="year-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {monthsOfYear.map((month, idx) => {
              const monthCons = getMonthStats(completions, tasks, month);
              return (
                <GlassCard 
                  key={idx} 
                  className="p-6 cursor-pointer hover:bg-white/5 border-white/5"
                  onClick={() => {
                    setCurrentDate(month);
                    setViewMode('month');
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold font-outfit">{month.format('MMMM')}</h3>
                      <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">{month.format('YYYY')}</p>
                    </div>
                    <span className="text-lg font-black" style={{ color: settings.accentColor }}>
                      {Math.round(monthCons)}%
                    </span>
                  </div>
                  
                  <div className="w-full h-12 glass-inner rounded-xl relative overflow-hidden">
                    <div 
                      className="absolute inset-0 transition-all duration-1000"
                      style={{ 
                        backgroundColor: settings.accentColor,
                        opacity: (monthCons / 100) * 0.6,
                        width: `${monthCons}%`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <p className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">Heatmap Progress</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-[10px] opacity-40 font-bold uppercase tracking-widest">
                    <span>Low</span>
                    <div className="flex gap-1">
                       {[0.1, 0.3, 0.5, 0.7, 0.9].map(op => (
                         <div key={op} className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.accentColor, opacity: op }} />
                       ))}
                    </div>
                    <span>High</span>
                  </div>
                </GlassCard>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <CalendarIcon size={20} />
          </div>
          <div>
            <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Planned Yearly</p>
            <p className="text-2xl font-bold font-outfit">{tasks.length * 365} Tasks</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Year Completions</p>
            <p className="text-2xl font-bold font-outfit">{yearSummary.totalCompletions}</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Best Mastery</p>
            <p className="text-2xl font-bold font-outfit">{yearSummary.avgConsistency}%</p>
          </div>
        </GlassCard>
      </div>

      {/* Day Details Modal */}
      <AnimatePresence>
        {selectedDate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedDate(null)} 
              className="absolute inset-0 bg-black/70 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="glass w-full max-w-md rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-outfit">{dayjs(selectedDate).format('MMMM D')}</h2>
                  <p className="text-sm opacity-60">{dayjs(selectedDate).format('dddd, YYYY')}</p>
                </div>
                <button 
                  onClick={() => setSelectedDate(null)} 
                  className="p-2 hover:bg-white/10 rounded-full opacity-60 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {tasksForSelectedDay.length > 0 ? (
                  tasksForSelectedDay.map(task => {
                    const isCompleted = completedForSelectedDay.includes(task.id);
                    const goal = goals.find(g => g.id === task.goalId);
                    const endTime = dayjs(`2000-01-01 ${task.startTime}`).add(task.duration, 'minute').format('HH:mm');
                    
                    return (
                      <div 
                        key={task.id} 
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          isCompleted ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/5 border-white/10'
                        }`}
                        style={!isCompleted && goal ? { borderLeft: `4px solid ${goal.color}` } : {}}
                      >
                        <button 
                          onClick={() => toggleCompletion(task.id, selectedDate)}
                          className="focus:outline-none transition-transform hover:scale-110 shrink-0"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-7 h-7 text-green-400" fill="rgba(74, 222, 128, 0.1)" />
                          ) : (
                            <Circle className="w-7 h-7 opacity-20 hover:text-cyan-400 hover:opacity-100 transition-all" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-base truncate ${isCompleted ? 'line-through opacity-40' : ''}`}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-[11px] opacity-60">
                            <Clock size={12} className="shrink-0" />
                            <span className="font-medium text-cyan-400/80">{task.startTime}</span>
                            <ArrowRight size={10} className="opacity-40" />
                            <span className="font-medium text-pink-400/80">{endTime}</span>
                            <span className="opacity-30">•</span>
                            <span>{task.duration}m</span>
                            {goal && (
                               <>
                                 <span className="opacity-30">•</span>
                                 <span className="truncate" style={{ color: goal.color }}>{goal.icon} {goal.title}</span>
                               </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 opacity-40">
                    <p className="text-lg italic font-outfit">No tasks scheduled for this day.</p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="w-full py-3 rounded-2xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Planner;
