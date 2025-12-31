
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { usePlannerStore } from '../store/usePlannerStore';
import { GlassCard } from '../components/GlassCard';
import { getWeeklyStats, getGoalPerformance, calculateStreak, calculateBestStreak, isTaskDueOnDate } from '../utils/dateUtils';
import dayjs from 'dayjs';

const Progress: React.FC = () => {
  const { goals, completions, tasks, settings } = usePlannerStore();

  const weeklyData = useMemo(() => getWeeklyStats(completions, tasks), [completions, tasks]);
  const goalPerformance = useMemo(() => getGoalPerformance(goals, tasks, completions), [goals, tasks, completions]);
  const currentStreak = useMemo(() => calculateStreak(completions, tasks), [completions, tasks]);
  const bestStreak = useMemo(() => calculateBestStreak(completions, tasks), [completions, tasks]);

  // Monthly execution history for last 6 months
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const date = dayjs().subtract(5 - i, 'month');
      const monthStr = date.format('MMM');
      // Real historical completion check
      const start = date.startOf('month');
      const days = date.daysInMonth();
      let monthTotal = 0;
      let monthCount = 0;
      
      for(let d=0; d<days; d++) {
        const dateStr = start.add(d, 'day').format('YYYY-MM-DD');
        const due = tasks.filter(t => isTaskDueOnDate(t, dateStr));
        if (due.length > 0) {
          const finished = completions.filter(c => c.date === dateStr && c.isCompleted);
          monthTotal += (finished.length / due.length);
          monthCount++;
        }
      }
      
      const value = monthCount > 0 ? Math.round((monthTotal / monthCount) * 100) : 0;
      return { month: monthStr, value };
    });
  }, [completions, tasks]);

  const bestGoal = useMemo(() => {
    if (goalPerformance.length === 0) return 'None';
    return goalPerformance.reduce((prev, curr) => prev.value > curr.value ? prev : curr).name;
  }, [goalPerformance]);

  const avgDailyTasks = useMemo(() => {
    if (tasks.length === 0) return '0';
    const totalDueInLast7 = weeklyData.reduce((acc, curr) => {
      const dueCount = tasks.filter(t => isTaskDueOnDate(t, curr.date)).length;
      return acc + dueCount;
    }, 0);
    return (totalDueInLast7 / 7).toFixed(1);
  }, [tasks, weeklyData]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold font-outfit">Analytics & <span className="text-cyan-400">Growth</span></h1>
           <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-1">Deep insights into your consistency</p>
        </div>
        <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">Auto-Refreshed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <GlassCard className="h-96">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-outfit">Weekly Activity</h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">Last 7 Days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--card-subtext)', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                />
                <Bar dataKey="completion" radius={[8, 8, 0, 0]} barSize={32}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={settings.accentColor} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Goal Performance */}
        <GlassCard className="h-96">
          <h2 className="text-xl font-bold font-outfit mb-6">Goal Consistency</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={goalPerformance}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fill: 'var(--card-subtext)', fontSize: 11 }} />
                <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {goalPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Execution Trend */}
        <GlassCard className="lg:col-span-2 h-96">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-outfit">Execution Trend</h2>
            <div className="flex gap-4 text-[10px] font-bold uppercase opacity-40">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.accentColor }}></div> Performance</div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={settings.accentColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={settings.accentColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--card-subtext)' }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px'
                  }}
                />
                <Area type="monotone" dataKey="value" stroke={settings.accentColor} fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Streak', value: `${currentStreak} Days`, color: 'text-orange-400' },
          { label: 'Best Streak', value: `${bestStreak} Days`, color: 'text-cyan-400' },
          { label: 'Mastery', value: bestGoal, color: 'text-green-400' },
          { label: 'Avg Daily Tasks', value: avgDailyTasks, color: 'text-pink-400' },
        ].map((stat, i) => (
          <GlassCard key={i} className="text-center group">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 font-bold transition-all group-hover:text-white/60">{stat.label}</p>
            <p className={`text-xl md:text-2xl font-bold font-outfit truncate transition-transform group-hover:scale-105 ${stat.color}`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Progress;
