import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Lightbulb, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

const monthlyData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
];

const categoryData = [
  { name: 'Software', value: 400 },
  { name: 'Marketing', value: 300 },
  { name: 'Rent', value: 300 },
  { name: 'Travel', value: 200 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your financial metrics with AI-powered insights.</p>
        </div>
      </div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-500/20 backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400">
            Nexus AI Insights
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          <div className="bg-white/60 dark:bg-black/40 p-4 rounded-2xl border border-white/20 dark:border-white/5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 mt-1">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Recurring Subscriptions</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">You have 3 unused software subscriptions. Canceling them could save $145/mo.</p>
              </div>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-black/40 p-4 rounded-2xl border border-white/20 dark:border-white/5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500 mt-1">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Cash Flow Optimization</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Moving your excess cash to a high-yield account could generate ~$3,200 annually.</p>
              </div>
            </div>
          </div>
          <div className="bg-white/60 dark:bg-black/40 p-4 rounded-2xl border border-white/20 dark:border-white/5 hidden lg:block">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 mt-1">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Revenue Projection</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on current trends, Q3 revenue is expected to grow by 18% compared to Q2.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Income vs Expenses</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                />
                <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm flex flex-col"
        >
          <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Expense Breakdown</h2>
          <div className="flex-1 min-h-[250px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {category.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
