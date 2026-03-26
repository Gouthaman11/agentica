import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, Bell, Calendar, Download, ChevronDown, ArrowRight, Sparkles, Activity, 
  Gamepad2, Dribbble, Music, Home, Sun, Moon
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, CartesianGrid
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
  { name: 'Twitch', date: '4 Jan, 2025', amount: '₹9.99', icon: Gamepad2, color: 'text-[#5E8F8E]', bg: 'bg-[#E4F1F0]' },
  { name: 'Dribbble Pro', date: '5 Jan, 2025', amount: '₹15.00', icon: Dribbble, color: 'text-rose-600', bg: 'bg-rose-100' },
  { name: 'Spotify Premium', date: '5 Jan, 2025', amount: '₹10.99', icon: Music, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { name: 'Airbnb', date: '7 Jan, 2025', amount: '₹220.00', icon: Home, color: 'text-rose-500', bg: 'bg-rose-100' },
];

const recentTransactions = [
  { name: 'AWS Cloud Services', date: 'Today, 2:45 PM', amount: '-₹45.00', status: 'Completed' },
  { name: 'Salary Deposit', date: 'Yesterday, 9:00 AM', amount: '+₹6,514.00', status: 'Completed' },
  { name: 'Uber Rides', date: '11 Feb, 8:30 PM', amount: '-₹24.50', status: 'Pending' },
  { name: 'Whole Foods Market', date: '10 Feb, 1:15 PM', amount: '-₹145.20', status: 'Completed' },
  { name: 'Netflix Subscription', date: '08 Feb, 10:00 AM', amount: '-₹15.99', status: 'Completed' },
];

const CustomBalanceTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#17191E] text-slate-800 dark:text-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 dark:border-white/10 text-sm font-bold">
         <span className="text-xs text-slate-400 block mb-1 font-medium">{label}</span>
         {localStorage.getItem('user_currency') || '₹'}{payload[0].value.toFixed(2)}
      </div>
    );
  }
  return null;
};

const CustomCashFlowTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#17191E] text-slate-800 dark:text-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 dark:border-white/10 text-sm font-bold">
        <span className="text-xs text-slate-400 block mb-1 font-medium">{label}</span>
        {localStorage.getItem('user_currency') || '₹'}{Number(payload[0].value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            <stop offset="0%" stopColor="#A6C7C7" />
            <stop offset="100%" stopColor="#6E9F9D" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 flex flex-col items-center">
         <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{localStorage.getItem('user_currency') || '₹'}{total.toLocaleString('en-US', {minimumFractionDigits: 2})}</h1>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [cashFlowTab, setCashFlowTab] = useState('Income');
  const [dateRange, setDateRange] = useState('This Month');
  const userName = localStorage.getItem('user_name') || 'Deepan S.';
  const currencySymbol = localStorage.getItem('user_currency') || '₹';

  const getCashFlowData = () => {
    switch(cashFlowTab) {
      case 'Income': return cashFlowIncome;
      case 'Expenses': return cashFlowExpenses;
      case 'Savings': return cashFlowSavings;
      default: return cashFlowIncome;
    }
  };

  const getCashFlowTotal = () => {
    const symbol = localStorage.getItem('user_currency') || '₹';
    if (cashFlowTab === 'Income') return `${symbol}4,821.50`;
    if (cashFlowTab === 'Expenses') return `${symbol}2,150.00`;
    if (cashFlowTab === 'Savings') return `${symbol}1,945.00`;
  };



  return (
    <div className="w-full flex flex-col gap-6 selection:bg-[#D8EC63]/30 pb-20">
        
      {/* HEADER & TITLE SECTION COMBINED */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-1">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm font-medium">All your key financial data in one place</p>
         </div>

         <div className="flex flex-wrap items-center justify-end gap-3 md:gap-4 shrink-0">
            {/* Inline: Date Range Selector */}
            <div className="relative flex items-center group shrink-0">
              <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-black transition-colors z-10" />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-9 py-2.5 bg-white dark:bg-[#21242B] border border-slate-200 dark:border-white/10 rounded-full text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer appearance-none outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="7 Feb - 2 Mar" disabled hidden>7 Feb - 2 Mar</option>
                <DateOptions />
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-black transition-colors z-10" />
            </div>

            {/* Inline: Profile & Alerts */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => {
                  const isDark = document.documentElement.classList.contains('dark');
                  if (isDark) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                  } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                  }
                }}
                className="w-10 h-10 bg-white dark:bg-[#21242B] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-black transition-all shadow-sm"
              >
                <Sun className="w-4 h-4 dark:hidden" />
                <Moon className="w-4 h-4 hidden dark:block text-teal-400" />
              </button>

              <Link to="/enhanced/alerts" className="w-10 h-10 bg-white dark:bg-[#21242B] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-black transition-colors shadow-sm relative group">
                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              </Link>
              <div className="relative group flex items-center">
                <div className="absolute right-full mr-2 pointer-events-none overflow-hidden h-full flex items-center">
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="bg-white/90 dark:bg-[#17191E]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 translate-x-4 whitespace-nowrap"
                  >
                    <p className="text-[13px] font-black text-slate-900 dark:text-white leading-none tracking-tight">{userName}</p>
                    <p className="text-[9px] text-teal-500 font-black mt-0.5 uppercase tracking-widest leading-none">Settings</p>
                  </motion.div>
                </div>
                <Link to="/enhanced/settings" className="w-12 h-12 rounded-full overflow-hidden bg-white/80 dark:bg-[#17191E]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] transition-all duration-700 relative z-10 hover:border-teal-500/50">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-inner grow-0 shrink-0 relative z-10 border border-slate-100 dark:border-white/5 group-hover:rotate-[360deg] transition-transform duration-700">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}&backgroundColor=f1f5f9`} alt="User Avatar" className="w-full h-full object-cover bg-slate-100" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </Link>
              </div>
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-[#D2EAE8] dark:bg-[#1C1C1E] p-6 rounded-[24px] shadow-sm border border-slate-200/50 dark:border-white/5 h-[380px] flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start z-10 w-full mb-4">
               <div>
                 <p className="text-[#5b7a7a] dark:text-slate-400 text-sm font-bold mb-1">Total Balance</p>
                  <h2 className="text-3xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tight">{currencySymbol}6,514.<span className="opacity-50">00</span></h2>
                </div>
               <div className="relative flex shadow-sm max-w-[120px]">
                 <select defaultValue="This Month" className="appearance-none pl-3 pr-6 w-full py-1.5 bg-white/50 dark:bg-white/5 truncate rounded-full text-[#5b7a7a] dark:text-slate-400 text-xs font-bold border border-slate-200/30 dark:border-white/10 outline-none cursor-pointer">
                   <DateOptions />
                 </select>
                 <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-[#5b7a7a]" />
               </div>
            </div>

            <div className="h-[220px] w-full -mx-4 -mb-8 relative z-0 mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" opacity={0.05} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#5b7a7a', fontWeight: 600 }} dy={10} />
                  <RechartsTooltip cursor={false} content={<CustomBalanceTooltip />} />
                  <Line type="natural" dataKey="value" stroke="#1a1a1a" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#1a1a1a', stroke: '#fff', strokeWidth: 3 }} isAnimationActive animationDuration={1100} animationEasing="ease-out" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Card: Cash Flow */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white dark:bg-[#17191E] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/10 h-[380px] flex flex-col relative overflow-hidden">
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
                 <select defaultValue="This Month" className="appearance-none w-full pl-3 pr-6 py-1.5 bg-slate-50 dark:bg-[#21242B] rounded-full text-slate-500 text-xs font-bold border border-slate-100 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer truncate">
                   <DateOptions />
                 </select>
                 <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-slate-400 bg-slate-50 dark:bg-[#21242B]" />
               </div>
             </div>

             <div className="flex items-center justify-end w-full mb-6 relative z-10">
               <div className="flex gap-1 bg-white dark:bg-[#21242B] border border-slate-100 dark:border-white/10 p-1 rounded-full shadow-sm relative z-20">
                 {['Income', 'Expenses', 'Savings'].map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setCashFlowTab(tab)}
                     className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${cashFlowTab === tab ? 'bg-black text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                   >
                     {tab}
                   </button>
                 ))}
               </div>
             </div>

             <div className="h-[170px] w-full mt-auto relative z-0 pl-1">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={getCashFlowData()} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" opacity={0.08} />
                   <XAxis
                     dataKey="month"
                     axisLine={false}
                     tickLine={false}
                     tick={{ fontSize: 10, fill: '#1a1a1a', fontWeight: 600 }}
                     dy={10}
                   />
                   <RechartsTooltip cursor={false} content={<CustomCashFlowTooltip />} />
                   <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={22} isAnimationActive animationDuration={1000} animationEasing="ease-out">
                     {getCashFlowData().map((entry, index) => (
                       <Cell 
                         key={`cell-${index}`} 
                         fill={entry.isPeak ? "#ccff00" : "#F5F8F8"} 
                         className={!entry.isPeak ? "dark:fill-[#1e293b]" : "dark:fill-[#ccff00]"} 
                       />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </motion.div>
        </div>


        {/* ========================================================= */}
        {/* COLUMN 2: Spending Overview & AI Insights                  */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white dark:bg-[#17191E] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/10 h-[380px] flex flex-col items-center text-center">
            <div className="flex justify-between items-start w-full mb-8">
               <p className="text-slate-500 text-sm font-bold">Spending Overview</p>
               <div className="relative flex shadow-sm max-w-[120px]">
                 <select defaultValue="Feb" className="appearance-none w-full pl-3 pr-6 py-1.5 bg-slate-50 dark:bg-[#21242B] rounded-full text-slate-500 text-xs font-bold border border-slate-100 dark:border-white/10 outline-none cursor-pointer truncate">
                   <DateOptions />
                 </select>
                 <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-slate-400 bg-slate-50 dark:bg-[#21242B]" />
               </div>
            </div>

            <div className="mt-4 w-full flex justify-center">
               <GaugeChart total={1284.50} />
            </div>

            <div className="w-full flex justify-between items-end mt-auto pt-4 border-t border-slate-100 dark:border-white/10">
                  <div className="text-left flex-1 border-r border-slate-100 dark:border-white/10">
                    <p className="text-[11px] text-slate-400 font-bold mb-1">Shopping</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white border-l-2 border-[#ccff00] pl-2">{currencySymbol}620.00</p>
                  </div>
                  <div className="text-left flex-1 px-3 border-r border-slate-100 dark:border-white/10">
                    <p className="text-[11px] text-slate-400 font-bold mb-1">Essentials</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white border-l-2 border-[#D2EAE8] pl-2">{currencySymbol}410.00</p>
                  </div>
                  <div className="text-left flex-1 pl-3">
                    <p className="text-[11px] text-slate-400 font-bold mb-1">Others</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white border-l-2 border-slate-200 dark:border-slate-700 pl-2">{currencySymbol}254.50</p>
                  </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white dark:bg-[#17191E] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/10 h-[380px] flex flex-col relative overflow-hidden group">
            <div className="absolute -bottom-[220px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full border-[26px] border-[#ccff00]/12 pointer-events-none" />
            <div className="absolute -bottom-[170px] left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full border-[20px] border-[#ccff00]/18 pointer-events-none" />
            <div className="absolute -bottom-[110px] left-1/2 -translate-x-1/2 w-[250px] h-[250px] rounded-full border-[14px] border-[#ccff00]/24 pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-2.5 h-2.5 rounded-full bg-[#ccff00]/35 pointer-events-none" />
            <div className="absolute top-1/2 right-16 w-2 h-2 rounded-full bg-[#ccff00]/30 pointer-events-none" />
            
            <div className="flex justify-between items-start w-full mb-6 relative z-20">
               <p className="text-slate-700 dark:text-white/70 text-sm font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#ccff00]" /> Ai Insights</p>
               <span className="px-3 py-1 bg-[#ccff00] text-black text-[10px] uppercase tracking-wider font-extrabold rounded-[8px] border border-[#ccff00]/20 shadow-sm shadow-[#ccff00]/10">New</span>
            </div>

            <div className="mt-4 relative z-20">
              <h2 className="text-[32px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mb-2">{currencySymbol}390 <span className="text-[18px] text-slate-500 dark:text-white/50 font-semibold tracking-normal">saved</span></h2>
              <p className="text-[12px] text-slate-600 dark:text-white/60 font-medium leading-[1.3] max-w-[150px]">with native AI-recommended cash placements and intelligent routing.</p>
            </div>
          </motion.div>
        </div>


        {/* ========================================================= */}
        {/* COLUMN 3: Upcoming Bills & Recent Transactions              */}
        {/* ========================================================= */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-white dark:bg-[#17191E] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/10 h-[380px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <p className="text-slate-500 text-sm font-bold">Upcoming Bills</p>
               <Link to="/enhanced/transactions" className="text-[11px] font-bold text-slate-400 hover:text-black transition-colors flex items-center gap-1">
                 See all <ArrowRight className="w-3 h-3" />
               </Link>
            </div>

            <div className="flex flex-col gap-5 flex-1 mt-2">
               {upcomingBills.map((bill, index) => {
                 const Icon = bill.icon;
                 return (
                   <div key={index} className="flex items-center justify-between group cursor-pointer border-b border-slate-50 dark:border-white/10 pb-4 py-1 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 px-2 -mx-2 rounded-xl transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl ${bill.bg} dark:bg-white/5 flex items-center justify-center shrink-0 shadow-sm border border-white/50 dark:border-white/10 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${bill.color}`} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[13px] text-slate-900 dark:text-white leading-tight mb-0.5">{bill.name}</h4>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{bill.date}</p>
                        </div>
                     </div>
                     <span className="font-extrabold text-[14px] text-slate-900 dark:text-white">{bill.amount.replace('₹', currencySymbol).replace('$', currencySymbol)}</span>
                   </div>
                 );
               })}
            </div>
          </motion.div>

          {/* RECENT TRANSACTIONS CARD */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="bg-white dark:bg-[#17191E] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/10 h-[380px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 z-10 shrink-0">
               <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
                 <Activity className="w-4 h-4 text-emerald-500" /> Recent Transactions
               </p>
               <Link to="/enhanced/transactions" className="text-[11px] font-bold text-slate-400 hover:text-black transition-colors flex items-center gap-1">
                 View all <ArrowRight className="w-3 h-3" />
               </Link>
            </div>

            <div className="flex flex-col gap-4 flex-1 overflow-y-auto mb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden z-10">
               {recentTransactions.map((tx, index) => (
                 <div key={index} className="flex items-center justify-between group cursor-pointer border-b border-slate-100 dark:border-white/10 pb-4 py-2 last:border-0 px-2 -mx-2 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                   <div>
                     <h4 className="font-extrabold text-[13px] text-slate-900 dark:text-white truncate max-w-[150px]">{tx.name}</h4>
                     <p className="text-[10px] font-medium text-slate-400 mt-1">{tx.date}</p>
                   </div>
                   <div className="text-right flex flex-col items-end">
                     <span className={`font-extrabold text-[13px] ${tx.amount.includes('+') ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>{tx.amount.replace('₹', currencySymbol).replace('$', currencySymbol)}</span>
                     <span className={`text-[9px] font-bold mt-1 px-2 py-0.5 rounded-full ${tx.status === 'Completed' ? 'bg-[#EDF6F5] dark:bg-[#6E9F9D]/20 text-[#5E8F8E]' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-500'}`}>{tx.status}</span>
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

