import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShieldCheck, Bell, Sparkles } from 'lucide-react';
import { StoreSelector } from './StoreSelector';

export function Topbar({ onMenuClick, currentStore, onChangeStore }) {
  return (
    <header className="sticky top-0 z-20 bg-[#FCF8EE]/90 backdrop-blur-md border-b border-[#EBDDC6] px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile toggle & Store Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl border border-[#EBDDC6] hover:bg-[#F6EEDB] text-slate-700 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <StoreSelector currentStore={currentStore} onChangeStore={onChangeStore} />

          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-xs font-bold text-emerald-900">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Validated RF Models Active</span>
          </div>

          <Link
            to="/store"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6EEDB] hover:bg-[#EFE4CF] border border-[#EBDDC6] text-xs font-black text-slate-800 transition-colors"
          >
            <span>🛒 Store Portal</span>
          </Link>

          <Link
            to="/manager"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#005CE6] hover:bg-[#004EC2] text-white text-xs font-black shadow-xs transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>⚡ Manager Live Demand</span>
          </Link>
        </div>

        {/* Right Side: Operational Status */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-black text-slate-900">Walmart Retail Ops</span>
            <span className="text-[11px] text-slate-600 font-medium">Fiscal Week 13 • 7-Day Cycle</span>
          </div>

          <div className="h-4 w-px bg-[#EBDDC6] hidden lg:block" />

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-[#F6EEDB] transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EA7A18]" />
            </button>

            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-[#005CE6] text-white flex items-center justify-center font-black text-xs shadow-xs">
                W
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
