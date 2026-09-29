import React from 'react';
import { Card } from '../ui/Card';
import { DollarSign, ShoppingCart, ShieldCheck, Clock, Percent } from 'lucide-react';

export function OperationalSummary({ kpis }) {
  const metrics = [
    {
      label: 'Total Network Revenue',
      value: kpis?.totalNetworkRevenue || '$2,520,443.08',
      desc: 'Validated cycle sales volume',
      icon: DollarSign,
      color: 'text-emerald-700 bg-emerald-50'
    },
    {
      label: 'Units Sold (Network)',
      value: kpis?.totalUnitsSold || '418,195',
      desc: 'Total scan volume across stores',
      icon: ShoppingCart,
      color: 'text-[#0071CE] bg-blue-50'
    },
    {
      label: 'Estimated Lost Sales Value',
      value: kpis?.lostSalesValue || '$85,169.30',
      desc: 'Target for replenishment mitigation',
      icon: ShieldCheck,
      color: 'text-amber-800 bg-amber-50'
    },
    {
      label: 'Average Days of Inventory',
      value: `${kpis?.avgDaysOfInventory || 2.3} Days`,
      desc: 'Lean lean-inventory target (< 3 days)',
      icon: Clock,
      color: 'text-slate-800 bg-slate-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <div
            key={i}
            className="bg-[#FCF8EE] rounded-2xl border border-[#EBDDC6] p-4 flex items-center gap-3.5 shadow-xs"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.label}</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">{m.value}</div>
              <div className="text-[11px] text-slate-500 font-medium">{m.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
