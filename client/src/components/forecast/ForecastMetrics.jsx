import React from 'react';
import { Card } from '../ui/Card';
import { Cpu, CheckCircle2, Award } from 'lucide-react';

export function ForecastMetrics({ metrics }) {
  const stats = [
    { label: 'R² Accuracy', value: '93.32%', desc: 'Variance explained on test partition', highlight: 'text-[#0071CE]' },
    { label: 'WAPE', value: '13.49%', desc: 'Weighted absolute percentage error', highlight: 'text-emerald-700' },
    { label: 'MAE', value: '27.91', desc: 'Mean absolute error in unit demand', highlight: 'text-slate-900' },
    { label: 'RMSE', value: '45.37', desc: 'Root mean squared unit deviation', highlight: 'text-slate-900' },
    { label: 'MAPE', value: '13.66%', desc: 'Mean absolute percentage error', highlight: 'text-slate-900' }
  ];

  return (
    <Card className="mb-6 bg-gradient-to-r from-white via-white to-blue-50/40 border border-[#EAE6DF]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0071CE] text-white flex items-center justify-center shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">
                Final Demand Model: Random Forest Regressor
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                PERMITTED • AUDITED
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified in Task 2.5 Audit • Evaluated on holdout test partition (2026-01-20 to 2026-01-31)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-[#0071CE] flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            IntelliData Compliant
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
        {stats.map((s, i) => (
          <div key={i} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</span>
            <div className={`text-2xl font-black mt-0.5 ${s.highlight}`}>{s.value}</div>
            <div className="text-[10px] text-slate-500 font-medium leading-tight mt-1">{s.desc}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
