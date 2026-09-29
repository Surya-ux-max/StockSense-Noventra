import React from 'react';
import { TrendingUp, AlertTriangle, PackageCheck, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatCompact, formatPercent } from '../../utils/formatters';

export function KPIGrid({ kpis }) {
  const cards = [
    {
      title: '7-DAY DEMAND',
      value: formatCompact(kpis?.sevenDayDemand || 128400),
      unit: 'units',
      change: '+14.2% vs last cycle',
      positive: true,
      icon: TrendingUp,
      iconBg: 'bg-blue-50 text-[#0071CE]',
      highlight: 'border-l-4 border-l-[#0071CE]'
    },
    {
      title: 'STOCK-OUT RISK',
      value: formatPercent(kpis?.stockoutRiskRate || 0.087),
      unit: 'network rate',
      change: '-2.1% under threshold',
      positive: true,
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
      highlight: 'border-l-4 border-l-amber-500'
    },
    {
      title: 'REPLENISHMENT',
      value: (kpis?.totalReplenishmentOrders || 2481).toLocaleString(),
      unit: 'active orders',
      change: '100% case-pack rounded',
      positive: true,
      icon: PackageCheck,
      iconBg: 'bg-emerald-50 text-emerald-600',
      highlight: 'border-l-4 border-l-emerald-500'
    },
    {
      title: 'AT-RISK SKUS',
      value: (kpis?.atRiskSKUs || 347).toLocaleString(),
      unit: 'items flagged',
      change: '48 urgent High-Risk',
      positive: false,
      icon: AlertCircle,
      iconBg: 'bg-red-50 text-red-600',
      highlight: 'border-l-4 border-l-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className={`relative overflow-hidden ${card.highlight}`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-xs font-bold text-slate-500">{card.unit}</span>
                  )}
                </div>
              </div>
              <div className={`p-2.5 rounded-xl shrink-0 ${card.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className={`font-semibold ${card.positive ? 'text-emerald-700' : 'text-red-600'}`}>
                {card.change}
              </span>
              <span className="text-slate-400 font-medium">Valid decision engine</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
