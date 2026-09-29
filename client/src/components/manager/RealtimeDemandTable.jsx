import React from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export function RealtimeDemandTable({ products = [], onSelectForAIForecast }) {
  return (
    <div className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBDDC6]">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#EA7A18]" />
            Real-Time SKU Demand & Stock Drain
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Tracks physical unit burn from real-time customer and department orders.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#EBDDC6] text-[11px] font-black uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-3">Product / SKU</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-right">Initial Stock</th>
              <th className="py-3 px-3 text-right">Ordered Today</th>
              <th className="py-3 px-3 text-right">Remaining</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Model Forecast</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBDDC6]/60">
            {products.map((p) => {
              const isCritical = p.risk_level === 'CRITICAL' || p.remaining_inventory <= 5;
              const isHigh = p.risk_level === 'HIGH' || p.units_ordered_today >= 15;

              return (
                <tr key={p.product_id} className="hover:bg-[#F6EEDB]/60 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-black text-slate-900 leading-snug">{p.product_name}</div>
                    <span className="font-mono text-[10px] text-slate-500">{p.product_id}</span>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-600">
                    {p.department || p.category}
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-slate-700">
                    {p.current_inventory}u
                  </td>

                  <td className="py-3.5 px-3 text-right font-black text-[#EA7A18]">
                    {p.units_ordered_today > 0 ? `-${p.units_ordered_today}u` : '0u'}
                  </td>

                  <td className="py-3.5 px-3 text-right font-black">
                    <span className={isCritical ? 'text-red-600' : isHigh ? 'text-amber-700' : 'text-slate-900'}>
                      {p.remaining_inventory}u
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black border border-red-300">
                        CRITICAL DRAIN
                      </span>
                    ) : isHigh ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                        HIGH ACCEL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        SUFFICIENT
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onSelectForAIForecast(p.product_id)}
                      className="inline-flex items-center gap-1.5 bg-[#005CE6] hover:bg-[#004BB8] text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>AI Model Forecast</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
