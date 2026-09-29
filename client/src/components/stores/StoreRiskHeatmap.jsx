import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../ui/Table';
import { RiskBadge } from '../ui/Badge';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export function StoreRiskHeatmap({ heatmapData = [], onStoreDeptClick }) {
  const stores = ['WMT_CA_006', 'WMT_TX_010', 'WMT_TX_013', 'WMT_NY_031', 'WMT_CA_001'];
  const depts = ['Beverages', 'Dairy', 'Grocery', 'Snacks', 'Frozen'];

  const getCell = (storeId, dept) => {
    return heatmapData.find(h => h.store_id === storeId && h.department === dept) || {
      risk: 'LOW',
      highCount: 0
    };
  };

  const cellColors = {
    HIGH: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    MEDIUM: 'bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200',
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
  };

  return (
    <Card className="mb-8">
      <CardHeader
        title="Store × Department Risk Heatmap"
        subtitle="Cross-sectional vulnerability matrix mapping critical stockout exposure"
        action={
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-red-700">
              <span className="w-3 h-3 rounded bg-red-400" /> High Risk
            </span>
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-3 h-3 rounded bg-amber-300" /> Medium Risk
            </span>
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3 h-3 rounded bg-emerald-400" /> Low Risk
            </span>
          </div>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left font-bold text-xs uppercase text-slate-500 bg-[#FAF8F5] rounded-l-xl">
                Store ID
              </th>
              {depts.map(d => (
                <th key={d} className="p-3 font-bold text-xs uppercase text-slate-500 bg-[#FAF8F5]">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stores.map(storeId => (
              <tr key={storeId} className="hover:bg-slate-50/50">
                <td className="p-3 text-left font-bold text-slate-900 text-xs">
                  {storeId}
                </td>
                {depts.map(dept => {
                  const cell = getCell(storeId, dept);
                  return (
                    <td key={dept} className="p-2">
                      <div
                        onClick={() => onStoreDeptClick && onStoreDeptClick(storeId, dept)}
                        className={`py-2 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer shadow-2xs ${cellColors[cell.risk]}`}
                        title={`${storeId} - ${dept}: ${cell.risk} Risk (${cell.highCount} SKUs)`}
                      >
                        {cell.risk}
                        {cell.highCount > 0 && (
                          <span className="block text-[10px] font-bold opacity-80">
                            {cell.highCount} SKUs
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
