import React from 'react';
import { usePlannerStore } from '../store/usePlannerStore';
import { GlassCard } from '../components/GlassCard';
import { Settings as SettingsIcon, Bell, Shield, Palette, Download, Trash, Moon, Sun, RefreshCw } from 'lucide-react';
import dayjs from 'dayjs';

const Settings: React.FC = () => {
  const { settings, updateSettings, completions, goals, tasks } = usePlannerStore();

  const handleExport = () => {
    const fullData = { goals, tasks, completions, settings };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neon_planner_backup_${dayjs().format('YYYY-MM-DD')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAllData = () => {
    if(confirm("DANGER: This will permanently erase ALL goals, tasks, and history. Are you absolutely sure?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const resetOnlyProgress = () => {
    if(confirm("This will clear all completion history but keep your Goals and Tasks. Continue?")) {
      // Small hack: just clear the specific key if we didn't want to add a store action
      const saved = localStorage.getItem('neon_planner_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.completions = [];
        localStorage.setItem('neon_planner_data', JSON.stringify(parsed));
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold font-outfit">System <span className="text-purple-400">Settings</span></h1>
        <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-1">Configure your productivity environment</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-8">
            <Palette className="text-cyan-400" />
            <h2 className="text-xl font-bold font-outfit">Visual Interface</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">App Mode</p>
                <p className="text-xs opacity-60">Switch core theme lighting</p>
              </div>
              <div className="flex items-center glass-inner rounded-xl p-1">
                <button 
                  onClick={async () => {
                    try {
                      await updateSettings({ theme: 'light' });
                    } catch (error) {
                      console.error('Failed to update theme:', error);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${settings.theme === 'light' ? 'bg-white text-blue-600 shadow-md' : 'opacity-40 hover:opacity-100'}`}
                >
                  <Sun size={18} />
                  <span className="text-xs font-black uppercase tracking-tighter">Light</span>
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await updateSettings({ theme: 'dark' });
                    } catch (error) {
                      console.error('Failed to update theme:', error);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${settings.theme === 'dark' ? 'bg-slate-800 text-cyan-400 shadow-md' : 'opacity-40 hover:opacity-100'}`}
                >
                  <Moon size={18} />
                  <span className="text-xs font-black uppercase tracking-tighter">Dark</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Neon Accent</p>
                <p className="text-xs opacity-60">Signature glow color</p>
              </div>
              <div className="flex gap-2">
                {['#22d3ee', '#a855f7', '#ec4899', '#22c55e', '#f43f5e'].map(color => (
                  <button 
                    key={color}
                    onClick={async () => {
                      try {
                        await updateSettings({ accentColor: color });
                      } catch (error) {
                        console.error('Failed to update accent color:', error);
                      }
                    }}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${settings.accentColor === color ? 'border-white scale-125' : 'border-transparent'}`}
                    style={{ backgroundColor: color, boxShadow: settings.accentColor === color ? `0 0 10px ${color}` : 'none' }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">24-Hour Military Time</p>
                <p className="text-xs opacity-60">Precision scheduling format</p>
              </div>
              <button 
                onClick={async () => {
                  try {
                    await updateSettings({ timeFormat24h: !settings.timeFormat24h });
                  } catch (error) {
                    console.error('Failed to update time format:', error);
                  }
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.timeFormat24h ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.timeFormat24h ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-8">
            <Bell className="text-orange-400" />
            <h2 className="text-xl font-bold font-outfit">Communications</h2>
          </div>
          <p className="opacity-60 text-sm mb-6 leading-relaxed">External push notifications are pending authorization. High-priority routines require active focus reminders.</p>
          <button className="px-6 py-3 rounded-xl bg-orange-400/10 text-orange-400 border border-orange-400/20 font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-400/20 transition-all">Authorize Reminders</button>
        </GlassCard>

        {/* Data Management */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-green-400" />
            <h2 className="text-xl font-bold font-outfit">Core Data Repository</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl glass-inner hover:bg-white/10 transition-colors border border-white/5 font-bold uppercase text-xs tracking-widest"
            >
              <Download size={18} className="text-cyan-400" />
              Backup Vault (JSON)
            </button>
            <button 
              onClick={resetOnlyProgress}
              className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl glass-inner hover:bg-white/10 transition-colors border border-white/5 font-bold uppercase text-xs tracking-widest"
            >
              <RefreshCw size={18} className="text-purple-400" />
              Reset Execution History
            </button>
            <button 
              onClick={resetAllData}
              className="md:col-span-2 flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all font-bold uppercase text-xs tracking-widest"
            >
              <Trash size={18} />
              Wipe All Data Sources
            </button>
          </div>
        </GlassCard>
      </div>

      <div className="text-center opacity-20 text-[10px] font-black uppercase tracking-[0.3em] mt-12">
        <p>Neon Planner // Build: 1.0.4.Final</p>
        <p className="mt-1">Architected for Optimal Life Performance</p>
      </div>
    </div>
  );
};

export default Settings;