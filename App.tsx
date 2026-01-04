
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutGrid, CheckSquare, Calendar, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import Goals from './pages/Goals';
import Daily from './pages/Daily';
import Planner from './pages/Planner';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import { usePlannerStore } from './store/usePlannerStore';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const { settings } = usePlannerStore();
  
  const navItems = [
    { path: '/', label: 'Daily', icon: CheckSquare },
    { path: '/goals', label: 'Goals', icon: LayoutGrid },
    { path: '/planner', label: 'Planner', icon: Calendar },
    { path: '/progress', label: 'Progress', icon: BarChart2 },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:relative md:w-64 glass border-t md:border-t-0 md:border-r flex md:flex-col justify-around md:justify-start md:p-6 z-50 transition-colors" style={{ borderColor: 'var(--sidebar-border)', background: 'var(--sidebar-bg)' }}>
      <div className="hidden md:block mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br shadow-lg flex items-center justify-center font-black text-xl italic font-outfit text-white" style={{ 
            background: `linear-gradient(to bottom right, var(--accent-color, #22d3ee), #a855f7)`,
            boxShadow: `0 10px 20px rgba(var(--accent-color-rgb, 34, 211, 238), 0.2)`
          }}>N</div>
          <h1 className="text-xl font-black font-outfit tracking-tighter uppercase italic">Neon<span style={{ color: 'var(--accent-color, #22d3ee)' }}>Plan</span></h1>
        </div>
      </div>

      <div className="flex md:flex-col w-full md:gap-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link 
              key={path} 
              to={path} 
              className={`flex flex-col md:flex-row items-center gap-3 p-4 md:px-5 md:py-4 rounded-2xl transition-all relative overflow-hidden group
                ${isActive ? 'md:bg-opacity-10' : 'text-slate-500'}
              `}
              style={isActive ? { 
                color: 'var(--accent-color, #22d3ee)',
                backgroundColor: 'rgba(var(--accent-color-rgb, 34, 211, 238), 0.1)'
              } : {}}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--accent-color, #22d3ee)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '';
                }
              }}
            >
              <Icon 
                size={24} 
                style={{ 
                  color: isActive ? 'var(--accent-color, #22d3ee)' : undefined,
                  transition: 'color 0.2s ease'
                }} 
                className={!isActive ? 'group-hover:opacity-100 transition-all' : ''}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--accent-color, #22d3ee)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '';
                  }
                }}
              />
              <span 
                className="text-[10px] md:text-sm font-bold uppercase tracking-widest"
                style={isActive ? { color: 'var(--accent-color, #22d3ee)' } : {}}
              >{label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 md:w-1.5 h-full rounded-r-full hidden md:block"
                  style={{ backgroundColor: 'var(--accent-color, #22d3ee)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const { settings } = usePlannerStore();

  const applyThemeAndAccent = (theme: string, accentColor: string) => {
    // Explicitly set the theme class on the html element
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Set accent color as CSS variable for dynamic updates
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Convert hex to rgb for rgba usage
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb = hexToRgb(accentColor);
    if (rgb) {
      document.documentElement.style.setProperty('--accent-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  };

  useEffect(() => {
    applyThemeAndAccent(settings.theme, settings.accentColor);
  }, [settings.theme, settings.accentColor]);

  // Listen for settings updates from other components
  useEffect(() => {
    const handleSettingsUpdate = (event: CustomEvent) => {
      const newSettings = event.detail;
      applyThemeAndAccent(newSettings.theme, newSettings.accentColor);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
        <Sidebar />
        
        <main className="flex-1 p-6 md:p-12 pb-24 md:pb-12 max-w-6xl mx-auto w-full overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Daily />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Dynamic Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] blur-[150px] rounded-full" style={{ backgroundColor: `rgba(var(--accent-color-rgb, 34, 211, 238), 0.1)` }}></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 blur-[150px] rounded-full"></div>
          <div className="absolute top-[20%] left-[20%] w-px h-px" style={{ boxShadow: `0 0 100px 50px rgba(var(--accent-color-rgb, 34, 211, 238), 0.1)` }}></div>
        </div>
      </div>
    </Router>
  );
};

export default App;
