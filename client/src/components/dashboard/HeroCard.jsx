import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

export function HeroCard({ currentStore = 'WMT_CA_006', topAction, onReviewCritical }) {
  const navigate = useNavigate();

  const item = topAction || {
    product_id: 'PRD_0043',
    product_name: 'Sprite Lemon Lime Soda (12 pk)',
    category: 'Beverages',
    department: 'Beverages',
    store_id: currentStore,
    current_inventory: 16,
    predicted_7_day_demand: 342,
    recommended_order_qty: 156,
    stockout_probability: 0.726,
    manager_action: 'Low coverage buffer requires replenishment order.'
  };

  const probPercent = (item.stockout_probability * 100).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#004F9A] via-[#0071CE] to-[#005EA6] p-8 md:p-10 text-white shadow-[0_12px_30px_rgba(0,113,206,0.25)] mb-8">
      {/* Decorative background grid and accent */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 -mb-12 w-64 h-64 rounded-full bg-[#FF6600]/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Bold headline & Action */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold tracking-wide uppercase text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6600]" />
            <span>Store Operations • {currentStore}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
            Know What Needs Attention.<br />
            <span className="text-[#FFE58F]">Act Before It Runs Out.</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-50/90 font-medium max-w-xl leading-relaxed">
            StockSense forecasts 7-day demand, flags critical stock-out probabilities, and validates case-pack replenishment orders before shelves go empty.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="orange"
              size="lg"
              onClick={onReviewCritical || (() => navigate('/risk'))}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="font-black shadow-lg shadow-[#FF6600]/30"
            >
              Review Critical SKUs
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/replenishment')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
            >
              Open Replenishment Queue
            </Button>
          </div>
        </div>

        {/* Right Side: Floating High-Priority Risk Card */}
        <div className="lg:col-span-5 flex justify-end">
          <div className="w-full max-w-md bg-[#FCF8EE] text-slate-900 rounded-3xl p-6 shadow-2xl border border-[#EBDDC6] space-y-4 transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBDDC6]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Immediate Action Required</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300 text-xs font-black">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                HIGH RISK • {probPercent}%
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-[#005CE6] uppercase">{item.department || item.category} • {item.product_id}</div>
              <h3 className="text-lg font-black text-slate-900 leading-snug">{item.product_name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{item.store_id} — Critical Decision Output</p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#F6EEDB] rounded-2xl border border-[#EBDDC6] text-center">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">On-Hand</div>
                <div className="text-base font-black text-red-600">{item.current_inventory}</div>
              </div>
              <div className="border-x border-[#EBDDC6]">
                <div className="text-[11px] font-bold text-slate-500 uppercase">7D Demand</div>
                <div className="text-base font-black text-slate-900">{item.predicted_7_day_demand}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Order</div>
                <div className="text-base font-black text-[#005CE6]">{item.recommended_order_qty} units</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              <strong className="text-slate-900">Action:</strong> {item.manager_action || 'Review and expedite replenishment transfer.'}
            </p>

            <button
              onClick={() => navigate(`/item/${item.product_id}`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Review Item Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
