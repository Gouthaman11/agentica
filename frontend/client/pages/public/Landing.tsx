import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import SmoothScroll from '../../components/landing/SmoothScroll';
import HeroSection from '../../components/landing/HeroSection';
import UploadSection from '../../components/landing/UploadSection';
import ExtractionSection from '../../components/landing/ExtractionSection';
import CategorizationSection from '../../components/landing/CategorizationSection';
import AnalyticsSection from '../../components/landing/AnalyticsSection';
import TimelineSection from '../../components/landing/TimelineSection';
import TransactionSection from '../../components/landing/TransactionSection';
import ExportSection from '../../components/landing/ExportSection';
import InsightsSection from '../../components/landing/InsightsSection';

export default function Landing() {
  
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SmoothScroll>
      <div className="bg-white text-black selection:bg-black/10 overflow-x-hidden font-sans">
        
        {/* Absolute Minimal Navbar - Light Mode */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
          <div className="max-w-screen-2xl mx-auto px-8 md:px-12 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-black rounded-[10px] flex items-center justify-center shadow-md">
                 <Zap className="w-5 h-5 fill-white text-white" />
               </div>
               <span className="font-extrabold text-xl tracking-tight text-black cursor-pointer">LedgerLens</span>
            </div>

            <div className="flex items-center gap-6">
              <Link to="/enhanced/login" className="text-sm font-bold text-slate-600 hover:text-black transition-colors hidden sm:block">Log in</Link>
              <Link to="/enhanced/signup" className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:scale-105 transition-all duration-300 shadow-lg">
                Start Free
              </Link>
            </div>
          </div>
        </nav>

        <main className="w-full">
           <HeroSection />
           <UploadSection />
           <ExtractionSection />
           <CategorizationSection />
           <AnalyticsSection />
           <TimelineSection />
           <TransactionSection />
           <ExportSection />
           <InsightsSection />
        </main>

        {/* Final Minimal CTA Footer - Light Mode */}
        <footer className="bg-[#F5F8F8] py-40 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-12 shadow-2xl">
               <span className="text-white font-black text-3xl">L</span>
            </div>
            <h2 className="text-6xl md:text-[5rem] font-extrabold tracking-tight text-black mb-8 leading-[1.1]">
              Ready to experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-lime-500">clarity?</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium mb-16 max-w-2xl">
              Join thousands of businesses. Extract your first statement in under sixty seconds natively.
            </p>
            <Link to="/enhanced/signup" className="px-10 py-5 rounded-full bg-black text-white font-bold text-lg hover:bg-black transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center gap-3 hover:-translate-y-1">
               Create your Workspace <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}

