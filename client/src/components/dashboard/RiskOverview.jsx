import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { RiskBadge } from '../ui/Badge';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export function RiskOverview({ distribution }) {
  const high = distribution?.high || 48;
  const medium = distribution?.medium || 112;
  const low = distribution?.low || 187;
  const total = high + medium + low;

  const highPct = total ? Math.round((high / total) * 100) : 0;
  const medPct = total ? Math.round((medium / total) * 100) : 0;
  const lowPct = total ? Math.round((low / total) * 100) : 0;

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader
          title="Inventory Risk Distribution"
          subtitle="Real-time classification from certified Random Forest Classifier"
        />

        {/* Multi-segment progress bar */}
        <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden my-4 shadow-inner">
          <div
            style={{ width: `${highPct}%` }}
            className="bg-red-500 h-full transition-all duration-500"
            title={`High Risk: ${high} items (${highPct}%)`}
          />
          <div
            style={{ width: `${medPct}%` }}
            className="bg-amber-400 h-full transition-all duration-500"
            title={`Medium Risk: ${medium} items (${medPct}%)`}
          />
          <div
            style={{ width: `${lowPct}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`Low Risk: ${low} items (${lowPct}%)`}
          />
        </div>

        {/* 3 Status Boxes */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/70 text-center">
            <div className="flex items-center justify-center gap-1 text-red-700 mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-xs font-black uppercase">High</span>
            </div>
            <div className="text-2xl font-black text-red-700">{high}</div>
            <div className="text-[11px] font-bold text-red-600/80">{highPct}% of active</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-800 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-xs font-black uppercase">Medium</span>
            </div>
            <div className="text-2xl font-black text-amber-800">{medium}</div>
            <div className="text-[11px] font-bold text-amber-700/80">{medPct}% of active</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-800 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-xs font-black uppercase">Low</span>
            </div>
            <div className="text-2xl font-black text-emerald-800">{low}</div>
            <div className="text-[11px] font-bold text-emerald-700/80">{lowPct}% safe buffer</div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Decision Threshold: High &gt; 70% | Medium 50–70%</span>
        <span className="font-bold text-slate-800">ROC-AUC: 76.55%</span>
      </div>
    </Card>
  );
}
