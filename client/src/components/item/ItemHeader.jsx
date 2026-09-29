import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, MapPin, Building2, Package } from 'lucide-react';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function ItemHeader({ item }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-[#EAE6DF] p-6 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back button + Title */}
        <div className="space-y-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inventory Risk</span>
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white uppercase tracking-wider">
              {item.product_id}
            </span>
            <span className="text-xs font-semibold text-slate-400">|</span>
            <span className="text-xs font-bold text-[#0071CE] uppercase tracking-wide">
              {item.department} • {item.category}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {item.product_name}
          </h1>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              SKU: <strong className="text-slate-700">{item.sku || 'SKU-0043-BEV-SPR'}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Store: <strong className="text-slate-700">{item.store_id} ({item.store_name?.split('-')[1]?.trim() || 'Store'})</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              Brand: <strong className="text-slate-700">{item.brand || 'National Brand'}</strong>
            </span>
          </div>
        </div>

        {/* Right: Risk Badge & Stockout Probability Callout */}
        <div className="flex flex-col items-start md:items-end justify-center bg-[#F6EEDB] md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-[#EBDDC6]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Stock-Out Assessment</span>
          <div className="flex items-center gap-3">
            <RiskBadge level={item.risk_level} size="lg" />
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">
                {Math.round(item.stockout_probability * 10000) / 100}%
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Stock-out Prob</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
