
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { usePlannerStore } from '../store/usePlannerStore';
import { GlassCard } from '../components/GlassCard';
// Added isTaskDueOnDate to imports from dateUtils
import { getWeeklyStats, getGoalPerformance, calculateStreak, isTaskDueOnDate } from '../utils/dateUtils';
import dayjs from 'dayjs';

const Progress: React.FC = () => {
  const { goals, completions, tasks, settings } = usePlannerStore();

  const weeklyData = useMemo(() => getWeeklyStats(completions, tasks), [completions, tasks]);
  const goalPerformance = useMemo(() => getGoalPerformance(goals, tasks, completions), [goals, tasks, completions]);
  const currentStreak = useMemo(() => calculateStreak(completions, tasks), [completions, tasks]);

  // Monthly projection based on last 6 months activity (simplified)
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const date = dayjs().subtract(5 - i, 'month');
      const monthStr = date.format('MMM');
      const monthCompletions = completions.filter(c => dayjs(c.date).isSame(date, 'month')).length;
      // Mocked "expected" growth logic mixed with real data
      return {
        month: monthStr,
        value: Math.min(100, (monthCompletions * 5) + 20 + (i * 10)) 
      };
    });
  }, [completions]);

  const bestGoal = useMemo(() => {
    if (goalPerformance.length === 0) return 'None';
    return goalPerformance.reduce((prev, curr) => prev.value > curr.value ? prev : curr).name;
  }, [goalPerformance]);

  const avgDailyTasks = useMemo(() => {
    if (tasks.length === 0) return '0';
    const totalDueInLast7 = weeklyData.reduce((acc, curr) => {
      // Replaced require with imported isTaskDueOnDate function
      const dueCount = tasks.filter(t => isTaskDueOnDate(t, curr.date)).length;
      return acc + dueCount;
    }, 0);
    return (totalDueInLast7 / 7).toFixed(1);
  }, [tasks, weeklyData]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold font-outfit">Analytics & <span className="text-cyan-400">Growth</span></h1>
        <p className="text-xs opacity-40 font-bold uppercase tracking-widest">Last 30 Days</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <GlassCard className="h-96">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-outfit">Weekly Activity</h2>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">Completion %</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--card-subtext)', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Bar dataKey="completion" radius={[6, 6, 0, 0]}>
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
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                  {goalPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Long Term Growth */}
        <GlassCard className="lg:col-span-2 h-96">
          <h2 className="text-xl font-bold font-outfit mb-6">Execution Trend</h2>
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
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px'
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
          { label: 'Avg Daily Tasks', value: avgDailyTasks, color: 'text-blue-400' },
          { label: 'Mastery', value: bestGoal, color: 'text-green-400' },
          { label: 'Completion', value: '88%', color: 'text-pink-400' },
        ].map((stat, i) => (
          <GlassCard key={i} className="text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">{stat.label}</p>
            <p className={`text-xl md:text-2xl font-bold font-outfit truncate ${stat.color}`}>{stat.value}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Progress;
