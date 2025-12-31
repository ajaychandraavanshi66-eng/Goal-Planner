
import React, { useState } from 'react';
import dayjs from 'dayjs';
// Added Calendar as CalendarIcon to fix the undefined name error
import { ChevronLeft, ChevronRight, X, CheckCircle2, Circle, Clock, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { usePlannerStore } from '../store/usePlannerStore';
import { getDayCompletions, isTaskDueOnDate } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';

const Planner: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { tasks, completions, goals, toggleCompletion } = usePlannerStore();

  const startOfMonth = currentDate.startOf('month');
  const daysInMonth = currentDate.daysInMonth();
  const startDay = startOfMonth.day(); // 0-6

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

  const nextMonth = () => setCurrentDate(prev => prev.add(1, 'month'));
  const prevMonth = () => setCurrentDate(prev => prev.subtract(1, 'month'));

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const tasksForSelectedDay = selectedDate 
    ? tasks.filter(t => t.isActive && isTaskDueOnDate(t, selectedDate)) 
    : [];

  const completedForSelectedDay = selectedDate
    ? completions.filter(c => c.date === selectedDate && c.isCompleted).map(c => c.taskId)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold font-outfit flex items-center gap-2">
          Monthly <span className="text-purple-400">Planner</span>
        </h1>
        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-2xl border border-white/10 self-start md:self-auto">
          <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-bold min-w-[150px] text-center font-outfit">
            {currentDate.format('MMMM YYYY')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <GlassCard className="p-4 md:p-8" hoverEffect={false}>
        <div className="grid grid-cols-7 gap-1 md:gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-bold opacity-40 uppercase pb-4 tracking-widest">
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
                      backgroundColor: `rgba(34, 211, 238, ${completion / 100})`,
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <CalendarIcon size={20} />
          </div>
          <div>
            <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Monthly Schedule</p>
            <p className="text-2xl font-bold font-outfit">{tasks.length} Active Tasks</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Total Completions</p>
            <p className="text-2xl font-bold font-outfit">{completions.filter(c => dayjs(c.date).isSame(currentDate, 'month')).length}</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs opacity-40 uppercase tracking-widest font-bold">Avg Consistency</p>
            <p className="text-2xl font-bold font-outfit">72%</p>
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
                    
                    // Calculate end time
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
