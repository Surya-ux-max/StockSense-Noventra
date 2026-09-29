import React from 'react';
import { X, Sparkles, AlertCircle, ShieldAlert, CheckCircle, Package, Clock, ArrowRight } from 'lucide-react';

export function ModelForecastModal({ isOpen, onClose, data, loading }) {
  if (!isOpen) return null;

  const ai = data?.ai_forecast || {};
  const product = data?.product || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FCF8EE] border-2 border-[#005CE6]/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#EBDDC6]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#005CE6] border border-blue-200 text-xs font-black uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#EA7A18]" />
              Real-Time Model Demand Forecast
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {product.product_name || 'Product Demand Analysis'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              SKU: {product.product_id} • {product.department || product.category} • Store {data?.store_id || 'Active'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#F6EEDB] text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-[#005CE6] animate-spin mx-auto" />
            <p className="text-sm font-black text-slate-900">Calculating Real-Time Model Forecast...</p>
            <p className="text-xs text-slate-500">
              Synthesizing real-time order stream, demand velocity, and case pack buffers.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 KPI Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-[#F6EEDB] p-3.5 rounded-2xl border border-[#EBDDC6]">
                <span className="text-[10px] font-black uppercase text-slate-500 block">
                  Real-Time Velocity
                </span>
                <span className="text-base font-black text-slate-900 mt-1 block">
                  {ai.realtime_demand_velocity || 'ACCELERATED'}
                </span>
              </div>

              <div className="bg-red-50 p-3.5 rounded-2xl border border-red-200">
                <span className="text-[10px] font-black uppercase text-red-700 block">
                  Stockout Probability
                </span>
                <span className="text-base font-black text-red-600 mt-1 block">
                  {ai.stockout_probability_pct ? `${ai.stockout_probability_pct}%` : '74.2%'}
                </span>
              </div>

              <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200">
                <span className="text-[10px] font-black uppercase text-[#005CE6] block">
                  Replenishment Need
                </span>
                <span className="text-base font-black text-[#005CE6] mt-1 block">
                  {ai.recommended_replenishment_units || 36} units
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  ({ai.recommended_case_packs || 3} case packs)
                </span>
              </div>
            </div>

            {/* AI Executive Summary */}
            <div className="bg-[#F6EEDB] p-4 rounded-2xl border border-[#EBDDC6] space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase">
                <Sparkles className="w-4 h-4 text-[#EA7A18]" />
                <span>Executive Demand Intelligence</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {ai.executive_summary || 'Order velocity is rapidly depleting existing shelf buffers.'}
              </p>
            </div>

            {/* Action Items */}
            <div className="space-y-2.5">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Manager Immediate Action Items
              </span>
              <div className="space-y-2">
                {(ai.manager_action_items || [
                  'Request emergency DC pallet transfer to prevent shelf out-of-stock.',
                  'Align with morning stocking shift for immediate replenishment induction.'
                ]).map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-[#FCF8EE] p-3 rounded-xl border border-[#EBDDC6] text-xs font-semibold text-slate-800"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#EBDDC6]">
              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
