
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
    <nav className="fixed bottom-0 left-0 right-0 md:relative md:w-64 glass border-t md:border-t-0 md:border-r flex md:flex-col justify-around md:justify-start md:p-6 z-50 transition-colors" style={{ borderColor: 'var(--sidebar-border)' }}>
      <div className="hidden md:block mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/20 flex items-center justify-center font-black text-xl italic font-outfit text-white">N</div>
          <h1 className="text-xl font-black font-outfit tracking-tighter uppercase italic">Neon<span className="text-cyan-400">Plan</span></h1>
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
                ${isActive ? 'text-cyan-400 md:bg-cyan-400/10' : 'text-slate-500 hover:text-cyan-400'}
              `}
            >
              <Icon size={24} className={isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'} />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">{label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-1 md:w-1.5 h-full bg-cyan-400 rounded-r-full hidden md:block"
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

  useEffect(() => {
    document.documentElement.className = settings.theme;
  }, [settings.theme]);

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
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 blur-[150px] rounded-full"></div>
          <div className="absolute top-[20%] left-[20%] w-px h-px shadow-[0_0_100px_50px_rgba(34,211,238,0.1)]"></div>
        </div>
      </div>
    </Router>
  );
};

export default App;
