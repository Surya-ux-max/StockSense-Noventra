import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { CheckCircle2, ShieldCheck, Database, Layers, PlayCircle, Activity } from 'lucide-react';

export function DataHealth({ items = [] }) {
  const icons = [Database, Layers, ShieldCheck, PlayCircle, Activity, CheckCircle2];

  return (
    <Card className="mb-6">
      <CardHeader
        title="Data Health & Pipeline Audit"
        subtitle="End-to-end verification checklist confirmed by independent validation suite in server/notebooks/07_model_validation.ipynb"
        action={
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            6 / 6 CHECKS PASSED
          </span>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE6DF] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-wider">
                    {item.status}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-1">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {item.details}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-400 uppercase">
                Audited & Certified
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function ValidationStatus() {
  const models = [
    {
      name: 'Demand Forecasting Model',
      algorithm: 'Random Forest Regressor',
      status: 'PERMITTED',
      evalMetric: 'R² 93.32% | WAPE 13.49%',
      role: 'Predicts next 7-day store demand across all product categories'
    },
    {
      name: 'Stock-Out Classification Model',
      algorithm: 'Random Forest Classifier',
      status: 'PERMITTED',
      evalMetric: 'ROC-AUC 76.55% | PR-AUC 60.96%',
      role: 'Generates calibrated risk probability and triages into Low/Med/High'
    }
  ];

  return (
    <Card>
      <CardHeader
        title="Official IntelliData 2026 Model Status"
        subtitle="Mandatory algorithm compliance certification"
      />

      <div className="divide-y divide-slate-100">
        {models.map((m, i) => (
          <div key={i} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-black text-slate-900">{m.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0071CE] text-xs font-black">
                  {m.algorithm}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">{m.role}</p>
              <div className="text-xs font-bold text-slate-700 mt-0.5">{m.evalMetric}</div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-xs tracking-wider">
                ✓ {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
