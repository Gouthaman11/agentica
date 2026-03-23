import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Activity, DollarSign, CreditCard, AlertCircle } from 'lucide-react';

const revenueData = [
  { name: 'Jan', value: 2400 },
  { name: 'Feb', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Apr', value: 3908 },
  { name: 'May', value: 4800 },
  { name: 'Jun', value: 3800 },
  { name: 'Jul', value: 4300 },
];

const recentActivity = [
  { id: 1, type: 'payment', amount: '+$3,200', name: 'Stripe Payout', time: '2 hours ago', status: 'Completed' },
  { id: 2, type: 'expense', amount: '-$120', name: 'AWS Cloud Services', time: '5 hours ago', status: 'Completed' },
  { id: 3, type: 'alert', amount: '', name: 'Unusual login detected', time: '1 day ago', status: 'Warning' },
  { id: 4, type: 'payment', amount: '+$850', name: 'Client Invoice #42', time: '1 day ago', status: 'Completed' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, your financial overview is looking great today.</p>
        </div>
        <div className="flex bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm font-medium items-center gap-2 border border-indigo-500/20 shadow-sm">
          <Activity className="w-4 h-4" />
          Live Metrics
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Revenue', value: '$84,230', change: '+12.5%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Transactions', value: '1,423', change: '+8.2%', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Active Alerts', value: '3', change: '-2', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' }
        ].map((stat, i) => (
          <motion.div
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            key={stat.title}
            className="group p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center text-emerald-500 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {stat.change}
              </span>
              <span className="ml-2 text-slate-500 dark:text-slate-500">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="lg:col-span-2 p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h2>
            <select className="bg-transparent text-sm text-slate-500 outline-none border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm"
        >
          <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Recent Activity</h2>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${activity.type === 'alert' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                    {activity.type === 'alert' ? <AlertCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.name}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${activity.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {activity.amount}
                  </p>
                  <p className="text-xs text-slate-500">{activity.status}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 rounded-xl hover:bg-indigo-500/20 transition-colors">
            View All Activity
          </button>
        </motion.div>
      </div>
    </div>
  );
}
