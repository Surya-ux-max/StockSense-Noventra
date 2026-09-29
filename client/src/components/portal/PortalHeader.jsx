import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Activity, BarChart3, Store } from 'lucide-react';

export function PortalHeader({ activePortal = 'store', cartCount = 0, onOpenCart }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF5E8]/95 backdrop-blur-md border-b border-[#EBDDC6] px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand & Portal Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#005CE6] text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <span className="text-base font-black text-slate-900 tracking-tight block leading-tight">
                Walmart <span className="text-[#005CE6]">StockSense</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#EA7A18] block">
                Dual Portals
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Portal Switcher Tabs */}
        <nav className="flex items-center bg-[#F6EEDB] p-1 rounded-2xl border border-[#EBDDC6]">
          <Link
            to="/store"
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activePortal === 'store'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-[#EFE4CF]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#EA7A18]" />
            <span>Store Ordering</span>
          </Link>

          <Link
            to="/manager"
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activePortal === 'manager'
                ? 'bg-[#005CE6] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-[#EFE4CF]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manager Live Demand</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-[#EFE4CF] transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Analytics</span>
          </Link>
        </nav>

        {/* Right: Cart Button or Quick Action */}
        <div className="flex items-center gap-3">
          {activePortal === 'store' && (
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#EA7A18] hover:bg-[#D96B0D] text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cartCount})</span>
            </button>
          )}
          {activePortal === 'manager' && (
            <Link
              to="/store"
              className="flex items-center gap-2 bg-[#FCF8EE] border border-[#EBDDC6] hover:bg-[#F6EEDB] text-slate-900 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
            >
              <Store className="w-4 h-4 text-[#005CE6]" />
              <span className="hidden sm:inline">Order More SKUs</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
