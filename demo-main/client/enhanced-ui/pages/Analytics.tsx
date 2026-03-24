import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Wallet, TrendingUp, TrendingDown, ArrowRight, ArrowRightLeft, 
  Calendar, FileText, BarChart3, Repeat, Activity, Layers, Sigma
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

// MOCK DATA
const cashFlowData = [
  { name: 'Jan', income: 45000, expense: 28000, net: 17000 },
  { name: 'Feb', income: 42000, expense: 31000, net: 11000 },
  { name: 'Mar', income: 55000, expense: 48000, net: 7000 },
  { name: 'Apr', income: 48000, expense: 35000, net: 13000 },
  { name: 'May', income: 52000, expense: 29000, net: 23000 },
  { name: 'Jun', income: 50000, expense: 34000, net: 16000 },
];

const categoryData = [
  { name: 'Rent & Utilities', value: 35000, percent: 35 },
  { name: 'Food & Dining', value: 25000, percent: 25 },
  { name: 'Software Subs', value: 15000, percent: 15 },
  { name: 'Travel', value: 15000, percent: 15 },
  { name: 'Misc', value: 10000, percent: 10 },
];

const recurringData = [
  { id: 1, merchant: 'Netflix', frequency: 'Monthly', amount: 499, category: 'Software Subs' },
  { id: 2, merchant: 'WeWork Options', frequency: 'Monthly', amount: 15000, category: 'Rent & Utilities' },
  { id: 3, merchant: 'AWS Services', frequency: 'Monthly', amount: 4500, category: 'Software Subs' },
  { id: 4, merchant: 'Internet Bill', frequency: 'Monthly', amount: 1200, category: 'Rent & Utilities' },
];

const dailyTrendData = [
  { day: 'Mon', spend: 4000 }, { day: 'Tue', spend: 3000 }, { day: 'Wed', spend: 8000 },
  { day: 'Thu', spend: 4500 }, { day: 'Fri', spend: 12000 }, { day: 'Sat', spend: 15000 }, { day: 'Sun', spend: 9000 },
];

const uploadComparisonData = [
  { name: 'Upload 1 (Jan-Feb)', income: 87000, expense: 59000 },
  { name: 'Upload 2 (Mar-Apr)', income: 103000, expense: 83000 },
  { name: 'Upload 3 (May-Jun)', income: 102000, expense: 63000 },
];

