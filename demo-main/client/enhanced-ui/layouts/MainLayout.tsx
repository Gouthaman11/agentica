import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
  FileText,
  Bell,
  Settings,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  isAi?: boolean;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/enhanced", icon: LayoutDashboard },
  { name: "Transactions", path: "/enhanced/transactions", icon: ArrowRightLeft },
  { name: "Analytics", path: "/enhanced/analytics", icon: PieChart },
  { name: "Documents", path: "/enhanced/documents", icon: FileText },
  { name: "Alerts & AI Insights", path: "/enhanced/alerts", icon: Bell, isAi: true },
  { name: "Settings", path: "/enhanced/settings", icon: Settings },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex bg-slate-50 dark:bg-[#0A0A0B] min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Background ambient glow for premium feel */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 border-r border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl flex flex-col">
        <div className="p-6 pb-2 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-400">
            Nexus AI
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/enhanced' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100 transition-opacity"}`} />
                <span className="relative z-10">{item.name}</span>
                {item.isAi && (
                  <span className="relative z-10 ml-auto flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              DS
            </div>
            <div>
              <p className="text-sm font-medium dark:text-slate-200">Deepan S.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-x-hidden p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
