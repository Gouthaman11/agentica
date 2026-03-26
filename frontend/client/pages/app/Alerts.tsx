import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertOctagon, CheckCircle2, ChevronDown, ChevronUp, Activity, Cpu, ShieldAlert, Sparkles, TrendingUp, Info, ShieldCheck } from 'lucide-react';

interface AlertProps {
  title: string;
  reason: string;
  action: string;
  severity: 'High' | 'Medium' | 'Low';
  delay: number;
}

const AnomalyCard = ({ title, reason, action, severity, delay }: AlertProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getSeverityColors = (sev: string) => {
    switch(sev) {
      case 'High': return { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500/20', darkBg: 'dark:bg-rose-500/5', bar: 'bg-rose-500', hover: 'hover:border-rose-500/40' };
      case 'Medium': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', darkBg: 'dark:bg-amber-500/5', bar: 'bg-amber-500', hover: 'hover:border-amber-500/40' };
      default: return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', darkBg: 'dark:bg-blue-500/5', bar: 'bg-blue-500', hover: 'hover:border-blue-500/40' };
    }
  };

  const colors = getSeverityColors(severity);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden p-6 rounded-2xl border ${colors.border} bg-white/60 dark:bg-black/40 ${colors.hover} transition-all duration-300 shadow-sm`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${colors.bar}`}></div>
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${colors.bg} ${colors.text}`}>
          {severity === 'High' ? <AlertOctagon className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-bold text-lg text-slate-900 dark:text-white`}>
              {title}
            </h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${colors.bg} ${colors.text}`}>
              Severity: {severity}
            </span>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"><Info className="w-3.5 h-3.5" /> Detailed Reason</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{reason}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1"><ShieldCheck className="w-3.5 h-3.5" /> Suggested Action</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{action}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-1">{reason}</p>
            )}
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-between">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:text-indigo-700 transition-colors"
            >
              {isExpanded ? <><ChevronUp className="w-4 h-4" /> View Less</> : <><ChevronDown className="w-4 h-4" /> View Full Report</>}
            </button>
            {isExpanded && (
              <div className="flex gap-2">
                <button className="text-xs font-medium px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition shadow-md">Resolve</button>
                <button className="text-xs font-medium px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">Dismiss</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Alerts() {
  const currencySymbol = localStorage.getItem('user_currency') || '₹';
  const anomalies: AlertProps[] = [
    { 
      title: 'High Spending Spike Detected', 
      reason: 'Your total expenses increased by 42% in the latest upload compared to the previous period. Major increase observed strictly in Food and Subscription categories.', 
      action: 'Review recent transactions immediately and identify avoidable expenses to prevent cash flow drainage.',
      severity: 'High',
      delay: 0.1
    },
    { 
      title: 'Duplicate Transaction Alert', 
      reason: `A duplicate charge of ${currencySymbol}499 for Netflix has been detected within a short time frame of exactly 4 hours.`, 
      action: 'Verify with your bank or service provider for a possible refund. Dispute the charge if unauthorized.',
      severity: 'Medium',
      delay: 0.2
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Alerts & Anomalies</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Enterprise-grade transaction monitoring and anomaly detection engine.</p>
        </div>
        <div className="flex bg-rose-500/10 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-xl text-sm font-bold items-center gap-2 border border-rose-500/20 shadow-sm animate-pulse">
          <Cpu className="w-4 h-4" />
          Real-time Scanning Active
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Critical Alerts Pipeline */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security & Anomaly Pipeline</h2>
          </div>
          
          <div className="space-y-5">
            {anomalies.map((anomaly, index) => (
              <AnomalyCard key={index} {...anomaly} />
            ))}
          </div>
        </div>

        {/* Global Stats / Smart Suggestions Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent backdrop-blur-xl border border-indigo-500/10 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
                Actionable Next Steps
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/60 dark:bg-black/40 border border-slate-200/50 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Invest Idle Cash</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">You have {currencySymbol}45,000 sitting idle. Moving this to a treasury account could yield ~{currencySymbol}1,080/mo.</p>
                    <button className="mt-3 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                      Execute Strategy →
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/60 dark:bg-black/40 border border-slate-200/50 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Optimize Tax Credits</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">Your engineering expenses appear to qualify for an extra {currencySymbol}12,000 in R&D credits.</p>
                    <button className="mt-3 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                      View Report →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-slate-200/50 dark:border-white/5 text-center flex items-center gap-3">
              <Activity className="w-8 h-8 text-slate-400 shrink-0" />
              <p className="text-xs text-slate-500 dark:text-slate-400 text-left font-medium">Engine is actively monitoring transactions across 12 connected endpoints.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
