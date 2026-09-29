import React from 'react';
import { Card } from '../ui/Card';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export function StockoutModelCard({ model }) {
  const metrics = [
    { label: 'ROC-AUC', value: '76.55%', note: 'Holdout test discrimination' },
    { label: 'PR-AUC', value: '60.96%', note: 'Precision-recall area' },
    { label: 'Accuracy', value: '73.60%', note: 'Binary threshold @ 0.50' },
    { label: 'F1 Score', value: '57.19%', note: 'Harmonic mean P & R' },
    { label: 'Recall', value: '55.63%', note: 'Stock-out capture rate' },
    { label: 'Brier Score', value: '0.1811', note: 'Calibrated probability error' }
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6600] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  {model?.algorithm || 'Random Forest Classifier'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  PERMITTED
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Task: Stock-Out Probability & Risk Classification</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
          Predicts continuous stock-out probabilities (0.0 to 1.0) and assigns operational risk triage levels: High (&gt; 70%), Medium (50–70%), and Low (&lt; 50%).
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
        <span>Artifact: stockout_model_random_forest.pkl</span>
        <span className="text-emerald-700 font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Zero Data Leakage Confirmed
        </span>
      </div>
    </Card>
  );
}
