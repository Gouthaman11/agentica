import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, MoreHorizontal, ArrowUpDown } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: '1', date: '2026-03-23', description: 'Stripe Payout', category: 'Income', amount: 3200.50, status: 'Completed' },
  { id: '2', date: '2026-03-22', description: 'AWS Services', category: 'Software', amount: -145.20, status: 'Completed' },
  { id: '3', date: '2026-03-20', description: 'Adobe Creative Cloud', category: 'Software', amount: -79.99, status: 'Completed' },
  { id: '4', date: '2026-03-19', description: 'Client Invoice #42', category: 'Income', amount: 850.00, status: 'Pending' },
  { id: '5', date: '2026-03-18', description: 'WeWork Office', category: 'Rent', amount: -500.00, status: 'Completed' },
  { id: '6', date: '2026-03-15', description: 'Github Copilot', category: 'Software', amount: -10.00, status: 'Completed' },
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleExport = () => {
    alert("Exporting data to Excel... (Mock Action)");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your recent financial activities.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm overflow-hidden"
      >
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200/50 dark:border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-white/5 border-b border-slate-200/50 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">Date <ArrowUpDown className="w-3 h-3" /></th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right flex items-center justify-end gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">Amount <ArrowUpDown className="w-3 h-3" /></th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase())).map((tx, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={tx.id} 
                  className="border-b border-slate-200/50 dark:border-white/5 bg-transparent hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{tx.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
                      ${tx.status === 'Completed' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/10">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-slate-200/50 dark:border-white/5 flex justify-between items-center text-sm text-slate-500">
          <span>Showing 1 to 6 of 6 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">1</button>
            <button className="px-3 py-1 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
