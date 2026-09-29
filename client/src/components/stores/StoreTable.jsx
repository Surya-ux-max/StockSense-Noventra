import React from 'react';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import { formatCompact } from '../../utils/formatters';
import { ArrowRight } from 'lucide-react';

export function StoreTable({ stores = [], onSelectStore }) {
  return (
    <Table>
      <TableHead>
        <tr>
          <TableHeader>Store ID</TableHeader>
          <TableHeader>Location</TableHeader>
          <TableHeader>Format</TableHeader>
          <TableHeader className="text-right">Health Score</TableHeader>
          <TableHeader className="text-right">7-Day Demand</TableHeader>
          <TableHeader className="text-right">High Risk</TableHeader>
          <TableHeader className="text-right">Med Risk</TableHeader>
          <TableHeader className="text-right">Replenishment Orders</TableHeader>
          <TableHeader className="text-center">Action</TableHeader>
        </tr>
      </TableHead>
      <TableBody>
        {stores.map((s) => (
          <TableRow key={s.store_id} onClick={() => onSelectStore(s.store_id)}>
            <TableCell className="font-black text-slate-900">{s.store_id}</TableCell>
            <TableCell className="font-semibold text-slate-700">{s.city}, {s.state}</TableCell>
            <TableCell className="text-xs text-slate-500 font-medium">{s.store_type}</TableCell>
            <TableCell className="text-right font-black">
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                s.inventoryHealthScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {s.inventoryHealthScore}%
              </span>
            </TableCell>
            <TableCell className="text-right font-bold text-slate-900">
              {formatCompact(s.sevenDayDemand)} units
            </TableCell>
            <TableCell className="text-right font-black text-red-600">
              {s.highRiskCount}
            </TableCell>
            <TableCell className="text-right font-bold text-amber-800">
              {s.medRiskCount}
            </TableCell>
            <TableCell className="text-right font-black text-[#0071CE]">
              {s.replenishmentOrdersCount}
            </TableCell>
            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onSelectStore(s.store_id)}
                className="text-xs font-bold text-[#0071CE] hover:text-[#005EA6] inline-flex items-center gap-1 cursor-pointer"
              >
                Inspect <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
