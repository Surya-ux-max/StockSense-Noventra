import React from 'react';
import { AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';

export function WorkflowSection() {
  const steps = [
    {
      num: '01',
      question: 'WHAT IS HAPPENING?',
      badge: 'Immediate Detection',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
      title: 'Real-Time Risk & Demand Signals',
      desc: 'StockSense ingests continuous inventory balances and evaluates stock-out probabilities against predicted 7-day demand across all 37 Walmart store nodes.',
      example: 'Sprite 12pk on-hand: 16 units • 7-day demand: 342 units • 72.6% risk'
    },
    {
      num: '02',
      question: 'WHY IS IT HAPPENING?',
      badge: 'Certified Explainability',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: HelpCircle,
      title: 'Model Explainability Drivers',
      desc: 'No black-box guesses. StockSense identifies the exact causal drivers—such as days of inventory coverage (< 1.5 DOI), promo price elasticity, and delivery lag.',
      example: 'Driver 1: Low Inventory Coverage • Driver 2: Weekend Promo Lift • Driver 3: Active Circular'
    },
    {
      num: '03',
      question: 'WHAT SHOULD I DO?',
      badge: 'Automated Action',
      badgeColor: 'bg-blue-100 text-[#005CE6] border-blue-200',
      icon: CheckCircle2,
      title: 'Case-Pack Replenishment Dispatch',
      desc: 'The decision engine calculates the exact reorder quantity, rounds up to the supplier master case pack, and produces clear, shift-ready manager instructions.',
      example: 'Reorder: 156 units (13 cases × 12/pk) • Expedited DC transfer requested'
    }
  ];

  return (
    <section id="workflow" className="py-16 px-6 bg-[#F6EEDB] border-y border-[#EBDDC6]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-[#EA7A18]">
            Operational Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Designed for Walmart Associates & Managers
          </h2>
          <p className="text-base text-slate-600 font-medium">
            A worker should understand any inventory risk condition within seconds, without wading through raw machine learning terminology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-7 flex flex-col justify-between hover:border-[#D9C4A5] transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-[#005CE6] font-mono">
                      {step.num}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                  </div>

                  <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    {step.question}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mt-1 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EBDDC6] bg-[#F6EEDB] rounded-2xl p-3 text-xs font-medium text-slate-700">
                  <strong className="text-slate-900 block font-bold mb-0.5">Live Output Grain:</strong>
                  {step.example}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
