import React from 'react';
import { Card } from '../ui/Card';
import { Store, TrendingUp, AlertCircle, PackageCheck, ArrowRight } from 'lucide-react';
import { formatCompact } from '../../utils/formatters';

export function StoreCard({ store, onSelectStore }) {
  const isHealthy = store.inventoryHealthScore >= 85;

  return (
    <Card hover onClick={() => onSelectStore(store.store_id)} className="flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0071CE] flex items-center justify-center font-black text-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {store.store_id}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {store.city}, {store.state} • {store.store_type}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-base font-black ${isHealthy ? 'text-emerald-700' : 'text-amber-800'}`}>
              {store.inventoryHealthScore}%
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Health Score</div>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF] text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">7D Demand</span>
            <div className="font-black text-slate-800 text-sm mt-0.5">
              {formatCompact(store.sevenDayDemand)} units
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">High Risk SKUs</span>
            <div className="font-black text-red-600 text-sm mt-0.5">
              {store.highRiskCount} SKUs
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Medium Risk</span>
            <div className="font-black text-amber-800 text-sm mt-0.5">
              {store.medRiskCount} SKUs
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Replenishment</span>
            <div className="font-black text-[#0071CE] text-sm mt-0.5">
              {store.replenishmentOrdersCount} orders
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0071CE]">
        <span>Focus Store Operations</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Card>
  );
}
