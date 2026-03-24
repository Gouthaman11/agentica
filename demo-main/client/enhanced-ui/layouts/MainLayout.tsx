import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  FileText,
  Bell,
  Settings,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/enhanced/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/enhanced/transactions", icon: ArrowRightLeft },
  { name: "Analytics", path: "/enhanced/analytics", icon: PieChart },
  { name: "Documents", path: "/enhanced/documents", icon: FileText },
  { name: "Alerts & Insights", path: "/enhanced/alerts", icon: Bell },
  { name: "Settings", path: "/enhanced/settings", icon: Settings }
];

const Tooltip = ({ text }: { text: string }) => (
  <span className="absolute left-[70px] px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-[#1A1A1D] border border-slate-700 dark:border-white/10 text-white text-xs font-bold opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-50 whitespace-nowrap shadow-xl shadow-black/20">
    {text}
  </span>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex bg-slate-50 dark:bg-[#0A0A0B] min-h-screen font-sans selection:bg-blue-500/30 relative">
      
      {/* Background ambient glow for premium feel */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* 1. TOP LEFT LOGO (Standalone Hover-Reveal) */}
      <Link to="/enhanced/dashboard" className="fixed top-8 left-8 z-50 hidden md:flex items-center text-blue-600 dark:text-blue-500 group cursor-pointer bg-white/60 dark:bg-[#121213]/80 backdrop-blur-xl p-2.5 rounded-[20px] border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-black/50 transition-all duration-500 hover:shadow-[0_8px_30px_-5px_rgba(37,99,235,0.2)] hover:scale-105">
         <svg className="w-7 h-7 shrink-0 drop-shadow-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.5 9H8.5L12 2Z" fill="currentColor"/>
            <path d="M12 22L15.5 15H8.5L12 22Z" fill="currentColor"/>
            <path d="M2 12L9 15.5V8.5L2 12Z" fill="currentColor"/>
            <path d="M22 12L15 15.5V8.5L22 12Z" fill="currentColor"/>
         </svg>
         <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-3 transition-all duration-500 ease-out font-extrabold text-[20px] tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
           LedgerLens
         </span>
      </Link>

      {/* 2. CENTER-LEFT FLOATING HALF-CIRCLE DOCK */}
      <aside 
        className="hidden md:flex fixed top-1/2 -translate-y-1/2 left-0 flex-col justify-center py-8 px-4 bg-white/70 dark:bg-[#121213]/80 backdrop-blur-xl border border-l-0 border-slate-200 dark:border-white/10 rounded-r-full shadow-[15px_0_50px_-15px_rgba(0,0,0,0.1)] dark:shadow-black/50 z-50 transition-all duration-500 ease-out w-[88px] hover:w-[100px] group/sidebar"
      >
        <div className="flex flex-col gap-6 w-full items-center relative">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path || (item.path !== '/enhanced' && item.path !== '/enhanced/dashboard' && item.path !== '#' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center justify-center w-[52px] h-[52px] rounded-full transition-all duration-300 ease-in-out hover:scale-110 group-hover/sidebar:translate-x-1 ${
                   isActive 
                     ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                     : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50/80 dark:hover:bg-white/5'
                }`}
              >
                {isActive && (
                   <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 dark:bg-blue-400 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-300" />
                )}

                <Icon className={`w-[22px] h-[22px] shrink-0 transition-colors ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <Tooltip text={item.name} />
              </Link>
            );
          })}
        </div>
      </aside>

      {/* 3. LOGOUT BUTTON (SEPARATE BOTTOM LEFT) */}
      <div className="fixed bottom-8 left-8 z-50 hidden md:block group">
        <Link 
          to="/enhanced/login" 
          className="flex items-center justify-center p-3.5 rounded-full text-rose-500 bg-white/70 dark:bg-[#121213]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:scale-110 hover:text-rose-600 shadow-lg transition-all duration-300 relative"
        >
          <LogOut className="w-5 h-5 shrink-0 stroke-[2.5px]" />
          <span className="absolute left-[60px] px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-[#1A1A1D] border border-slate-700 dark:border-white/10 text-white text-xs font-bold opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-50 whitespace-nowrap shadow-xl">
            Log Out
          </span>
        </Link>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#0A0A0B]/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 flex items-center justify-around py-3 px-2 z-50 pb-safe shadow-2xl">
        {navItems.slice(0, 5).map(item => {
           const isActive = location.pathname === item.path || (item.path !== '/enhanced' && item.path !== '/enhanced/dashboard' && item.path !== '#' && location.pathname.startsWith(item.path));
           const Icon = item.icon;
           return (
             <Link key={item.name} to={item.path} className={`p-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>
               <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
               <span className="text-[9px] font-bold">{item.name.split(' ')[0]}</span>
             </Link>
           )
        })}
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-x-hidden p-6 md:p-10 md:pt-8 md:pl-[130px] pb-24 md:pb-10 h-screen overflow-y-auto w-full transition-all duration-300">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full min-h-screen max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
