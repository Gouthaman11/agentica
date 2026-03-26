import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-emerald-500'];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (strength < 3) {
      setError('Please choose a stronger password matching the rules.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);

    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
      const response = await fetch(`${apiBase}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          username,
          email,
          password,
          phone: phoneNumber,
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Signup failed.');
      }

      localStorage.setItem('user_name', fullName || 'User');
      localStorage.setItem('user_username', username);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_phone', phoneNumber);
      localStorage.setItem('user_currency', currency);

      setSuccess('Account created successfully. Please sign in.');
      setTimeout(() => navigate('/enhanced/login'), 800);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign up.';
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
            <h1 className="text-5xl font-extrabold tracking-tight text-black leading-[1.05]">Sign Up</h1>

            <form onSubmit={handleSignup} className="mt-8 space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="w-full h-12 rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                />
              </div>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full h-12 rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className="w-full h-12 rounded-full border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                />
              </div>

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

              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
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

                {password.length > 0 && (
                  <div className="mt-3 p-3 rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strength</span>
                      <span className="text-xs font-bold text-slate-700">{strengthLabels[strength]}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1.5 flex-1 rounded-full ${strength >= lvl ? strengthColors[strength] : 'bg-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full h-12 rounded-full border border-slate-200 bg-white pl-12 pr-12 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="pt-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preferred currency</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'INR', value: 'INR' },
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                    { label: 'GBP', value: 'GBP' },
                  ].map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCurrency(c.value)}
                      className={`h-10 rounded-full text-sm font-bold border transition ${currency === c.value
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-black text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60"
              >
                {loading ? 'Creating Account...' : (<><span>Create Account</span><ArrowRight className="w-4 h-4" /></>)}
              </button>

              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
              {success && <p className="text-sm font-medium text-emerald-600">{success}</p>}
            </form>

            <p className="mt-6 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/enhanced/login" className="font-bold text-teal-600 hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </section>

        <aside className="relative hidden md:block min-h-[420px]">
          <img src="/signup_laptop.svg" alt="Signup insights visual" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.06))]" />
          <div className="relative h-full p-8 lg:p-10 flex items-start justify-center">
            <div className="max-w-xl text-center pt-2">
              <h2 className="text-2xl lg:text-4xl font-extrabold text-white leading-[1.1] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                Start turning your financial data into powerful insights.
              </h2>
              <p className="mt-3 text-white/90 text-sm leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                Create your account to structure transactions, visualize trends, and unlock deeper financial intelligence.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


