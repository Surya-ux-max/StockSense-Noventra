import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { HelpCircle, AlertCircle, TrendingUp, Tag, ShieldAlert } from 'lucide-react';
import { formatDriver } from '../../utils/formatters';

export function ExplainabilityPanel({ reasons = [], topDrivers = [] }) {
  // Use structured reasons if provided, or format driver keys
  const displayReasons = reasons.length > 0 ? reasons : topDrivers.map((d, i) => ({
    code: `0${i + 1}`,
    title: formatDriver(d),
    description: `Primary feature coefficient contributing to stock-out probability threshold for this SKU.`
  }));

  const icons = [AlertCircle, TrendingUp, Tag];

  return (
    <Card className="mb-6">
      <CardHeader
        title="Why Is This SKU At Risk?"
        subtitle="Key causal feature drivers identified by the certified StockSense decision model"
        badge={
          <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            Decision Engine Explainability
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {displayReasons.map((reason, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div
              key={index}
              className="bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-[#0071CE]/80 font-mono">
                    {reason.code || `0${index + 1}`}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#EAE6DF] flex items-center justify-center text-slate-700 shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 mb-1.5 leading-snug">
                  {reason.title}
                </h4>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {reason.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Impact Factor: High
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
