import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  Bell,
  Settings,
  LogOut,
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
  { name: "Alerts & Insights", path: "/enhanced/alerts", icon: Bell },
  { name: "Settings", path: "/enhanced/settings", icon: Settings },
];

const Tooltip = ({ text }: { text: string }) => (
  <span className="absolute left-[62px] px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-[#21242B] border border-slate-700 dark:border-white/10 text-white text-xs font-bold opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-50 whitespace-nowrap shadow-xl shadow-black/20">
    {text}
  </span>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex bg-[#F1F7F6] dark:bg-[#0A0A0B] min-h-screen font-sans selection:bg-[#D8EC63]/30 relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#8FBFBD]/15 blur-[120px]" />
      </div>

      {/* Project Icon (Top Left) */}
      <Link
        to="/enhanced/dashboard"
        className="group relative hidden md:flex fixed left-8 top-8 z-50 items-center justify-center w-[44px] h-[44px] rounded-full bg-white/95 dark:bg-[#1A1E21]/95 border border-slate-200 dark:border-white/10 shadow-sm"
      >
        <div className="grid grid-cols-2 gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900/85 dark:bg-white/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900/80 dark:bg-white/85" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-white" />
        </div>
        <Tooltip text="LedgerLens" />
      </Link>

      {/* Desktop Left Rail */}
      <aside className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-50 flex-col items-center">

        <div className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center justify-center w-[42px] h-[42px] rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-black text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.7)] scale-[1.03]"
                    : "bg-white/95 dark:bg-[#1A1E21]/95 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:text-[#1b3332] dark:hover:text-[#D8EC63] hover:scale-[1.04]"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? "stroke-[2.4px]" : "stroke-[2.1px]"}`} />
                <Tooltip text={item.name} />
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Log Out */}
      <div className="fixed bottom-8 left-8 z-50 hidden md:block group">
        <Link
          to="/enhanced/login"
          className="flex items-center justify-center w-[44px] h-[44px] rounded-full text-rose-500 bg-white/90 dark:bg-[#17191E]/90 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:scale-110 hover:text-rose-600 shadow-lg transition-all duration-300 relative"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 stroke-[2.5px]" />
          <span className="absolute left-[58px] px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-[#21242B] border border-slate-700 dark:border-white/10 text-white text-xs font-bold opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-50 whitespace-nowrap shadow-xl">
            Log Out
          </span>
        </Link>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#0F1115]/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/10 flex items-center justify-around py-3 px-2 z-50 pb-safe shadow-2xl text-slate-400">
        {navItems.slice(0, 5).map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/enhanced" &&
              item.path !== "/enhanced/dashboard" &&
              item.path !== "#" &&
              location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`p-2 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? "text-black dark:text-[#D8EC63] bg-black/5 dark:bg-[#D8EC63]/5"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
              <span className="text-[9px] font-bold">{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-x-hidden p-6 md:p-12 md:pl-[122px] pb-24 md:pb-12 h-screen overflow-y-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full min-h-screen max-w-[1500px] mx-auto text-slate-900 dark:text-slate-100"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
