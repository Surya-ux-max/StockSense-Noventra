import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatPercent, formatUnits } from '../../utils/formatters';
import { ArrowRight, Sparkles } from 'lucide-react';

export function RiskTable({ items = [] }) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeader>Risk Status</TableHeader>
          <TableHeader>Store</TableHeader>
          <TableHeader>Product & SKU</TableHeader>
          <TableHeader className="text-right">Current Inv</TableHeader>
          <TableHeader className="text-right">Incoming (DC)</TableHeader>
          <TableHeader className="text-right">7D Demand</TableHeader>
          <TableHeader className="text-right">Stock-Out Prob</TableHeader>
          <TableHeader className="text-right">Recommended</TableHeader>
          <TableHeader className="text-center">Action</TableHeader>
        </tr>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.id || item.product_id}
            onClick={() => navigate(`/item/${item.product_id}`)}
            className="group"
          >
            {/* Risk Badge */}
            <TableCell>
              <RiskBadge level={item.risk_level} size="sm" />
            </TableCell>

            {/* Store */}
            <TableCell>
              <div className="font-bold text-slate-800">{item.store_id}</div>
              <div className="text-[11px] text-slate-400 font-medium">{item.store_name?.split('-')[1]?.trim() || 'Store'}</div>
            </TableCell>

            {/* Product & SKU */}
            <TableCell>
              <div className="font-extrabold text-slate-900 group-hover:text-[#0071CE] transition-colors">
                {item.product_name}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-mono bg-slate-100 px-1 rounded text-[11px] text-slate-600">
                  {item.product_id}
                </span>
                <span>•</span>
                <span>{item.department}</span>
                <span>•</span>
                <span>{item.category}</span>
              </div>
            </TableCell>

            {/* Current Inventory */}
            <TableCell className="text-right">
              <span className={`font-black ${item.current_inventory < 50 ? 'text-red-600' : 'text-slate-800'}`}>
                {item.current_inventory}
              </span>
            </TableCell>

            {/* Incoming */}
            <TableCell className="text-right">
              <span className="text-slate-600 font-semibold">
                {item.incoming_inventory > 0 ? `+${item.incoming_inventory}` : '0'}
              </span>
            </TableCell>

            {/* 7-Day Demand */}
            <TableCell className="text-right font-black text-slate-900">
              {item.predicted_7_day_demand}
            </TableCell>

            {/* Stock-out Probability */}
            <TableCell className="text-right">
              <div className="font-black text-slate-900">
                {formatPercent(item.stockout_probability)}
              </div>
              <div className="w-16 h-1.5 rounded-full bg-slate-100 ml-auto mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.risk_level === 'HIGH' ? 'bg-red-500' : item.risk_level === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(item.stockout_probability * 100, 100)}%` }}
                />
              </div>
            </TableCell>

            {/* Recommended Order */}
            <TableCell className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-[#0071CE] font-black text-xs">
                {formatUnits(item.recommended_order_qty)}
              </span>
            </TableCell>

            {/* CTA */}
            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/item/${item.product_id}`)}
                className="hover:bg-[#0071CE] hover:text-white hover:border-[#0071CE] transition-all"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
