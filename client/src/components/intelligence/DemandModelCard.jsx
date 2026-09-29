import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Cpu, CheckCircle2 } from 'lucide-react';

export function DemandModelCard({ model }) {
  const metrics = [
    { label: 'R² Accuracy', value: '93.32%', note: 'Holdout test partition' },
    { label: 'WAPE', value: '13.49%', note: 'Weighted volume deviation' },
    { label: 'MAE', value: '27.91', note: 'Mean absolute unit error' },
    { label: 'RMSE', value: '45.37', note: 'Root mean squared error' },
    { label: 'MAPE', value: '13.66%', note: 'Mean absolute percentage' }
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071CE] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  {model?.algorithm || 'Random Forest Regressor'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  PERMITTED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Task: 7-Day Demand Forecasting</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
          Replaces non-permitted gradient boosting algorithms. Certified under IntelliData 2026 hackathon algorithm guidelines. Evaluated across all 37 Walmart store nodes.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {metrics.map((m, i) => (
            <div key={i} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
              <div className="text-xl font-black text-slate-900 mt-0.5">{m.value}</div>
              <div className="text-[10px] text-slate-500 font-medium">{m.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Artifact: demand_model_random_forest.pkl</span>
        <span className="text-emerald-700 font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Validated in Notebook 07
        </span>
      </div>
    </Card>
  );
}
