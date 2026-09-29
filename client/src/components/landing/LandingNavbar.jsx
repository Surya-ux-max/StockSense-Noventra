import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 select-none">
      {/* Brand Icon */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-11 h-11 rounded-2xl bg-[#005CE6] text-white flex items-center justify-center shadow-md relative overflow-hidden group-hover:scale-105 transition-transform">
          <Sparkles className="w-6 h-6 fill-white/20 text-[#FFDD55]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-slate-900">Walmart StockSense</span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-[#EA7A18] text-white">PROD</span>
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Retail Decision Support</p>
        </div>
      </Link>

      {/* Center Nav Pill */}
      <div className="hidden lg:flex items-center gap-6 bg-[#F6EEDB] border border-[#EBDDC6] px-6 py-2 rounded-2xl text-xs font-black text-slate-800 shadow-xs uppercase tracking-wide">
        <Link to="/store" className="text-[#EA7A18] hover:opacity-80 transition-opacity flex items-center gap-1">
          🛒 Store Portal
        </Link>
        <Link to="/manager" className="text-[#005CE6] hover:opacity-80 transition-opacity flex items-center gap-1">
          ⚡ Manager Demand
        </Link>
        <div className="h-3 w-px bg-[#EBDDC6]" />
        <Link to="/dashboard" className="hover:text-[#005CE6] transition-colors">Command Center</Link>
        <Link to="/risk" className="hover:text-[#005CE6] transition-colors">Inventory Risk</Link>
        <Link to="/forecast" className="hover:text-[#005CE6] transition-colors">Demand</Link>
        <Link to="/replenishment" className="hover:text-[#005CE6] transition-colors">Replenishment</Link>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/intelligence')}
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#F6EEDB] hover:bg-[#EFE4CF] text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-[#EBDDC6] transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Model Audit</span>
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-[#005CE6] hover:bg-[#004EC2] text-white font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-[#005CE6]/25 transition-all cursor-pointer flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Launch Command Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </nav>
  );
}
