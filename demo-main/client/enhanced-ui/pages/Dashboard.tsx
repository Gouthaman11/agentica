import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, Bell, Calendar, Download, ChevronDown, ArrowRight, Sparkles, Activity, 
  Gamepad2, Dribbble, Music, Home
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

// Shared Dropdown Options Component for consistency everywhere
const DateOptions = () => (
  <>
    <option value="All Time">All Time</option>
    <option value="This Year">This Year</option>
    <option value="This Month">This Month</option>
    <option value="This Week">This Week</option>
    <option value="Today">Today</option>
    <option value="Jan">January</option>
    <option value="Feb">February</option>
    <option value="Mar">March</option>
    <option value="Apr">April</option>
    <option value="May">May</option>
    <option value="Jun">June</option>
    <option value="Jul">July</option>
    <option value="Aug">August</option>
    <option value="Sep">September</option>
    <option value="Oct">October</option>
    <option value="Nov">November</option>
    <option value="Dec">December</option>
  </>
);

// Dummy Data
const balanceData = [
  { month: 'Oct', value: 3000 },
  { month: 'Nov', value: 3200 },
  { month: 'Dec', value: 3100 },
  { month: 'Jan', value: 4500 },
  { month: 'Feb', value: 6514, isPeak: true },
  { month: 'Mar', value: 4000 },
  { month: 'Apr', value: 2500 },
];

const cashFlowIncome = [
  { month: 'Oct', value: 1200 },
  { month: 'Nov', value: 1500 },
  { month: 'Dec', value: 1400 },
  { month: 'Jan', value: 1800 },
  { month: 'Feb', value: 4821.50, isPeak: true },
  { month: 'Mar', value: 1000 },
  { month: 'Apr', value: 800 },
];

const cashFlowExpenses = [
  { month: 'Oct', value: 800 },
  { month: 'Nov', value: 900 },
  { month: 'Dec', value: 1100 },
  { month: 'Jan', value: 700 },
  { month: 'Feb', value: 2100, isPeak: true },
  { month: 'Mar', value: 600 },
  { month: 'Apr', value: 500 },
];

const cashFlowSavings = [
  { month: 'Oct', value: 400 },
  { month: 'Nov', value: 600 },
  { month: 'Dec', value: 300 },
  { month: 'Jan', value: 1100 },
  { month: 'Feb', value: 1800, isPeak: true },
  { month: 'Mar', value: 400 },
  { month: 'Apr', value: 300 },
];

const upcomingBills = [
  { name: 'Twitch', date: '4 Jan, 2025', amount: '$9.99', icon: Gamepad2, color: 'text-purple-600', bg: 'bg-purple-100' },
  { name: 'Dribbble Pro', date: '5 Jan, 2025', amount: '$15.00', icon: Dribbble, color: 'text-rose-600', bg: 'bg-rose-100' },
  { name: 'Spotify Premium', date: '5 Jan, 2025', amount: '$10.99', icon: Music, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { name: 'Airbnb', date: '7 Jan, 2025', amount: '$220.00', icon: Home, color: 'text-rose-500', bg: 'bg-rose-100' },
];

const recentTransactions = [
  { name: 'AWS Cloud Services', date: 'Today, 2:45 PM', amount: '-$45.00', status: 'Completed' },
  { name: 'Salary Deposit', date: 'Yesterday, 9:00 AM', amount: '+$6,514.00', status: 'Completed' },
  { name: 'Uber Rides', date: '11 Feb, 8:30 PM', amount: '-$24.50', status: 'Pending' },
  { name: 'Whole Foods Market', date: '10 Feb, 1:15 PM', amount: '-$145.20', status: 'Completed' },
  { name: 'Netflix Subscription', date: '08 Feb, 10:00 AM', amount: '-$15.99', status: 'Completed' },
];

const CustomBalanceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#121213] text-slate-800 dark:text-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 dark:border-white/10 text-sm font-bold">
         <span className="text-xs text-slate-400 block mb-1 font-medium">{label}</span>
         ${payload[0].value.toFixed(2)}
      </div>
    );
  }
  return null;
};

