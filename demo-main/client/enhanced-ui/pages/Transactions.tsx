import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Search, Filter, ArrowUpRight, ArrowDownRight, 
  X, Calendar, FileText, ChevronRight, Activity, TrendingUp, TrendingDown,
  BrainCircuit, CreditCard, ChevronDown, CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  category: string;
  type: 'Credited' | 'Debited';
  amount: number;
  balance: number;
  sourceFile: string;
  uploadDate: string;
  aiConfidence: number;
  group: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  // Today
  { id: '1', date: '2026-03-23', time: '14:30', description: 'Stripe Payout', category: 'Income', type: 'Credited', amount: 32000, balance: 85000, sourceFile: 'March_Settlements.csv', uploadDate: '2026-03-23', aiConfidence: 98, group: 'Today' },
  // Last 7 Days / This Week
  { id: '2', date: '2026-03-22', time: '09:15', description: 'AWS Services Base', category: 'Software Subs', type: 'Debited', amount: 4500, balance: 53000, sourceFile: 'Q1_Invoices.pdf', uploadDate: '2026-03-22', aiConfidence: 95, group: 'This Week' },
  { id: '3', date: '2026-03-20', time: '11:45', description: 'Swiggy Corporate Lunch', category: 'Food & Dining', type: 'Debited', amount: 1250, balance: 57500, sourceFile: 'Bank_Statement_Mar.pdf', uploadDate: '2026-03-21', aiConfidence: 89, group: 'This Week' },
  { id: '4', date: '2026-03-18', time: '16:20', description: 'WeWork Office Space', category: 'Rent & Utilities', type: 'Debited', amount: 15000, balance: 58750, sourceFile: 'Bank_Statement_Mar.pdf', uploadDate: '2026-03-21', aiConfidence: 99, group: 'This Week' },
  // This Month
  { id: '5', date: '2026-03-15', time: '10:00', description: 'Client Invoice #42', category: 'Income', type: 'Credited', amount: 45000, balance: 73750, sourceFile: 'Inbound_Wire.pdf', uploadDate: '2026-03-16', aiConfidence: 92, group: 'Earlier This Month' },
  { id: '6', date: '2026-03-10', time: '08:30', description: 'Github Copilot Yearly', category: 'Software Subs', type: 'Debited', amount: 8500, balance: 28750, sourceFile: 'Q1_Invoices.pdf', uploadDate: '2026-03-22', aiConfidence: 94, group: 'Earlier This Month' },
  { id: '7', date: '2026-03-05', time: '19:45', description: 'Zomato Team Dinner', category: 'Food & Dining', type: 'Debited', amount: 3400, balance: 37250, sourceFile: 'Bank_Statement_Mar.pdf', uploadDate: '2026-03-21', aiConfidence: 87, group: 'Earlier This Month' },
  // Last Month
  { id: '8', date: '2026-02-24', time: '12:00', description: 'Google Workspace', category: 'Software Subs', type: 'Debited', amount: 1200, balance: 40650, sourceFile: 'Feb_Invoices.pdf', uploadDate: '2026-03-01', aiConfidence: 99, group: 'Last Month' },
  { id: '9', date: '2026-02-14', time: '14:00', description: 'Freelance Design Retainer', category: 'Income', type: 'Credited', amount: 20000, balance: 60650, sourceFile: 'Inbound_Wire.pdf', uploadDate: '2026-02-15', aiConfidence: 95, group: 'Last Month' },
];

