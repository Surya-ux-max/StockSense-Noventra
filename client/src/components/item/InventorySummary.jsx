import React from 'react';
import { Card } from '../ui/Card';
import { Archive, TrendingUp, Truck, PackagePlus } from 'lucide-react';
import { formatUnits } from '../../utils/formatters';

export function InventorySummary({ item }) {
  const cards = [
    {
      title: 'CURRENT INVENTORY',
      value: item.current_inventory,
      unit: 'on-shelf units',
      status: item.current_inventory < 30 ? 'Critical Low (< 1 Day DOI)' : 'Active Stock',
      statusColor: item.current_inventory < 30 ? 'text-red-600 bg-red-50' : 'text-slate-600 bg-slate-100',
      icon: Archive,
      border: 'border-l-4 border-l-red-500'
    },
    {
      title: '7-DAY DEMAND',
      value: item.predicted_7_day_demand,
      unit: 'forecasted units',
      status: 'RF Regressor (93.3% R²)',
      statusColor: 'text-[#0071CE] bg-blue-50',
      icon: TrendingUp,
      border: 'border-l-4 border-l-[#0071CE]'
    },
    {
      title: 'IN TRANSIT',
      value: item.incoming_inventory || 0,
      unit: 'scheduled DC units',
      status: item.incoming_inventory > 0 ? 'Delivery within 48h' : 'No shipments scheduled',
      statusColor: item.incoming_inventory > 0 ? 'text-amber-800 bg-amber-50' : 'text-slate-500 bg-slate-100',
      icon: Truck,
      border: 'border-l-4 border-l-amber-500'
    },
    {
      title: 'RECOMMENDED ORDER',
      value: item.recommended_order_qty,
      unit: 'units to order',
      status: `${Math.ceil(item.recommended_order_qty / (item.case_pack_qty || 12))} Cases (Pack: ${item.case_pack_qty || 12})`,
      statusColor: 'text-white bg-[#FF6600]',
      icon: PackagePlus,
      border: 'border-l-4 border-l-[#FF6600]'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className={`p-5 ${c.border}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {c.title}
              </span>
              <Icon className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {c.value}
              </span>
              <span className="text-xs font-semibold text-slate-500">{c.unit}</span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100">
              <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${c.statusColor}`}>
                {c.status}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
