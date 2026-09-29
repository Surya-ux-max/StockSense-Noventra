import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-[#F6EEDB] border-t border-[#EBDDC6] py-12 px-6 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#005CE6] flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 fill-white/20 text-[#FFDD55]" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">Walmart StockSense</div>
            <div className="text-xs text-slate-500 font-medium">Intelligent Retail Inventory Decision-Support System</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold text-slate-700 flex-wrap justify-center">
          <Link to="/dashboard" className="hover:text-[#005CE6] transition-colors">Command Center</Link>
          <Link to="/risk" className="hover:text-[#005CE6] transition-colors">Inventory Risk</Link>
          <Link to="/forecast" className="hover:text-[#005CE6] transition-colors">Demand Intelligence</Link>
          <Link to="/replenishment" className="hover:text-[#005CE6] transition-colors">Replenishment Queue</Link>
          <Link to="/stores" className="hover:text-[#005CE6] transition-colors">Store Nodes</Link>
          <Link to="/intelligence" className="hover:text-[#005CE6] transition-colors">Model Certification</Link>
        </div>

        <div className="text-xs text-slate-500 text-center md:text-right font-medium">
          Built for IntelliData 2026 Hackathon • Production Decision System
        </div>
      </div>
    </footer>
  );
}