const miniChartData = [
  { day: '15', spend: 4000 }, { day: '16', spend: 3000 }, { day: '17', spend: 2000 },
  { day: '18', spend: 15000 }, { day: '19', spend: 1000 }, { day: '20', spend: 1250 }, 
  { day: '21', spend: 500 }, { day: '22', spend: 4500 }, { day: '23', spend: 0 }
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Advanced Filter States
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const [activeType, setActiveType] = useState('All');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  // Dynamic Filtering Logic mapped tightly to actual component data properties
  const filteredNav = useMemo(() => {
    let list = MOCK_TRANSACTIONS;
    
    // Core functional Date Range checks
    if (dateFilter === 'Today') {
      list = list.filter(t => t.date === '2026-03-23');
    } else if (dateFilter === 'Last 7 Days' || dateFilter === 'This Week') {
      list = list.filter(t => t.date >= '2026-03-16' && t.date <= '2026-03-23');
    } else if (dateFilter === 'This Month') {
      list = list.filter(t => t.date >= '2026-03-01' && t.date <= '2026-03-31');
    } else if (dateFilter === 'Last Month') {
      list = list.filter(t => t.date >= '2026-02-01' && t.date <= '2026-02-28');
    } else if (dateFilter === 'Custom Range') {
      // Precise boundaries enforcing user inputs directly mapping date fields
      if (customStartDate) list = list.filter(t => t.date >= customStartDate);
      if (customEndDate) list = list.filter(t => t.date <= customEndDate);
    }

    // Direct Category dropdown match
    if (activeCategory !== 'All') {
      list = list.filter(t => t.category === activeCategory);
    }

    // Direct Type dropdown match ('Type' holds values like 'Credited' | 'Debited')
    if (activeType !== 'All') {
      list = list.filter(t => t.type === activeType);
    }

    // Text Search over description/amount
    if (searchTerm.trim() !== '') {
       list = list.filter(t => 
         t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.amount.toString().includes(searchTerm)
       );
    }
    return list;
  }, [searchTerm, dateFilter, customStartDate, customEndDate, activeCategory, activeType]);

  const summary = useMemo(() => {
    const credits = filteredNav.filter(t => t.type === 'Credited').reduce((acc, curr) => acc + curr.amount, 0);
    const debits = filteredNav.filter(t => t.type === 'Debited').reduce((acc, curr) => acc + curr.amount, 0);
    return { credits, debits, net: credits - debits };
  }, [filteredNav]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredNav.forEach(t => {
      // Assign custom range dynamic group title if not matching predefined group sets.
      let groupName = t.group;
      if (dateFilter === 'Custom Range') {
         // Create dynamic group headers for custom chronological limits.
         const dateObj = new Date(t.date);
         groupName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }

      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(t);
    });
    return groups;
  }, [filteredNav, dateFilter]);

  return (
    <div className="space-y-6 pb-12 relative overflow-hidden">
      
      {/* Side Panel Modal */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-white/10 z-50 overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-500" /> Transaction Details
                </h2>
                <button onClick={() => setSelectedTx(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Header Amount */}
                <div className="text-center pb-6 border-b border-slate-100 dark:border-white/5">
                  <div className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${selectedTx.type === 'Credited' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                     {selectedTx.type === 'Credited' ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
                  </div>
                  <h3 className={`text-4xl font-bold tracking-tight ${selectedTx.type === 'Credited' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {selectedTx.type === 'Credited' ? '+' : '-'}₹{selectedTx.amount.toLocaleString()}
                  </h3>
                  <p className="text-slate-500 mt-2 font-medium">{selectedTx.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Date & Time</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedTx.date} • {selectedTx.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      selectedTx.type === 'Credited' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}>
                      {selectedTx.type === 'Credited' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {selectedTx.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Category (CoA)</p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 inline-flex px-2 py-1 rounded-md">{selectedTx.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Balance After</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">₹{selectedTx.balance.toLocaleString()}</p>
                  </div>
                </div>

                {/* AI & Source Info */}
                <div className="p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-5 h-5 text-indigo-500" />
                    <h4 className="font-bold text-slate-900 dark:text-white">AI Extraction Data</h4>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Source File</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{selectedTx.sourceFile}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Upload Date</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{selectedTx.uploadDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-indigo-100 dark:border-indigo-500/20">
                    <span className="text-slate-500">Extraction Confidence</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> {selectedTx.aiConfidence}%
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition">Re-categorize</button>
                  <button className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Receipt</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Enterprise-grade transaction tracking, filtering, and flow analysis.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold items-center gap-2 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700">
            Export View
          </button>
          <button className="flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      {/* Mini Visual Insights & Summary Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary Strip */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-6 p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm">
           <div>
             <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
               <TrendingUp className="w-4 h-4 text-emerald-500" /> Total Credits
             </p>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">₹{summary.credits.toLocaleString()}</h2>
           </div>
           <div className="border-l border-slate-200 dark:border-white/10 pl-6">
             <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
               <TrendingDown className="w-4 h-4 text-rose-500" /> Total Debits
             </p>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white">₹{summary.debits.toLocaleString()}</h2>
           </div>
           <div className="border-l border-slate-200 dark:border-white/10 pl-6">
             <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
               <Activity className="w-4 h-4 text-indigo-500" /> Net Flow
             </p>
             <h2 className={`text-2xl font-bold ${summary.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
               {summary.net >= 0 ? '+' : ''}₹{summary.net.toLocaleString()}
             </h2>
           </div>
        </div>
        
        {/* Mini Analytics */}
        <div className="lg:col-span-1 p-5 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-xl border border-indigo-500/20 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-center mb-2">
             <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase">Daily Spend Trend</p>
             <p className="text-xs font-bold text-slate-500">Mar 15-23</p>
           </div>
           <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={miniChartData}>
                <Bar dataKey="spend" radius={[2, 2, 0, 0]}>
                  {miniChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.spend > 10000 ? '#f43f5e' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
           <p className="text-[10px] text-slate-500 mt-2 font-medium">Highest tx: ₹15k (WeWork)</p>
        </div>
      </div>

      {/* Date Filter System (Segmented Buttons) */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Today', 'Last 7 Days', 'This Week', 'This Month', 'Last Month', 'Custom Range'].map(filter => (
            <button 
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-sm ${
                dateFilter === filter 
                  ? 'bg-indigo-600 text-white shadow-indigo-500/30' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {filter} {filter === 'Custom Range' && <Calendar className="w-3.5 h-3.5 inline ml-1 mb-0.5" />}
            </button>
          ))}
        </div>

        {/* Dynamic Native Custom Range Inputs Display */}
        {dateFilter === 'Custom Range' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 items-center bg-indigo-50/50 dark:bg-indigo-500/10 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm w-fit">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">From Date:</span>
              <input 
                 type="date" 
                 value={customStartDate} 
                 onChange={e => setCustomStartDate(e.target.value)} 
                 className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm custom-calendar-icon" 
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">To Date:</span>
              <input 
                 type="date" 
                 value={customEndDate} 
                 onChange={e => setCustomEndDate(e.target.value)} 
                 className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm custom-calendar-icon" 
              />
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm overflow-visible"
      >
        {/* Smart Search + Real Active Interactive Dropdown Filters */}
        <div className="p-4 border-b border-slate-200/50 dark:border-white/5 flex flex-wrap gap-4 bg-slate-50/50 dark:bg-white/[0.02] relative z-20">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by merchant, category, or amount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow shadow-sm"
            />
          </div>
          
          <div className="relative">
            <button onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowTypeDropdown(false); }} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
              Category: <span className="text-indigo-600 dark:text-indigo-400">{activeCategory}</span> <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                {['All', 'Income', 'Software Subs', 'Food & Dining', 'Rent & Utilities'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => { setActiveCategory(c); setShowCategoryDropdown(false); }} 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${activeCategory === c ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowCategoryDropdown(false); }} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
              <Filter className="w-4 h-4" /> Type: <span className="text-indigo-600 dark:text-indigo-400">{activeType}</span> <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                {['All', 'Credited', 'Debited'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setActiveType(t); setShowTypeDropdown(false); }} 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${activeType === t ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {t} Transactions
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grouped Table Content */}
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100/50 dark:bg-white/[0.05] border-b border-slate-200/50 dark:border-white/5">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category (CoA)</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Balance</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            
            {Object.entries(groupedTransactions).map(([groupName, transactions]) => (
              <tbody key={groupName}>
                {/* Visual Group Header */}
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-y border-slate-200/50 dark:border-white/5">
                  <td colSpan={7} className="px-6 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {groupName}
                  </td>
                </tr>
                {/* Rows */}
                {transactions.map((tx, i) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className="border-b border-slate-100 dark:border-white/5 bg-transparent hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">{tx.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tx.description}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase
                        ${tx.type === 'Credited' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}
                      >
                        {tx.type === 'Credited' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold tracking-tight text-base ${tx.type === 'Credited' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'Credited' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-500 dark:text-slate-400">
                      ₹{tx.balance.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            ))}
            {filteredNav.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No transactions found spanning the selected filters. Change Category, Type, or Date boundaries to view results.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </motion.div>
    </div>
  );
}
