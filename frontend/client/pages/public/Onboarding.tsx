import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, UploadCloud, Building2, UserCircle, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [useCase, setUseCase] = useState<'personal' | 'business' | null>(null);
  const [currency, setCurrency] = useState('INR');
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const symbols: Record<string, string> = { 'INR': '₹', 'USD': '$', 'EUR': '€', 'GBP': '£' };
      localStorage.setItem('user_currency', symbols[currency] || '₹');
      navigate('/enhanced/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F1115] flex flex-col justify-center items-center p-6 selection:bg-indigo-500/30">
      
      {/* Background glow mapping across the workflow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="absolute top-10 flex gap-2 w-full max-w-md px-6 z-10">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'}`} />
        ))}
      </div>

      <motion.div 
        layout
        className="w-full max-w-xl bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 p-10 rounded-[40px] shadow-2xl z-10 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-6">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Upload your first statement</h2>
                <p className="text-slate-500 text-lg">Let Nexus AI process your raw data into structured insights instantly.</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-indigo-500 transition-colors bg-white/50 dark:bg-black/20 rounded-[24px] p-10 text-center cursor-pointer mb-8 group">
                <UploadCloud className="w-10 h-10 mx-auto text-slate-400 group-hover:text-indigo-500 transition-colors mb-4" />
                <p className="font-bold text-slate-900 dark:text-white">Click or drag PDF statement</p>
                <p className="text-sm text-slate-500 mt-2">Supports multi-page bank format (HDFC, SBI, ICICI, etc.)</p>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={handleNext} className="text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Skip for now</button>
                <button onClick={handleNext} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Select your use case</h2>
                <p className="text-slate-500 text-lg">We optimize chart categories (CoA) based on your intent.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div 
                  onClick={() => setUseCase('personal')}
                  className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all ${useCase === 'personal' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/20'}`}
                >
                  <UserCircle className={`w-8 h-8 mb-4 ${useCase === 'personal' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Personal Finance</h3>
                  <p className="text-sm text-slate-500 mt-2">Track expenses, budget smarter, and enhance savings rate.</p>
                  {useCase === 'personal' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-4" />}
                </div>
                
                <div 
                  onClick={() => setUseCase('business')}
                  className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all ${useCase === 'business' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/20'}`}
                >
                  <Building2 className={`w-8 h-8 mb-4 ${useCase === 'business' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Business Accounting</h3>
                  <p className="text-sm text-slate-500 mt-2">Generate PnL, journal entries, and track cash-flow runways.</p>
                  {useCase === 'business' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-4" />}
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleNext} 
                  disabled={!useCase}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${useCase ? 'bg-indigo-600 text-white hover:scale-105 shadow-xl shadow-indigo-600/20' : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'}`}
                >
                  Continue Configuration <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Choose local currency</h2>
                <p className="text-slate-500 text-lg">Select the primary currency metrics you deal in.</p>
              </div>

              <div className="bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[24px] p-2 mb-10 text-lg font-bold">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 py-4 px-6 text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="INR">₹ (INR) Indian Rupee</option>
                  <option value="USD">$ (USD) US Dollar</option>
                  <option value="EUR">€ (EUR) Euro</option>
                  <option value="GBP">£ (GBP) British Pound</option>
                </select>
              </div>

              <div className="flex justify-end mt-12 w-full">
                <button onClick={handleNext} className="w-full px-8 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all shadow-xl dark:shadow-indigo-500/20 flex items-center justify-center gap-3">
                  <Zap className="w-4 h-4 fill-white" /> Access Dashboard 
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
