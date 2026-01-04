import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-react';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.register(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 blur-[150px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/20 flex items-center justify-center font-black text-2xl italic font-outfit text-white">
              N
            </div>
            <h1 className="text-3xl font-black font-outfit tracking-tighter uppercase italic">
              Neon<span className="text-cyan-400">Plan</span>
            </h1>
          </div>
          <h2 className="text-2xl font-bold font-outfit mb-2">Create Account</h2>
          <p className="text-sm opacity-60">Start your journey to achieving your goals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-inner rounded-xl p-4 pl-10 focus:border-cyan-400 outline-none transition-all"
                style={{ 
                  backgroundColor: 'var(--card-bg-inner)', 
                  color: 'var(--text-color)',
                  border: '1px solid var(--card-border-inner)'
                }}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-inner rounded-xl p-4 pl-10 pr-12 focus:border-cyan-400 outline-none transition-all"
                style={{ 
                  backgroundColor: 'var(--card-bg-inner)', 
                  color: 'var(--text-color)',
                  border: '1px solid var(--card-border-inner)'
                }}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full glass-inner rounded-xl p-4 pl-10 pr-12 focus:border-cyan-400 outline-none transition-all"
                style={{ 
                  backgroundColor: 'var(--card-bg-inner)', 
                  color: 'var(--text-color)',
                  border: '1px solid var(--card-border-inner)'
                }}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-lg shadow-cyan-500/30 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus size={20} />
                Sign Up
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm opacity-60">
            Already have an account?{' '}
            <Link to="/signin" className="text-cyan-400 hover:text-cyan-300 font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;

