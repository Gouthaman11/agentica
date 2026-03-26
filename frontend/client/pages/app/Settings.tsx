import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Wallet, CreditCard, LogOut } from 'lucide-react';

export default function Settings() {
  const [fullName, setFullName] = useState(localStorage.getItem('user_name') || 'Deepan S.');
  const [username, setUsername] = useState(localStorage.getItem('user_username') || '');
  const [email, setEmail] = useState(localStorage.getItem('user_email') || 'nexus@example.com');
  const [phone, setPhone] = useState(localStorage.getItem('user_phone') || '');
  const [currency, setCurrency] = useState(localStorage.getItem('user_currency') || '₹');

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = () => {
    localStorage.setItem('user_name', fullName);
    localStorage.setItem('user_username', username);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_phone', phone);
    localStorage.setItem('user_currency', currency);
    alert('Profile updated successfully.');
  };

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
                ? 'bg-[#EDF6F5] dark:bg-[#6E9F9D]/15 text-[#5E8F8E] dark:text-[#A6C7C7] font-medium' 
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
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#6E9F9D] to-[#8FBFBD] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#8FBFBD]/25">
                {initials}
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
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E9F9D]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E9F9D]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E9F9D]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E9F9D]/50"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E9F9D]/50"
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-[#5E8F8E] hover:bg-[#4D7E7D] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-lg shadow-[#8FBFBD]/25"
              >
                Save Changes
              </button>
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
