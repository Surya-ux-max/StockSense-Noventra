import React from 'react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import { RiskBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatUnits } from '../../utils/formatters';
import { Check, Truck, ArrowRight } from 'lucide-react';

export function ReplenishmentTable({ items = [], onReviewItem, onQuickApprove }) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeader className="w-16">Priority</TableHeader>
          <TableHeader>Store</TableHeader>
          <TableHeader>Product & SKU</TableHeader>
          <TableHeader className="text-right">Current Inv</TableHeader>
          <TableHeader className="text-right">In-Transit</TableHeader>
          <TableHeader className="text-right">7D Forecast</TableHeader>
          <TableHeader>Risk</TableHeader>
          <TableHeader className="text-right">Recommended</TableHeader>
          <TableHeader className="text-right">Case Pack</TableHeader>
          <TableHeader className="text-center">Action</TableHeader>
        </tr>
      </TableHead>
      <TableBody>
        {items.map((item, idx) => (
          <TableRow key={item.id || item.product_id} onClick={() => onReviewItem(item)}>
            {/* Priority */}
            <TableCell>
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                item.risk_level === 'HIGH' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-800'
              }`}>
                #{idx + 1}
              </span>
            </TableCell>

            {/* Store */}
            <TableCell>
              <div className="font-bold text-slate-800">{item.store_id}</div>
              <div className="text-[11px] text-slate-400 font-medium">Supercenter</div>
            </TableCell>

            {/* Product */}
            <TableCell>
              <div className="font-black text-slate-900">{item.product_name}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-mono bg-slate-100 px-1 rounded text-[11px] text-slate-600">
                  {item.product_id}
                </span>
                <span>•</span>
                <span>{item.category}</span>
              </div>
            </TableCell>

            {/* Current Inventory */}
            <TableCell className="text-right">
              <span className={`font-black ${item.current_inventory < 30 ? 'text-red-600' : 'text-slate-800'}`}>
                {item.current_inventory}
              </span>
            </TableCell>

            {/* Incoming */}
            <TableCell className="text-right">
              <span className="text-slate-600 font-semibold">
                {item.incoming_inventory || 0}
              </span>
            </TableCell>

            {/* 7D Forecast */}
            <TableCell className="text-right font-black text-slate-900">
              {item.predicted_7_day_demand}
            </TableCell>

            {/* Risk */}
            <TableCell>
              <RiskBadge level={item.risk_level} size="sm" />
            </TableCell>

            {/* Recommended Order */}
            <TableCell className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-orange-50 text-[#FF6600] font-black text-xs">
                {item.recommended_order_qty} units
              </span>
            </TableCell>

            {/* Case Pack */}
            <TableCell className="text-right font-medium text-slate-600">
              {item.case_packs_to_order || Math.ceil(item.recommended_order_qty / (item.case_pack_qty || 12))} cs ({item.case_pack_qty || 12}/pk)
            </TableCell>

            {/* Action */}
            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
              {item.status === 'APPROVED' ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <Check className="w-3.5 h-3.5" />
                  Dispatched
                </span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onReviewItem(item)}
                  >
                    Review
                  </Button>
                  <Button
                    variant="orange"
                    size="sm"
                    onClick={() => onQuickApprove(item.id)}
                    icon={<Truck className="w-3.5 h-3.5" />}
                  >
                    Approve
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