const GaugeChart = ({ total }: { total: number }) => {
  return (
    <div className="relative w-full text-center overflow-hidden flex flex-col items-center justify-center -mt-6">
      <svg viewBox="0 0 200 120" className="w-[85%] drop-shadow-lg mx-auto">
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth="24" strokeLinecap="round" className="dark:stroke-white/5" />
        <motion.path 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 0.65 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gradient)" strokeWidth="24" strokeLinecap="round" strokeDasharray="251.2"
        />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#ffffff" strokeWidth="26" strokeDasharray="2 4" className="dark:stroke-black opacity-30 pointer-events-none" />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 flex flex-col items-center">
         <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">${total.toLocaleString('en-US', {minimumFractionDigits: 2})}</h1>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [cashFlowTab, setCashFlowTab] = useState('Income');
  const [dateRange, setDateRange] = useState('This Month');

  const getCashFlowData = () => {
    switch(cashFlowTab) {
      case 'Income': return cashFlowIncome;
      case 'Expenses': return cashFlowExpenses;
      case 'Savings': return cashFlowSavings;
      default: return cashFlowIncome;
    }
  };

  const getCashFlowTotal = () => {
    if (cashFlowTab === 'Income') return "$4,821.50";
    if (cashFlowTab === 'Expenses') return "$2,150.00";
    if (cashFlowTab === 'Savings') return "$1,945.00";
  };



  return (
    <div className="w-full flex flex-col gap-6 selection:bg-indigo-500/30 pb-20">
        
      {/* HEADER & TITLE SECTION COMBINED */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-1">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm font-medium">All your key financial data in one place</p>
         </div>

         <div className="flex flex-wrap items-center justify-end gap-3 md:gap-4 shrink-0">
            {/* Inline: Date Range Selector */}
            <div className="relative flex items-center group shrink-0">
              <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-indigo-600 transition-colors z-10" />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-9 py-2.5 bg-white dark:bg-[#1A1A1D] border border-slate-200 dark:border-white/10 rounded-full text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7 Feb - 2 Mar" disabled hidden>7 Feb - 2 Mar</option>
                <DateOptions />
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-indigo-600 transition-colors z-10" />
            </div>

            {/* Inline: Profile & Alerts */}
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/enhanced/alerts" className="w-10 h-10 bg-white dark:bg-[#1A1A1D] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors shadow-sm relative group">
                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              </Link>
              <button className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-200 dark:border-white/10 hover:scale-105 transition-transform">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9" alt="User Avatar" className="w-full h-full object-cover bg-slate-100" />
              </button>
            </div>
         </div>
      </div>

      {/* 3. MAIN GRID (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ========================================================= */}
        {/* COLUMN 1: Total Balance & Cash Flow                        */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Card: Total Balance */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white dark:bg-[#121213] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/5 h-[380px] flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start z-10 w-full mb-4">
               <div>
                 <p className="text-slate-500 text-sm font-bold mb-1">Total Balance</p>
                 <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">$6,514.<span className="text-slate-400">00</span></h2>
               </div>
               <div className="relative flex shadow-sm max-w-[120px]">
                 <select defaultValue="This Month" className="appearance-none pl-3 pr-6 w-full py-1.5 bg-slate-50 dark:bg-[#1A1A1D] truncate rounded-full text-slate-500 text-xs font-bold border border-slate-100 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                   <DateOptions />
                 </select>
                 <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-slate-400 bg-slate-50 dark:bg-[#1A1A1D]" />
               </div>
            </div>

            <div className="absolute right-24 top-24 z-20 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-white/10 px-3 py-1.5 rounded-[12px] flex flex-col items-center gap-0.5">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">7 Feb</span>
                 <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-none">$256.00</span>
               </div>
               <div className="w-[1px] h-10 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-600 mt-1" />
               <div className="w-3 h-3 rounded-full bg-indigo-500 border-[3px] border-white dark:border-slate-900 shadow-md ring-2 ring-indigo-500/20" />
            </div>

            <div className="h-[220px] w-full -mx-4 -mb-8 relative z-0 mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                  <RechartsTooltip cursor={false} content={<CustomBalanceTooltip />} />
                  <Line type="natural" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* CASH FLOW CARD (Removed overflow-hidden to let tooltip live) */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white dark:bg-[#121213] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/5 h-[380px] flex flex-col relative">
             <div className="flex justify-between items-start mb-6 w-full">
               <div>
                 <p className="text-slate-500 text-sm font-bold mb-1">Cash Flow</p>
                 <AnimatePresence mode="wait">
                    <motion.h2 
                      key={cashFlowTab}
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                    >
                      {getCashFlowTotal()}
                    </motion.h2>
                 </AnimatePresence>
               </div>
               <div className="relative flex shadow-sm max-w-[120px] z-20 shrink-0">
                 <select defaultValue="This Month" className="appearance-none w-full pl-3 pr-6 py-1.5 bg-slate-50 dark:bg-[#1A1A1D] rounded-full text-slate-500 text-xs font-bold border border-slate-100 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer truncate">
                   <DateOptions />
                 </select>
                 <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-slate-400 bg-slate-50 dark:bg-[#1A1A1D]" />
               </div>
             </div>

             <div className="flex items-center justify-end w-full mb-6 relative z-10">
               <div className="flex gap-1 bg-white dark:bg-[#1A1A1D] border border-slate-100 dark:border-white/10 p-1 rounded-full shadow-sm relative z-20">
                 {['Income', 'Expenses', 'Savings'].map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setCashFlowTab(tab)}
                     className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${cashFlowTab === tab ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                   >
                     {tab}
                   </button>
                 ))}
               </div>
             </div>

             <div className="h-[170px] w-full mt-auto relative z-0 pl-1">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={getCashFlowData()} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                   <RechartsTooltip cursor={{ fill: 'transparent' }} content={<CustomBalanceTooltip />} />
                   <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={22}>
                     {getCashFlowData().map((entry, index) => (
                       <Cell 
                         key={`cell-${index}`} 
                         fill={entry.isPeak ? "url(#colorGradientBar)" : "#f1f5f9"} 
                         className={!entry.isPeak ? "dark:fill-[#1e293b]" : ""} 
                       />
                     ))}
                   </Bar>
                   <defs>
                      <linearGradient id="colorGradientBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0.8}/>
                      </linearGradient>
                   </defs>
                 </BarChart>
               </ResponsiveContainer>

               <div className="absolute right-[15%] top-0 -translate-y-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1.5 rounded-full shadow-md z-10 hidden sm:block pointer-events-none">
                 Avg $3.9k
               </div>
             </div>
          </motion.div>
        </div>


        {/* ========================================================= */}
        {/* COLUMN 2: Spending Overview & AI Insights                  */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white dark:bg-[#121213] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/5 h-[380px] flex flex-col items-center text-center">
            <div className="flex justify-between items-start w-full mb-8">
               <p className="text-slate-500 text-sm font-bold">Spending Overview</p>
               <div className="relative flex shadow-sm max-w-[120px]">
                 <select defaultValue="Feb" className="appearance-none w-full pl-3 pr-6 py-1.5 bg-slate-50 dark:bg-[#1A1A1D] rounded-full text-slate-500 text-xs font-bold border border-slate-100 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer truncate">
                   <DateOptions />
                 </select>
                 <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-slate-400 bg-slate-50 dark:bg-[#1A1A1D]" />
               </div>
            </div>

            <div className="mt-4 w-full flex justify-center">
               <GaugeChart total={1284.50} />
            </div>

            <div className="w-full flex justify-between items-end mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="text-left flex-1 border-r border-slate-100 dark:border-white/5">
                <p className="text-[11px] text-slate-400 font-bold mb-1">Shopping</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white border-l-2 border-[#8b5cf6] pl-2">$620.00</p>
              </div>
              <div className="text-left flex-1 px-3 border-r border-slate-100 dark:border-white/5">
                <p className="text-[11px] text-slate-400 font-bold mb-1">Essentials</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white border-l-2 border-[#c4b5fd] pl-2">$410.00</p>
              </div>
              <div className="text-left flex-1 pl-3">
                <p className="text-[11px] text-slate-400 font-bold mb-1">Others</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white border-l-2 border-slate-200 dark:border-slate-700 pl-2">$254.50</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white dark:bg-[#121213] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/5 h-[380px] flex flex-col relative overflow-hidden group hover:shadow-lg transition-shadow">
            
            <div className="flex justify-between items-start w-full mb-6 relative z-20">
               <p className="text-slate-500 text-sm font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-500" /> Ai Insights</p>
               <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase tracking-wider font-extrabold rounded-[8px] border border-indigo-100 dark:border-indigo-500/20 shadow-sm shadow-indigo-500/10">New</span>
            </div>

            <div className="mt-4 relative z-20">
              <h2 className="text-[32px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-2">$390 <span className="text-[18px] text-slate-400 font-semibold tracking-normal">saved</span></h2>
              <p className="text-[12px] text-slate-500 font-medium leading-[1.3] max-w-[150px]">with native AI-recommended cash placements and intelligent routing.</p>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-[220px] pointer-events-none flex items-end justify-center overflow-hidden z-0">
                <div className="w-[340px] h-[170px] border-[16px] border-indigo-50/80 dark:border-indigo-500/10 rounded-t-full border-b-0 absolute bottom-0 flex items-end justify-center translate-y-4">
                   <div className="w-[200px] h-[100px] border-[16px] border-indigo-100/80 dark:border-indigo-500/20 rounded-t-full border-b-0 absolute bottom-0 flex items-end justify-center">
                     <div className="w-[80px] h-[40px] bg-indigo-200/60 dark:bg-indigo-500/30 rounded-t-full absolute bottom-0 blur-[2px]" />
                   </div>
                </div>
                
                <div className="absolute top-10 left-10 w-2 h-2 bg-indigo-200 dark:bg-indigo-400/50 rounded-full" />
                <div className="absolute top-4 right-16 w-1 h-1 bg-indigo-300 dark:bg-indigo-300/50 rounded-full" />
                <div className="absolute top-24 right-8 w-1.5 h-1.5 bg-indigo-200 dark:bg-indigo-500/50 rounded-full" />
            </div>
          </motion.div>
        </div>


        {/* ========================================================= */}
        {/* COLUMN 3: Upcoming Bills & Recent Transactions              */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-white dark:bg-[#121213] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/5 h-[380px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <p className="text-slate-500 text-sm font-bold">Upcoming Bills</p>
               <Link to="/enhanced/transactions" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                 See all <ArrowRight className="w-3 h-3" />
               </Link>
            </div>

            <div className="flex flex-col gap-5 flex-1 mt-2">
               {upcomingBills.map((bill, index) => {
                 const Icon = bill.icon;
                 return (
                   <div key={index} className="flex items-center justify-between group cursor-pointer border-b border-slate-50 dark:border-white/5 pb-4 py-1 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 px-2 -mx-2 rounded-xl transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl ${bill.bg} dark:bg-white/5 flex items-center justify-center shrink-0 shadow-sm border border-white/50 dark:border-white/5 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${bill.color}`} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[13px] text-slate-900 dark:text-white leading-tight mb-0.5">{bill.name}</h4>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{bill.date}</p>
                        </div>
                     </div>
                     <span className="font-extrabold text-[14px] text-slate-900 dark:text-white">{bill.amount}</span>
                   </div>
                 );
               })}
            </div>
          </motion.div>

          {/* RECENT TRANSACTIONS CARD */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="bg-white dark:bg-[#121213] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/5 h-[380px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 z-10 shrink-0">
               <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
                 <Activity className="w-4 h-4 text-emerald-500" /> Recent Transactions
               </p>
               <Link to="/enhanced/transactions" className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                 View all <ArrowRight className="w-3 h-3" />
               </Link>
            </div>

            <div className="flex flex-col gap-4 flex-1 overflow-y-auto mb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden z-10">
               {recentTransactions.map((tx, index) => (
                 <div key={index} className="flex items-center justify-between group cursor-pointer border-b border-slate-100 dark:border-white/5 pb-4 py-2 last:border-0 px-2 -mx-2 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                   <div>
                     <h4 className="font-extrabold text-[13px] text-slate-900 dark:text-white truncate max-w-[150px]">{tx.name}</h4>
                     <p className="text-[10px] font-medium text-slate-400 mt-1">{tx.date}</p>
                   </div>
                   <div className="text-right flex flex-col items-end">
                     <span className={`font-extrabold text-[13px] ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>{tx.amount}</span>
                     <span className={`text-[9px] font-bold mt-1 px-2 py-0.5 rounded-full ${tx.status === 'Completed' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-500'}`}>{tx.status}</span>
                   </div>
                 </div>
               ))}
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-[#121213] to-transparent pointer-events-none z-20" />
          </motion.div>

        </div>

      </div>
    </div>
  );
}
