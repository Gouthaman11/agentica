import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed.');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_name', data.user?.name || 'User');
      localStorage.setItem('user_username', data.user?.username || '');
      localStorage.setItem('user_email', data.user?.email || '');
      localStorage.setItem('user_phone', data.user?.phone || '');
      localStorage.setItem('user_currency', data.user?.currency || '?');
      navigate('/enhanced/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-6 selection:bg-black/10">
      <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] rounded-[36px] overflow-hidden border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] grid md:grid-cols-2">
        <section className="p-8 md:p-12 lg:p-14 flex flex-col">
          <div className="flex items-center justify-between">
            <Link to="/enhanced" className="flex items-center gap-3">
              <span className="w-8 h-8 bg-black rounded-[10px] flex items-center justify-center shadow-md">
                <Zap className="w-4.5 h-4.5 fill-white text-white" />
              </span>
              <span className="font-extrabold text-xl tracking-tight text-black">LedgerLens</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md my-auto"
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-black leading-[1.05]">Welcome back</h1>

            <form onSubmit={handleLogin} className="mt-10 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-12 rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  <button type="button" className="text-xs font-bold text-teal-600 hover:text-teal-700">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 rounded-full border border-slate-200 bg-white pl-12 pr-12 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60"
              >
                {loading ? 'Signing in...' : (<><span>Sign In</span><ArrowRight className="w-4 h-4" /></>)}
              </button>

              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
            </form>

            <p className="mt-8 text-sm text-slate-500">
              New here?{' '}
              <Link to="/enhanced/signup" className="font-bold text-teal-600 hover:underline">
                Create an account
              </Link>
            </p>

            <div className="mt-6">
              <Link
                to="/enhanced"
                className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-black transition-colors"
              >
                Back to home
              </Link>
            </div>
          </motion.div>
        </section>

        <aside className="relative hidden md:block min-h-[420px]">
          <img src="/login_laptop_light.svg" alt="Financial insights visual" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.06))]" />
          <div className="relative h-full p-8 lg:p-10 flex items-start justify-center">
            <div className="max-w-xl text-center pt-2">
              <h2 className="text-2xl lg:text-4xl font-extrabold text-white leading-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                Stop reading statements. Start understanding them.
              </h2>
              <p className="mt-3 text-white/90 text-sm leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                Sign in to continue analyzing transactions, trends, and insights in your LedgerLens workspace.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
