import React from 'react';
import { TrendingUp, AlertTriangle, PackageCheck, Store, Cpu, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';

export function CapabilitiesGrid() {
  const capabilities = [
    {
      icon: TrendingUp,
      title: '7-Day Demand Forecasting',
      badge: '93.32% R²',
      badgeColor: 'bg-blue-100 text-[#005CE6] border-blue-200',
      desc: 'Random Forest Regressor forecasts weekly unit sales across all Store × Product combinations, balancing holiday surges and promo price changes.'
    },
    {
      icon: AlertTriangle,
      title: 'Calibrated Stock-Out Warning',
      badge: '76.55% ROC-AUC',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      desc: 'Predicts continuous stock-out probabilities (0.0 to 1.0) and assigns actionable High, Medium, and Low risk priority labels.'
    },
    {
      icon: PackageCheck,
      title: 'Case-Pack Replenishment',
      badge: '100% Validated',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Recommends exact replenishment order quantities rounded to master carton units (e.g. 6/pk, 12/pk, 24/pk) to avoid partial-case fees.'
    },
    {
      icon: Store,
      title: 'Multi-Store Heatmap',
      badge: '37 Supercenters',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      desc: 'Store × Department cross-matrix uncovers regional vulnerabilities across California, Texas, Florida, New York, and Wisconsin store clusters.'
    },
    {
      icon: Cpu,
      title: 'Model Explainability Drivers',
      badge: 'No Black Box',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Pinpoints specific operational causes: Low inventory coverage (< 2 DOI), delivery lead time extension, or promotional circular lift.'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Data Health Suite',
      badge: '6 / 6 PASS',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Audited in independent Python inference notebook 07. Verified zero leakage, deterministic outputs, and real-time sub-15ms throughput.'
    }
  ];

  return (
    <section id="capabilities" className="py-20 px-6 max-w-7xl mx-auto space-y-12 select-none">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#005CE6]">
          Core System Capabilities
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Built for High-Velocity Walmart Operations
        </h2>
        <p className="text-base text-slate-600 font-medium">
          Every capability is backed by the validated machine learning pipeline and tested decision engine outputs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <div
              key={i}
              className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-7 space-y-4 hover:border-[#D9C4A5] transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F6EEDB] border border-[#EBDDC6] flex items-center justify-center text-slate-800 shadow-2xs">
                  <Icon className="w-6 h-6 text-[#005CE6]" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${cap.badgeColor}`}>
                  {cap.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1.5">
                  {cap.title}
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
