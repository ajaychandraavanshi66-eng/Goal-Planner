import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, LayoutGrid, Calendar, BarChart2, Target, Zap, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Define and organize your life goals with custom icons and colors'
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Create recurring tasks with flexible scheduling options'
    },
    {
      icon: Calendar,
      title: 'Calendar View',
      description: 'Visualize your progress with monthly and yearly calendar views'
    },
    {
      icon: BarChart2,
      title: 'Analytics',
      description: 'Track your consistency with detailed analytics and streaks'
    },
    {
      icon: Zap,
      title: 'Daily Focus',
      description: 'Focus on today\'s tasks with a clean, distraction-free interface'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your progress across all goals with visual indicators'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/20 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/20 flex items-center justify-center font-black text-3xl italic font-outfit text-white">
                N
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-outfit tracking-tighter uppercase italic">
                Neon<span className="text-cyan-400">Plan</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl opacity-80 mb-4 font-outfit">
              Transform Your Goals Into Daily Actions
            </p>
            <p className="text-base md:text-lg opacity-60 mb-12 max-w-2xl mx-auto">
              The ultimate productivity planner that helps you achieve your life goals through consistent daily routines and powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
              >
                Get Started Free
              </Link>
              <Link
                to="/signin"
                className="px-8 py-4 rounded-xl glass border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4">
            Powerful Features for <span className="text-cyan-400">Goal Achievement</span>
          </h2>
          <p className="text-lg opacity-60 max-w-2xl mx-auto">
            Everything you need to turn your aspirations into reality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mb-4">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-2">{feature.title}</h3>
              <p className="text-sm opacity-60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-12 text-center"
        >
          <Shield className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-lg opacity-60 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are achieving their goals with NeonPlan. Start your journey today.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
          >
            Create Free Account
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8 text-center opacity-40 text-sm">
        <p>© 2024 NeonPlan. Built for optimal life performance.</p>
      </div>
    </div>
  );
};

export default Landing;

