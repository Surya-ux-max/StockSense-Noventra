import React from 'react';
import { Card } from '../ui/Card';
import { ShieldCheck, Award, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

export function ValidationStats() {
  const stats = [
    { label: 'Demand Forecasting R²', value: '93.32%', note: 'Random Forest Regressor holdout test partition' },
    { label: 'Stock-Out Risk ROC-AUC', value: '76.55%', note: 'Random Forest Classifier discrimination' },
    { label: 'Network Sales Modeled', value: '$2.52M', note: '418,195 unit scan volume validated' },
    { label: 'Verified Grain Rows', value: '15,000', note: 'Date × Store × Product time-aware dataset' }
  ];

  return (
    <section id="models" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#004F9A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0071CE]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-black uppercase tracking-wider text-emerald-400 border border-white/10">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>IntelliData 2026 Model Certification</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Backed by Rigorous Retail ML Validation
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed">
            All models were evaluated using time-aware train/val/test splits without lookahead leakage. Fully compliant with official IntelliData algorithm mandates.
          </p>
        </div>

        {/* 4 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-1.5"
            >
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</div>
              <div className="text-3xl sm:text-4xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-300 font-medium leading-snug">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-300 relative z-10">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Independent Python Inference Notebook 07 Passed All Criteria</span>
          </div>
          <div className="text-slate-400">
            Walmart Stores CA, TX, FL, NY, WI
          </div>
        </div>
      </div>
    </section>
  );
}
