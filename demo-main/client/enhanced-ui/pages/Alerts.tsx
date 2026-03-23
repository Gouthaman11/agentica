import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, ShieldAlert, Cpu, CheckCircle2, TrendingUp, Sparkles, Activity } from 'lucide-react';

export default function Alerts() {
  const anomalies = [
    { id: 1, title: 'Unusual Expense Spike', desc: 'Software expenses are 215% higher than your 6-month average.', criticality: 'high' },
    { id: 2, title: 'Duplicate Transaction Detected', desc: 'Possible duplicate payment of $45.00 to "AWS Services" on Mar 22.', criticality: 'medium' },
    { id: 3, title: 'Unrecognized Vendor', desc: 'A transaction from "PAYPAL *XYZCorp" does not match your usual vendors.', criticality: 'medium' },
  ];

  const suggestions = [
    { id: 1, title: 'Invest Idle Cash', desc: 'You have $45,000 sitting idle. Moving this to a treasury account could yield ~$180/mo.', icon: TrendingUp },
    { id: 2, title: 'Optimize R&D Tax Credits', desc: 'Your engineering expenses appear to qualify for an extra $12k in credits.', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Alerts & AI Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Nexus AI automatically monitors your account for anomalies and optimization opportunities.</p>
        </div>
        <div className="flex bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm font-medium items-center gap-2 border border-indigo-500/20 shadow-sm animate-pulse">
          <Cpu className="w-4 h-4" />
          AI Monitor Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomalies Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Anomaly Detection</h2>
          </div>
          
          <div className="space-y-4">
            {anomalies.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden p-5 rounded-2xl border ${
                  item.criticality === 'high' 
                    ? 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20' 
                    : 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'
                }`}
              >
                {item.criticality === 'high' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                )}
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full mt-0.5 ${
                    item.criticality === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${item.criticality === 'high' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">Investigate</button>
                      <button className="text-xs font-medium px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition">Dismiss</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Smart Suggestions Section */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent backdrop-blur-xl border border-indigo-500/10 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
              Smart Suggestions
            </h2>
          </div>

          <div className="space-y-4">
            {suggestions.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="p-5 rounded-2xl bg-white/60 dark:bg-black/40 border border-slate-200/50 dark:border-white/5 hover:border-indigo-500/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                    <button className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                      Apply Suggestion →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-slate-200/50 dark:border-white/5 text-center">
            <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Nexus AI is analyzing your latest transactions. Check back tomorrow for more insights.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
