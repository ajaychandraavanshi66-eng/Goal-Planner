
import React from 'react';
import { usePlannerStore } from '../store/usePlannerStore';
import { GlassCard } from '../components/GlassCard';
import { Settings as SettingsIcon, Bell, Shield, Palette, Download, Trash, Moon, Sun } from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings } = usePlannerStore();

  return (
    <div className="space-y-8 pb-20">
      <h1 className="text-3xl font-bold font-outfit">App <span className="text-purple-400">Settings</span></h1>

      <div className="grid gap-6">
        {/* Appearance */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-8">
            <Palette className="text-cyan-400" />
            <h2 className="text-xl font-bold font-outfit">Appearance</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">App Theme</p>
                <p className="text-xs opacity-60">Switch between dark and light modes</p>
              </div>
              <div className="flex items-center bg-black/10 rounded-xl p-1 border border-white/10">
                <button 
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${settings.theme === 'light' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500'}`}
                >
                  <Sun size={18} />
                  <span className="text-sm font-bold">Light</span>
                </button>
                <button 
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${settings.theme === 'dark' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500'}`}
                >
                  <Moon size={18} />
                  <span className="text-sm font-bold">Dark</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Accent Color</p>
                <p className="text-xs opacity-60">Main branding neon glow color</p>
              </div>
              <div className="flex gap-2">
                {['#22d3ee', '#a855f7', '#ec4899', '#22c55e'].map(color => (
                  <button 
                    key={color}
                    onClick={() => updateSettings({ accentColor: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accentColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">24-Hour Format</p>
                <p className="text-xs opacity-60">Toggle between 12h and 24h clock</p>
              </div>
              <button 
                onClick={() => updateSettings({ timeFormat24h: !settings.timeFormat24h })}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.timeFormat24h ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.timeFormat24h ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-8">
            <Bell className="text-orange-400" />
            <h2 className="text-xl font-bold font-outfit">Notifications</h2>
          </div>
          <p className="opacity-60 text-sm">Browser push notifications are currently disabled. Grant permission to receive reminders before task execution.</p>
          <button className="mt-4 text-cyan-400 hover:underline">Request Permissions</button>
        </GlassCard>

        {/* Data Management */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-green-400" />
            <h2 className="text-xl font-bold font-outfit">Data Management</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Download size={16} />
              Export JSON
            </button>
            <button 
              onClick={() => {
                if(confirm("Are you sure you want to reset all data?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash size={16} />
              Clear All Data
            </button>
          </div>
        </GlassCard>
      </div>

      <div className="text-center opacity-40 text-xs">
        <p>Neon Planner v1.0.0 (Pre-Alpha)</p>
        <p>Built for elite productivity</p>
      </div>
    </div>
  );
};

export default Settings;
