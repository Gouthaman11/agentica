import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const MOCK_DATA = [
  { date: "Mar 01", desc: "NETFLIX COM", debit: "₹649.00", credit: "-", balance: "₹1,24,500" },
  { date: "Mar 02", desc: "SWIGGY*INSTAMART", debit: "₹1,240.00", credit: "-", balance: "₹1,23,260" },
  { date: "Mar 05", desc: "SALARY CREDITED", debit: "-", credit: "₹1,50,000", balance: "₹2,73,260" },
  { date: "Mar 08", desc: "UBER RIDES", debit: "₹450.00", credit: "-", balance: "₹2,72,810" },
  { date: "Mar 10", desc: "STARBUCK", debit: "₹850.00", credit: "-", balance: "₹2,71,960" }
];

export default function ExtractionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20%", once: false });

  return (
    <section ref={containerRef} className="relative bg-white min-h-[100vh] py-32 overflow-hidden flex items-center">
      {/* Subtle Background Glow fixed alignment */}
      <div className="absolute top-1/2 left-[30%] w-[600px] h-[600px] bg-indigo-50/70 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Text Content */}
        <motion.div 
           initial={{ opacity: 0, x: 50 }}
           animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
           transition={{ duration: 1, ease: "easeOut", type: "spring", bounce: 0.3 }}
           className="w-full lg:w-[40%] text-left"
        >
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-200">
             Step 2
           </div>
           <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Instant <span className="text-indigo-600">Extraction</span>
           </h2>
           <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-lg">
              Watch as unstructured chaos perfectly aligns into structured financial rows, error-free.
           </p>
        </motion.div>

        {/* Floating Table Rows - Replaces Laptop Mockup */}
        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
           transition={{ duration: 1, delay: 0.2, type: "spring" }}
           className="w-full lg:w-[60%] perspective-[1000px]"
        >
          <div className="w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.06)] border border-white/50 p-6 relative overflow-hidden transform-gpu rotateY-[10deg] rotateX-[5deg]">
             {/* Decorative Header */}
             <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 px-2">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-slate-200" />
                   <div className="w-3 h-3 rounded-full bg-slate-200" />
                   <div className="w-3 h-3 rounded-full bg-slate-200" />
                </div>
                <div className="h-4 w-32 bg-slate-100 rounded" />
             </div>

             {/* Table Columns */}
             <div className="grid grid-cols-5 gap-2 px-4 py-2 mb-2">
                {["Date", "Description", "Debit", "Credit", "Balance"].map((label) => (
                  <div key={label} className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {label}
                  </div>
                ))}
             </div>

             {/* Floating Rows Reveal */}
             <div className="flex flex-col gap-3 pb-4">
                {MOCK_DATA.map((row, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -30, rotateX: 30 }}
                    animate={isInView ? { opacity: 1, x: 0, rotateX: 0 } : { opacity: 0, x: -30, rotateX: 30 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.15 + 0.4,
                      type: "spring",
                      bounce: 0.4
                    }}
                    className="grid grid-cols-5 gap-2 px-4 py-3 md:py-4 border border-slate-100/50 rounded-xl bg-white shadow-sm hover:-translate-y-1 transition-transform cursor-pointer items-center"
                  >
                    <div className="text-slate-500 font-medium text-[10px] md:text-sm">{row.date}</div>
                    <div className="text-slate-900 font-bold text-[10px] md:text-sm truncate pr-2">{row.desc}</div>
                    <div className="text-red-500 font-medium text-[10px] md:text-sm">{row.debit}</div>
                    <div className="text-emerald-500 font-medium text-[10px] md:text-sm">{row.credit}</div>
                    <div className="text-slate-900 font-bold text-[10px] md:text-sm">{row.balance}</div>
                  </motion.div>
                ))}
             </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
