import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, ShoppingBag, ShieldAlert } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function PriorityActions({ items = [] }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#FF6600]" />
            Priority Operational Actions
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Highest-priority stock-out risks requiring immediate replenishment or DC expedited transfer.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/risk')}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
        >
          View All At-Risk SKUs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item) => (
          <Card
            key={item.id || item.product_id}
            hover
            onClick={() => navigate(`/item/${item.product_id}`)}
            className="flex flex-col justify-between border-slate-200 hover:border-[#0071CE]/40"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {item.store_id} • {item.department || item.category}
                    </span>
                    <span className="text-xs font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {item.product_id}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {item.product_name}
                  </h3>
                </div>
                <RiskBadge
                  level={item.risk_level}
                  showProbability
                  probability={item.stockout_probability}
                />
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#F6EEDB] rounded-2xl border border-[#EBDDC6] mb-4 text-center">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">On-Hand</span>
                  <p className="text-base font-black text-red-600 mt-0.5">
                    {item.current_inventory}
                  </p>
                </div>
                <div className="border-x border-[#EBDDC6]">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">7D Forecast</span>
                  <p className="text-base font-black text-slate-900 mt-0.5">
                    {item.predicted_7_day_demand}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Recommended</span>
                  <p className="text-base font-black text-[#005CE6] mt-0.5">
                    {item.recommended_order_qty} units
                  </p>
                </div>
              </div>

              {/* Explainability reason */}
              <div className="text-xs font-medium text-slate-600 bg-amber-50/60 border border-amber-200/60 rounded-lg p-2.5 mb-4">
                <span className="font-bold text-amber-900">Why at risk: </span>
                {item.primary_reason || item.top_driver_1}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {item.manager_action ? 'Expedited DC Action' : 'Action ready'}
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/item/${item.product_id}`);
                }}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Review Intelligence
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
