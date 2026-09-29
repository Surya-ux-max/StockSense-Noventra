import React from 'react';
import { Activity, Sparkles, Store, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { STORES_LIST } from '../../utils/constants';

export function ManagerHeader({
  selectedStore,
  onChangeStore,
  totalOrders = 0,
  totalUnits = 0,
  impactedSkus = 0,
  onRefresh
}) {
  return (
    <div className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-Time Model Stream Active
            </span>
            <span className="text-xs font-bold text-slate-500">
              Demand Forecasting Models Online
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manager Real-Time Demand & Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Live order monitoring, inventory drain tracking, and predictive model forecasting for real-time store demand.
          </p>
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-2 bg-[#F6EEDB] border border-[#EBDDC6] rounded-2xl p-2 shrink-0">
          <Store className="w-4 h-4 text-[#005CE6] ml-2" />
          <select
            value={selectedStore}
            onChange={(e) => onChangeStore(e.target.value)}
            className="bg-transparent text-xs font-black text-slate-900 pr-4 py-1 focus:outline-none cursor-pointer"
          >
            {STORES_LIST.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.name} ({s.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#EBDDC6]">
        <div className="bg-[#F6EEDB] rounded-2xl p-4 border border-[#EBDDC6]">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            Real-Time Orders Today
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
            {totalOrders}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Logged in live stream</span>
        </div>

        <div className="bg-[#F6EEDB] rounded-2xl p-4 border border-[#EBDDC6]">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            Live Units Drained
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#EA7A18] mt-0.5">
            {totalUnits} <span className="text-sm font-bold text-slate-600">units</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Immediate store demand impact</span>
        </div>

        <div className="bg-[#F6EEDB] rounded-2xl p-4 border border-[#EBDDC6]">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">
            SKUs Under Active Drain
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#005CE6] mt-0.5">
            {impactedSkus} <span className="text-sm font-bold text-slate-600">SKUs</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Monitored for stock-out thresholds</span>
        </div>
      </div>
    </div>
  );
}
