import React from 'react';
import { Card } from '../ui/Card';
import { PackageCheck, AlertCircle, AlertTriangle, Truck } from 'lucide-react';
import { formatUnits } from '../../utils/formatters';

export function OrderSummary({ summary }) {
  const cards = [
    {
      title: 'TOTAL ORDERS QUEUED',
      value: summary?.totalOrders || 0,
      unit: 'replenishment orders',
      desc: 'Validated by decision engine',
      icon: PackageCheck,
      color: 'text-[#0071CE] bg-blue-50'
    },
    {
      title: 'TOTAL UNITS TO ORDER',
      value: formatUnits(summary?.totalUnits || 0),
      unit: '',
      desc: '100% case-pack rounded',
      icon: Truck,
      color: 'text-slate-900 bg-slate-100'
    },
    {
      title: 'CRITICAL HIGH-RISK ORDERS',
      value: summary?.criticalCount || 0,
      unit: 'immediate DC priority',
      desc: 'Stock-out probability > 70%',
      icon: AlertCircle,
      color: 'text-red-700 bg-red-50'
    },
    {
      title: 'MEDIUM RISK ORDERS',
      value: summary?.mediumCount || 0,
      unit: 'advance 48h schedule',
      desc: 'Stock-out probability 50–70%',
      icon: AlertTriangle,
      color: 'text-amber-800 bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {c.value}
              </span>
              {c.unit && <span className="text-xs font-semibold text-slate-500">{c.unit}</span>}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              {c.desc}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
