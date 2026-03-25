import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Coins } from 'lucide-react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  // Dynamic Password Rules 
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    setStrength(score);
  }, [password]);

  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500', 'bg-emerald-500'];

  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState('₹'); // Default to Rupee

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (strength >= 3) {
      localStorage.setItem('user_name', fullName);
      localStorage.setItem('user_currency', currency);
      navigate('/enhanced/onboarding');
    } else {
      alert("Please choose a stronger password matching the rules.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F8] dark:bg-[#070707] flex flex-col justify-center items-center p-6 selection:bg-black/10 py-12">
      
      <Link to="/enhanced" className="absolute top-8 left-8 flex items-center gap-2 text-black dark:text-[#ccff00] font-black text-xl tracking-tight hover:opacity-80 transition-opacity">
        <Zap className="w-5 h-5 fill-black dark:fill-[#ccff00]" />
        LedgerLens AI
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[32px] shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-slate-500">Join the smartest financial engine today.</p>
        </div>

        <button className="w-full mb-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="mb-6 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-white dark:bg-[#121213] text-slate-500 font-medium">Or register with email</span></div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full bg-slate-100 dark:bg-black/40 border-none rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 placeholder:text-slate-400 transition-all font-medium text-sm" placeholder="Full Name" />
            </div>
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" required className="w-full bg-slate-100 dark:bg-black/40 border-none rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 placeholder:text-slate-400 transition-all font-medium text-sm" placeholder="Email Address" />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/40 border-none rounded-2xl pl-12 pr-12 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 placeholder:text-slate-400 transition-all font-medium text-sm"
                placeholder="Create Password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Dynamic Password Rules UI */}
            {password.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-2 uppercase tracking-wider">Strength: {strengthLabels[strength]}</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className={`h-1.5 flex-1 rounded-full ${strength >= level ? strengthColors[strength] : 'bg-slate-300 dark:bg-slate-700'} transition-colors duration-500`} />
                  ))}
                </div>
                <ul className="text-xs font-medium space-y-1.5 text-slate-500 px-1">
                  <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-emerald-500' : ''}`}>• Minimum 8 characters</li>
                  <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-emerald-500' : ''}`}>• At least 1 uppercase letter</li>
                  <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-emerald-500' : ''}`}>• At least 1 number</li>
                  <li className={`flex items-center gap-2 ${/[^a-zA-Z0-9]/.test(password) ? 'text-emerald-500' : ''}`}>• At least 1 special character</li>
                </ul>
              </motion.div>
            )}
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Preferred Currency</label>
            <div className="grid grid-cols-3 gap-3">
               {[
                 { label: 'Rupee (₹)', value: '₹' },
                 { label: 'Dollar ($)', value: '$' },
                 { label: 'Euro (€)', value: '€' }
               ].map((c) => (
                 <button
                   key={c.value}
                   type="button"
                   onClick={() => setCurrency(c.value)}
                   className={`py-3 rounded-2xl text-sm font-bold border transition-all ${
                     currency === c.value 
                       ? 'bg-black dark:bg-[#ccff00] border-black dark:border-[#ccff00] text-white dark:text-black shadow-lg shadow-black/20' 
                       : 'bg-slate-100 dark:bg-black/40 border-transparent text-slate-500 hover:bg-slate-200 dark:hover:bg-white/5'
                   }`}
                 >
                   {c.label}
                 </button>
               ))}
            </div>
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type={showPassword ? "text" : "password"} required className="w-full bg-slate-100 dark:bg-black/40 border-none rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 placeholder:text-slate-400 transition-all font-medium text-sm" placeholder="Confirm Password" />
            </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-black dark:bg-[#ccff00] text-white dark:text-black py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2">
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center font-medium text-sm text-slate-500 mt-8">
          Already have an account? <Link to="/enhanced/login" className="text-teal-600 dark:text-[#ccff00] font-bold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
