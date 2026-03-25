import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Search, Filter, ArrowUpRight, ArrowDownRight, 
  X, Calendar, FileText, ChevronRight, Activity, TrendingUp, TrendingDown,
  BrainCircuit, CreditCard, ChevronDown, CheckCircle2, Sun, Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
  { id: '10', date: '2026-03-04', time: '12:10', description: 'Figma Pro Team', category: 'Software Subs', type: 'Debited', amount: 2600, balance: 40650, sourceFile: 'Q1_Invoices.pdf', uploadDate: '2026-03-22', aiConfidence: 93, group: 'Earlier This Month' },
  { id: '11', date: '2026-03-03', time: '15:30', description: 'Dribbble Subscription', category: 'Software Subs', type: 'Debited', amount: 1800, balance: 43250, sourceFile: 'Q1_Invoices.pdf', uploadDate: '2026-03-22', aiConfidence: 91, group: 'Earlier This Month' },
  { id: '12', date: '2026-03-02', time: '09:20', description: 'YouTube Premium', category: 'Software Subs', type: 'Debited', amount: 420, balance: 45050, sourceFile: 'Bank_Statement_Mar.pdf', uploadDate: '2026-03-21', aiConfidence: 90, group: 'Earlier This Month' },
  { id: '13', date: '2026-03-01', time: '11:05', description: 'Client Retainer', category: 'Income', type: 'Credited', amount: 28000, balance: 45470, sourceFile: 'Inbound_Wire.pdf', uploadDate: '2026-03-02', aiConfidence: 96, group: 'Earlier This Month' },
  { id: '14', date: '2026-03-14', time: '13:40', description: 'Adobe Creative Cloud', category: 'Software Subs', type: 'Debited', amount: 4600, balance: 69150, sourceFile: 'Q1_Invoices.pdf', uploadDate: '2026-03-22', aiConfidence: 94, group: 'Earlier This Month' },
  { id: '15', date: '2026-03-13', time: '10:25', description: 'Office Internet Bill', category: 'Rent & Utilities', type: 'Debited', amount: 2100, balance: 73750, sourceFile: 'Bank_Statement_Mar.pdf', uploadDate: '2026-03-21', aiConfidence: 92, group: 'Earlier This Month' },
  { id: '16', date: '2026-03-12', time: '16:10', description: 'Client Milestone Payout', category: 'Income', type: 'Credited', amount: 18000, balance: 75850, sourceFile: 'Inbound_Wire.pdf', uploadDate: '2026-03-13', aiConfidence: 97, group: 'Earlier This Month' },
  { id: '17', date: '2026-03-09', time: '18:55', description: 'Uber for Business', category: 'Other', type: 'Debited', amount: 980, balance: 28750, sourceFile: 'Bank_Statement_Mar.pdf', uploadDate: '2026-03-21', aiConfidence: 89, group: 'Earlier This Month' },
  { id: '18', date: '2026-03-08', time: '20:15', description: 'LinkedIn Premium', category: 'Software Subs', type: 'Debited', amount: 1250, balance: 29730, sourceFile: 'Q1_Invoices.pdf', uploadDate: '2026-03-22', aiConfidence: 93, group: 'Earlier This Month' },
  { id: '19', date: '2026-03-07', time: '09:35', description: 'Google Ads Credit Refund', category: 'Income', type: 'Credited', amount: 5200, balance: 30980, sourceFile: 'Inbound_Wire.pdf', uploadDate: '2026-03-08', aiConfidence: 90, group: 'Earlier This Month' },
  { id: '20', date: '2026-03-06', time: '14:20', description: 'Notion Team Plan', category: 'Software Subs', type: 'Debited', amount: 1600, balance: 37250, sourceFile: 'Q1_Invoices.pdf', uploadDate: '2026-03-22', aiConfidence: 92, group: 'Earlier This Month' },
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
  const ITEMS_PER_PAGE = 8;
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const userName = localStorage.getItem('user_name') || 'Deepan S.';
  const rawCurrency = localStorage.getItem('user_currency') || '';
  const currencySymbol = rawCurrency && rawCurrency !== 'â‚¹' && rawCurrency !== '?' ? rawCurrency : '₹';

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, customStartDate, customEndDate, activeCategory, activeType]);

  const totalPages = Math.max(1, Math.ceil(filteredNav.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredNav.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNav, page, ITEMS_PER_PAGE]);

  const fillerRowCount = useMemo(() => {
    if (filteredNav.length === 0) return 0;
    return Math.max(0, ITEMS_PER_PAGE - paginatedTransactions.length);
  }, [filteredNav.length, paginatedTransactions.length, ITEMS_PER_PAGE]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    paginatedTransactions.forEach(t => {
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
  }, [paginatedTransactions, dateFilter]);

  const subscriptionItems = useMemo(() => {
    return filteredNav
      .filter((t) => t.type === 'Debited')
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        name: t.description,
        time: `${t.group}, ${t.time}`,
        amount: t.amount,
      }));
  }, [filteredNav]);

  const getSubscriptionIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('netflix')) return 'https://cdn.simpleicons.org/netflix/E50914';
    if (n.includes('spotify')) return 'https://cdn.simpleicons.org/spotify/1DB954';
    if (n.includes('dribbble')) return 'https://cdn.simpleicons.org/dribbble/EA4C89';
    if (n.includes('figma')) return 'https://cdn.simpleicons.org/figma/F24E1E';
    if (n.includes('youtube')) return 'https://cdn.simpleicons.org/youtube/FF0000';
    if (n.includes('aws') || n.includes('amazon')) return 'https://cdn.simpleicons.org/amazonaws/FF9900';
    if (n.includes('github')) return 'https://cdn.simpleicons.org/github/181717';
    if (n.includes('swiggy')) return 'https://cdn.simpleicons.org/swiggy/FC8019';
    if (n.includes('zomato')) return 'https://cdn.simpleicons.org/zomato/E23744';
    return null;
  };

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
                  <CreditCard className="w-5 h-5 text-[#6E9F9D]" /> Transaction Details
                </h2>
                <button onClick={() => setSelectedTx(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Header Amount */}
                <div className="text-center pb-6 border-b border-slate-100 dark:border-white/10">
                  <div className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${selectedTx.type === 'Credited' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                     {selectedTx.type === 'Credited' ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
                  </div>
                  <h3 className={`text-4xl font-bold tracking-tight ${selectedTx.type === 'Credited' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {selectedTx.type === 'Credited' ? '+' : '-'}{currencySymbol}{selectedTx.amount.toLocaleString()}
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
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap leading-none ${
                      selectedTx.type === 'Credited' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}>
                      {selectedTx.type === 'Credited' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {selectedTx.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Category (CoA)</p>
                    <p className="text-sm font-medium text-[#5E8F8E] dark:text-[#A6C7C7] bg-[#EDF6F5] dark:bg-[#6E9F9D]/15 inline-flex px-2 py-1 rounded-md">{selectedTx.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Balance After</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{currencySymbol}{selectedTx.balance.toLocaleString()}</p>
                  </div>
                </div>

                {/* AI & Source Info */}
                <div className="p-5 rounded-2xl border border-[#D5E8E7] dark:border-[#6E9F9D]/30 bg-[#EDF6F5] dark:bg-[#6E9F9D]/10 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-5 h-5 text-[#6E9F9D]" />
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
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-[#D5E8E7] dark:border-[#6E9F9D]/30">
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
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Enterprise-grade transaction tracking, filtering, and flow analysis.</p>
        </div>
        <div className="flex items-center gap-3">
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
            className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#5E8F8E] transition-all shadow-sm"
          >
            <Sun className="w-4 h-4 dark:hidden" />
            <Moon className="w-4 h-4 hidden dark:block text-[#8FBFBD]" />
          </button>
          
          <div className="relative group flex items-center">
            <div className="absolute right-full mr-2 pointer-events-none overflow-hidden h-full flex items-center">
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="bg-white/90 dark:bg-[#17191E]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/10 shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 translate-x-4 whitespace-nowrap"
              >
                <p className="text-[13px] font-black text-slate-900 dark:text-white leading-none tracking-tight">{userName}</p>
                <p className="text-[9px] text-[#6E9F9D] font-black mt-0.5 uppercase tracking-widest leading-none">Settings</p>
              </motion.div>
            </div>
            <Link to="/enhanced/settings" className="w-12 h-12 rounded-full overflow-hidden bg-white/80 dark:bg-[#17191E]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:shadow-[0_8px_30px_rgba(110,159,157,0.25)] transition-all duration-700 relative z-10 hover:border-[#6E9F9D]/50 shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-inner grow-0 shrink-0 relative z-10 border border-slate-100 dark:border-white/5 group-hover:rotate-[360deg] transition-transform duration-700">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}&backgroundColor=f1f5f9`} alt="User Avatar" className="w-full h-full object-cover bg-slate-100" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#8FBFBD]/0 to-[#8FBFBD]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Link>
          </div>

          <button className="flex bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold items-center gap-2 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700">
            Export View
          </button>
          <button className="flex bg-[#5E8F8E] hover:bg-[#4D7E7D] text-white px-4 py-2.5 rounded-xl text-sm font-bold items-center gap-2 shadow-lg shadow-[#6E9F9D]/25 transition-all active:scale-95">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      {/* Mini Visual Insights & Summary Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Summary Strip */}
        <div className="lg:col-span-3 grid grid-cols-3 gap-6 p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-sm">
            <div className="pl-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Total Credits
              </p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{currencySymbol}{summary.credits.toLocaleString()}</h2>
            </div>
            <div className="border-l border-slate-200 dark:border-white/10 pl-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-rose-500" /> Total Debits
              </p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{currencySymbol}{summary.debits.toLocaleString()}</h2>
            </div>
            <div className="border-l border-slate-200 dark:border-white/10 pl-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-[#6E9F9D]" /> Net Flow
              </p>
              <h2 className={`text-2xl font-bold ${summary.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {summary.net >= 0 ? '+' : ''}{currencySymbol}{summary.net.toLocaleString()}
              </h2>
            </div>
        </div>
        
        {/* Mini Analytics */}
        <div className="lg:col-span-1 p-5 rounded-3xl bg-gradient-to-br from-[#8FBFBD]/10 to-[#D5E8E7]/50 backdrop-blur-xl border border-[#8FBFBD]/35 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-center mb-2">
             <p className="text-xs font-bold text-[#3F6E6D] dark:text-[#BFDADA] uppercase">Daily Spend Trend</p>
             <p className="text-xs font-bold text-slate-500">Mar 15-23</p>
           </div>
           <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={miniChartData}>
                <Bar dataKey="spend" radius={[2, 2, 0, 0]} isAnimationActive animationDuration={1000} animationEasing="ease-out">
                  {miniChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.spend > 10000 ? '#D8EC63' : '#8FBFBD'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
           <p className="text-[10px] text-slate-500 mt-2 font-medium">Highest tx: {currencySymbol}15k (WeWork)</p>
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
                  ? 'bg-[#5E8F8E] text-white shadow-[#6E9F9D]/30' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {filter} {filter === 'Custom Range' && <Calendar className="w-3.5 h-3.5 inline ml-1 mb-0.5" />}
            </button>
          ))}
        </div>

        {/* Dynamic Native Custom Range Inputs Display */}
        {dateFilter === 'Custom Range' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 items-center bg-[#EDF6F5] dark:bg-[#6E9F9D]/15 p-3 rounded-2xl border border-[#D5E8E7] dark:border-[#6E9F9D]/30 shadow-sm w-fit">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">From Date:</span>
              <input 
                 type="date" 
                 value={customStartDate} 
                 onChange={e => setCustomStartDate(e.target.value)} 
                 className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#6E9F9D] shadow-sm custom-calendar-icon" 
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">To Date:</span>
              <input 
                 type="date" 
                 value={customEndDate} 
                 onChange={e => setCustomEndDate(e.target.value)} 
                 className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#6E9F9D] shadow-sm custom-calendar-icon" 
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="xl:col-span-2 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-sm overflow-visible h-full flex flex-col"
      >
        {/* Smart Search + Real Active Interactive Dropdown Filters */}
        <div className="p-4 border-b border-slate-200/50 dark:border-white/10 flex flex-wrap gap-4 bg-slate-50/50 dark:bg-white/[0.02] relative z-20">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by merchant, category, or amount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6E9F9D]/50 transition-shadow shadow-sm"
            />
          </div>
          
          <div className="relative">
            <button onClick={() => { setShowCategoryDropdown(!showCategoryDropdown); setShowTypeDropdown(false); }} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
              Category: <span className="text-[#5E8F8E] dark:text-[#A6C7C7]">{activeCategory}</span> <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                {['All', 'Income', 'Software Subs', 'Food & Dining', 'Rent & Utilities'].map(c => (
                  <button 
                    key={c} 
                    onClick={() => { setActiveCategory(c); setShowCategoryDropdown(false); }} 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${activeCategory === c ? 'text-[#5E8F8E] dark:text-[#A6C7C7] bg-[#EDF6F5] dark:bg-[#6E9F9D]/15' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowCategoryDropdown(false); }} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm">
              <Filter className="w-4 h-4" /> Type: <span className="text-[#5E8F8E] dark:text-[#A6C7C7]">{activeType}</span> <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                {['All', 'Credited', 'Debited'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => { setActiveType(t); setShowTypeDropdown(false); }} 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${activeType === t ? 'text-[#5E8F8E] dark:text-[#A6C7C7] bg-[#EDF6F5] dark:bg-[#6E9F9D]/15' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    {t} Transactions
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grouped Table Content */}
        <div className="overflow-x-auto relative z-10 flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100/50 dark:bg-white/[0.05] border-b border-slate-200/50 dark:border-white/10">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category (CoA)</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Amount</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Balance</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            
            {Object.entries(groupedTransactions).map(([groupName, transactions]) => (
              <tbody key={groupName}>
                {/* Visual Group Header */}
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-y border-slate-200/50 dark:border-white/10">
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
                    className="border-b border-slate-100 dark:border-white/20 bg-transparent hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">{tx.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white group-hover:text-[#5E8F8E] dark:group-hover:text-[#A6C7C7] transition-colors">{tx.description}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-[#17191E] text-slate-600 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase whitespace-nowrap leading-none
                        ${tx.type === 'Credited' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}
                      >
                        {tx.type === 'Credited' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold tracking-tight text-base tabular-nums whitespace-nowrap ${tx.type === 'Credited' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'Credited' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                      {currencySymbol}{tx.balance.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            ))}
            {fillerRowCount > 0 && (
              <tbody>
                {Array.from({ length: fillerRowCount }).map((_, idx) => (
                  <tr key={`filler-${idx}`} className="border-b border-slate-100/70 dark:border-white/10">
                    <td className="px-6 py-5"><div className="h-4 w-20 rounded bg-slate-100/80 dark:bg-slate-800/50" /></td>
                    <td className="px-6 py-5"><div className="h-4 w-40 rounded bg-slate-100/80 dark:bg-slate-800/50" /></td>
                    <td className="px-6 py-5"><div className="h-6 w-24 rounded-full bg-slate-100/80 dark:bg-slate-800/50" /></td>
                    <td className="px-6 py-5"><div className="h-6 w-24 rounded-full bg-slate-100/80 dark:bg-slate-800/50" /></td>
                    <td className="px-6 py-5 text-right"><div className="h-4 w-20 ml-auto rounded bg-slate-100/80 dark:bg-slate-800/50" /></td>
                    <td className="px-6 py-5 text-right"><div className="h-4 w-20 ml-auto rounded bg-slate-100/80 dark:bg-slate-800/50" /></td>
                    <td className="px-4 py-5"><div className="h-4 w-4 ml-auto rounded bg-slate-100/80 dark:bg-slate-800/50" /></td>
                  </tr>
                ))}
              </tbody>
            )}
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
        {filteredNav.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200/50 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Show data <span className="font-bold text-slate-700 dark:text-slate-200">{Math.min((page - 1) * ITEMS_PER_PAGE + 1, filteredNav.length)}-{Math.min(page * ITEMS_PER_PAGE, filteredNav.length)}</span> of <span className="font-bold text-slate-700 dark:text-slate-200">{filteredNav.length}</span>
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold border transition-colors ${
                    pageNum === page
                      ? 'bg-[#5E8F8E] text-white border-[#5E8F8E]'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-4 h-9 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Reference Widgets */}
      <div className="xl:col-span-1 self-start space-y-4">
        <div className="rounded-3xl p-5 bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-bold text-slate-900 dark:text-white">Transaction Size</p>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 340 260" className="w-full h-full">
              {Array.from({ length: 46 }).map((_, i) => {
                const startAngle = -160;
                const endAngle = -20;
                const angle = startAngle + (i * (endAngle - startAngle)) / 45;
                const rad = (angle * Math.PI) / 180;
                const cx = 170;
                const cy = 228;
                const inner = 132;
                const outer = 164;
                const x1 = cx + inner * Math.cos(rad);
                const y1 = cy + inner * Math.sin(rad);
                const x2 = cx + outer * Math.cos(rad);
                const y2 = cy + outer * Math.sin(rad);
                const active = i < 34;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={active ? '#6E9F9D' : '#D7DEE8'}
                    strokeWidth={5}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <div className="absolute left-1/2 top-[63%] -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-[#6E9F9D]">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="space-y-1 mt-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-[#6E9F9D]" />Low-Value Transactions</span>
              <span className="font-bold text-slate-900 dark:text-white">75%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />High-Value Transactions</span>
              <span className="font-bold text-slate-900 dark:text-white">25%</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl p-5 bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-bold text-slate-900 dark:text-white">Outcome Categories</p>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex gap-1 h-8 items-end mb-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className={`w-1.5 rounded-sm ${i < 13 ? 'bg-[#6E9F9D]' : i < 19 ? 'bg-[#A6C7C7]' : 'bg-slate-200 dark:bg-slate-700'}`} style={{ height: `${16 + ((i % 5) * 2)}px` }} />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6E9F9D]" />Monthly Need</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#A6C7C7]" />Subscription</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />Other</span>
          </div>
        </div>

        <div className="rounded-3xl p-5 bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-lg font-bold text-slate-900 dark:text-white">Subscription</p>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {subscriptionItems.length === 0 && (
              <p className="text-sm text-slate-500">No subscription-type debits in current filters.</p>
            )}
            {subscriptionItems.map((s, idx) => (
              <div key={s.id + idx} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {getSubscriptionIcon(s.name) ? (
                    <img
                      src={getSubscriptionIcon(s.name)!}
                      alt={s.name}
                      className="w-7 h-7 rounded-full bg-white p-1 border border-slate-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-black text-slate-600 dark:text-slate-300 flex items-center justify-center">
                      {s.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{s.name}</p>
                    <p className="text-xs text-slate-500 truncate">{s.time}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-rose-600">-{currencySymbol}{s.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Transfer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}