export default function Analytics() {
  return (
    <div className="space-y-8 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Analytics Data</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Structured accounting intelligence, multi-file trends, and deep quantitative breakdown.</p>
      </div>

      {/* 7. ACCOUNTING-LEVEL SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm col-span-1 md:col-span-3">
          <div className="grid grid-cols-3 gap-6 divide-x divide-slate-200 dark:divide-white/10">
            <div className="px-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-rose-500" /> Total Debit (Expenses)</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹205,000</h2>
            </div>
            <div className="px-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Total Credit (Income)</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹292,000</h2>
            </div>
            <div className="px-6">
              <p className="text-sm font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-2 mb-2"><Wallet className="w-4 h-4" /> Net Balance</p>
              <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">₹87,000</h2>
            </div>
          </div>
        </motion.div>
        
        {/* 6. INCOME vs EXPENSE RATIO */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-3xl bg-slate-900 dark:bg-black backdrop-blur-xl border border-slate-800 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Cash Efficiency</p>
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-2xl font-bold text-white">70%</span>
              <p className="text-xs text-rose-400">Spent</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-emerald-400">30%</span>
              <p className="text-xs text-emerald-500">Saved</p>
            </div>
          </div>
          <div className="w-full h-3 bg-emerald-500/20 rounded-full overflow-hidden flex">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: '70%' }}></div>
            <div className="h-full bg-emerald-500" style={{ width: '30%' }}></div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. CASH FLOW ANALYSIS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-500" /> Cash Flow Trend</h2>
          <div className="h-[300px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area type="monotone" name="Income" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" name="Expense" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
                <Line type="monotone" name="Net Cash Flow" dataKey="net" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
              <div><p className="text-xs font-bold text-slate-500 uppercase">Avg Income</p><p className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹48,666</p></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase">Avg Expense</p><p className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹34,166</p></div>
              <div><p className="text-xs font-bold text-slate-500 uppercase">Avg Net Flow</p><p className="text-lg font-bold text-indigo-500 mt-1">₹14,500</p></div>
          </div>
        </motion.div>

        {/* 2. CATEGORY-WISE EXPENSE DISTRIBUTION */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm flex flex-col"
        >
          <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2"><PieChart className="w-5 h-5 text-indigo-500" /> Category Distribution</h2>
          <div className="h-[200px] w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip formatter={(val: number) => `₹${val.toLocaleString()}`} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex-1">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 uppercase">
                  <th className="pb-2 font-bold">Category</th>
                  <th className="pb-2 font-bold text-right">Amount</th>
                  <th className="pb-2 font-bold text-right">% Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((cat, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span> {cat.name}
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-900 dark:text-white">₹{cat.value.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-slate-500">{cat.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
            <p className="text-xs text-indigo-800 dark:text-indigo-300"><span className="font-bold">Top Spending:</span> Rent & Utilities clearly dominates overall expenditure volume.</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. TIME-BASED & 9. VOLATILITY ANALYSIS */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm space-y-8"
        >
          <div>
            <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-500" /> Time-Based Spending Trend</h2>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip cursor={{fill: 'rgba(168, 85, 247, 0.1)'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(val: number) => `₹${val.toLocaleString()}`} />
                  <Bar dataKey="spend" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold">Peak Spend Day</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">Saturday (₹15,000)</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                <p className="text-xs text-slate-500 uppercase font-bold">Lowest Spend Day</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">Tuesday (₹3,000)</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-white/5">
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2"><Activity className="w-5 h-5 text-rose-500" /> Expense Volatility</h2>
            <div className="w-full flex items-center justify-between p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                 <div>
                   <p className="font-bold text-rose-900 dark:text-rose-200">March Spiked by 54.8%</p>
                   <p className="text-xs text-rose-700 dark:text-rose-400">March expense (₹48,000) vs February (₹31,000)</p>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* 5. RECURRING & 3. TRANSACTION FLOW */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm flex flex-col space-y-8"
        >
          <div>
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2"><Repeat className="w-5 h-5 text-emerald-500" /> Recurring Transactions Baseline</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-500 uppercase bg-slate-50 dark:bg-white/5">
                  <tr>
                    <th className="px-4 py-3 font-bold rounded-l-lg">Merchant</th>
                    <th className="px-4 py-3 font-bold">Frequency</th>
                    <th className="px-4 py-3 font-bold">Category</th>
                    <th className="px-4 py-3 font-bold text-right rounded-r-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recurringData.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{item.merchant}</td>
                      <td className="px-4 py-3 text-slate-500">{item.frequency}</td>
                      <td className="px-4 py-3 text-slate-500">{item.category}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 flex justify-between items-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase">Fixed Monthly Commitment</span>
              <span className="text-base font-bold text-emerald-900 dark:text-emerald-100">₹21,199</span>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex-1">
            <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-sky-500" /> Transaction Flow Architecture</h2>
            <div className="flex flex-col gap-4">
               {/* Custom Flow Diagram Simulation */}
               {[
                 { source: 'Bank Checking', dist: 'Food & Dining', mer: 'Swiggy / Zomato', amt: '12k', color: 'border-rose-500/30 dark:border-rose-500/50 text-rose-500' },
                 { source: 'Bank Checking', dist: 'Rent', mer: 'WeWork Provider', amt: '15k', color: 'border-emerald-500/30 dark:border-emerald-500/50 text-emerald-500' },
                 { source: 'Bank Credit', dist: 'Software', mer: 'AWS / Netflix', amt: '5k', color: 'border-indigo-500/30 dark:border-indigo-500/50 text-indigo-500' }
               ].map((flow, i) => (
                 <div key={i} className="flex items-center text-xs w-full">
                    <div className="w-24 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-center shadow-sm">{flow.source}</div>
                    <div className={`flex-1 h-px border-t-2 border-dashed ${flow.color} mx-2 flex justify-center relative translate-y-[-50%]`}></div>
                    <div className="w-28 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-medium text-center shadow-sm">{flow.dist}</div>
                    <div className={`w-8 h-px border-t-2 border-dashed ${flow.color} mx-2 relative translate-y-[-50%]`}></div>
                    <div className="w-32 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 font-bold flex justify-between items-center shadow-sm">
                       <span>{flow.mer}</span>
                       <span className={flow.color.split(' ').pop()}>{flow.amt}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 8. MULTI-UPLOAD COMPARISON */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.6 }}
           className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-500" /> Multi-Upload Trajectory</h2>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uploadComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={(val: number) => `₹${val.toLocaleString()}`} />
                <Line type="step" name="Cyclical Income" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                <Line type="step" name="Cyclical Expense" dataKey="expense" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 10. DATA INTERPRETATION (NO ADVICE) */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.7 }}
           className="p-8 rounded-3xl bg-slate-900 dark:bg-black backdrop-blur-xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] pointer-events-none" />
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6"><Sigma className="w-6 h-6 text-indigo-400" /> Analytical Observations</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
               <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
               <p className="text-sm text-slate-300 leading-relaxed font-medium">Expenses show extreme variability across reporting months, predominantly peaking in March driven by irregular debits.</p>
            </li>
            <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
               <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
               <p className="text-sm text-slate-300 leading-relaxed font-medium">Rent & Utilities (35%) form a strictly consistent cost baseline, whereas Food & Dining (25%) exhibits fluctuating frequency behavior.</p>
            </li>
            <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
               <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
               <p className="text-sm text-slate-300 leading-relaxed font-medium">Upload variance analysis strictly maps a 10.6% aggregate increase in discretionary spending volume compared to initial baseline arrays.</p>
            </li>
          </ul>
        </motion.div>
      </div>

    </div>
  );
}
