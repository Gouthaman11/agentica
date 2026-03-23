import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Wallet, CreditCard, LogOut } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          {[
            { icon: User, label: 'Profile', active: true },
            { icon: Building, label: 'Company Info', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Shield, label: 'Security', active: false },
            { icon: Wallet, label: 'Billing', active: false },
            { icon: CreditCard, label: 'Integrations', active: false },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              item.active 
                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}>
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-rose-500 hover:bg-rose-500/10">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                DS
              </div>
              <div>
                <button className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  Change Avatar
                </button>
                <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                <input type="text" defaultValue="Deepan" className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                <input type="text" defaultValue="S." className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input type="email" defaultValue="nexus@example.com" className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                Save Changes
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 shadow-sm"
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Appearance</h2>
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50/50 dark:bg-black/20">
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-white">Theme Preference</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Switch between light and dark themes.</p>
              </div>
              <select className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none">
                <option>System Default</option>
                <option>Light Theme</option>
                <option>Dark Theme</option>
              </select>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Ensure Building icon is exported or swap with another
function Building(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
