import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { RiskBadge } from '../ui/Badge';
import { Package, Truck, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ReplenishmentRecommendation({ item }) {
  const navigate = useNavigate();
  const [approved, setApproved] = useState(false);

  const casePack = item.case_pack_qty || 12;
  const cases = Math.ceil(item.recommended_order_qty / casePack);

  return (
    <Card className="border-2 border-[#0071CE]/30 shadow-md">
      <CardHeader
        title="Validated Replenishment Recommendation"
        subtitle="Automated inventory replenishment recommendation from the verified decision engine"
        badge={
          <span className="px-2.5 py-0.5 rounded-full bg-[#0071CE] text-white text-xs font-black">
            Action Ready
          </span>
        }
      />

      <div className="bg-[#F6EEDB] rounded-3xl border border-[#EBDDC6] p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Large Recommendation Hero */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recommended DC Order
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {item.recommended_order_qty}
              </span>
              <span className="text-lg font-bold text-slate-500">units</span>
              <span className="text-base font-black text-[#FF6600]">
                ({cases} cases × {casePack}/pk)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Rounded to supplier master case-pack constraints to prevent partial case demurrage.
            </p>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            {approved ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md">
                <Check className="w-5 h-5" />
                <span>Replenishment Order Approved!</span>
              </div>
            ) : (
              <Button
                variant="orange"
                size="lg"
                onClick={() => setApproved(true)}
                icon={<Truck className="w-5 h-5" />}
                className="font-black text-sm shadow-lg shadow-[#FF6600]/25"
              >
                Approve & Dispatch Order
              </Button>
            )}
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/replenishment')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Open Full Queue
            </Button>
          </div>
        </div>

        {/* 5 Balance Factors */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-200">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Case Pack</div>
            <div className="text-sm font-black text-slate-800 mt-0.5">{casePack} units/cs</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Current Stock</div>
            <div className="text-sm font-black text-slate-800 mt-0.5">{item.current_inventory} units</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">In-Transit</div>
            <div className="text-sm font-black text-slate-800 mt-0.5">{item.incoming_inventory || 0} units</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">7D Forecast</div>
            <div className="text-sm font-black text-slate-800 mt-0.5">{item.predicted_7_day_demand} units</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Risk Level</div>
            <div className="mt-0.5">
              <RiskBadge level={item.risk_level} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Store Manager Approved Protocol */}
      <div className="bg-[#FCF8EE] rounded-2xl border border-[#EBDDC6] p-4 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-blue-50 text-[#0071CE] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#0071CE] uppercase tracking-wider">
            Approved Store Manager Operational Directive
          </div>
          <p className="text-sm font-bold text-slate-900 mt-1">
            "{item.manager_action || 'Raise replenishment order immediately; request expedited DC transfer.'}"
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-assigned to Shift Lead • Distribution Center: WMT_DC_CA01 • Routing Priority: High
          </p>
        </div>
      </div>
    </Card>
  );
}
