import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard,
  Target,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const AREA_DATA = [
  { name: 'Jan', value: 34000 },
  { name: 'Feb', value: 45000 },
  { name: 'Mar', value: 32000 },
  { name: 'Apr', value: 52000 },
  { name: 'May', value: 48000 },
  { name: 'Jun', value: 65000 },
  { name: 'Jul', value: 72000 },
];

const BAR_DATA = [
  { name: 'Food', value: 1200, color: '#3b82f6' },
  { name: 'Rent', value: 4500, color: '#6366f1' },
  { name: 'SaaS', value: 2800, color: '#8b5cf6' },
  { name: 'Travel', value: 1800, color: '#a855f7' },
];

export default function DashboardPreview() {
  return (
    <div className="w-full h-full bg-white dark:bg-[#0A0A0B] flex flex-col p-4 md:p-6 text-left selection:bg-blue-500/20">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Financial Overview</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time ledger intelligence</p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
             <Clock className="w-3 h-3" /> Last 30 Days
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 h-full min-h-0">
        
        {/* Left Column - Stats & Chart */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
             <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" /> Inflow
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">₹4,12,500</p>
             </div>
             <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <ArrowDownRight className="w-3 h-3 text-rose-500" /> Outflow
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">₹2,45,600</p>
             </div>
             <div className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-500/20">
                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Net
                </p>
                <p className="text-xl font-black text-white tabular-nums">₹1,66,900</p>
             </div>
          </div>

          {/* Main Area Chart */}
          <div className="flex-1 bg-white dark:bg-[#0E0E10] rounded-[32px] border border-slate-100 dark:border-white/5 p-6 shadow-sm flex flex-col relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-500/5 pointer-events-none" />
             <div className="flex items-center justify-between mb-6 relative z-10">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-blue-500" /> Balance Trend
                </h4>
             </div>
             <div className="flex-1 w-full min-h-[180px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={AREA_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={['dataMin - 5000', 'dataMax + 5000']} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Right Column - Breakdown & Spend */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
           
           {/* Spending Breakdown */}
           <div className="bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5 p-6 flex flex-col">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-500" /> Top Spending
              </h4>
              <div className="flex-1 w-full min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BAR_DATA} layout="vertical" barSize={12} margin={{ left: -30 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <RechartsTooltip />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                       {BAR_DATA.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                 {BAR_DATA.map(item => (
                   <div key={item.name} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[10px] font-bold text-slate-500">{item.name}</span>
                     </div>
                     <span className="text-[10px] font-black text-slate-800 dark:text-white tabular-nums">₹{item.value.toLocaleString()}</span>
                   </div>
                 ))}
              </div>
           </div>

           {/* Saving Goal */}
           <div className="flex-1 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[32px] p-6 text-white shadow-xl flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-1 flex items-center gap-2">
                  <Target className="w-3 h-3" /> Monthly Target
                </p>
                <h4 className="text-xl font-extrabold mb-4">Capital Buffer</h4>
                
                <div className="flex items-end gap-2 mb-2">
                   <p className="text-3xl font-black">82%</p>
                   <p className="text-[10px] font-bold text-blue-100 pb-1">COMPLETED</p>
                </div>
                
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-4">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '82%' }}
                     transition={{ duration: 1.5, delay: 0.5 }}
                     className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                   />
                </div>
                
                <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all">
                  Optimize Spend
                </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
