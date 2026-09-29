import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Activity, PackageCheck, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

export function WalmartStocksenseBanner() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="rounded-[36px] bg-[#F6EEDB] border border-[#EBDDC6] p-8 md:p-12 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EE] border border-[#EBDDC6] text-xs font-black text-slate-800 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#EA7A18]" />
              <span className="text-[#005CE6]">Walmart StockSense</span>
              <span className="text-slate-300">•</span>
              <span>Intelligent Retail Decision Support</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Retail Operations Command Center & AI Decision Engine
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              StockSense continuously forecasts 7-day store demand (Random Forest Regressor, 93.32% R²), evaluates stock-out probability, and recommends case-pack rounded replenishment orders for Walmart workers.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Validated ML Models
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#005CE6]" />
                37 Network Stores
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-[#EA7A18]" />
                2,481 Active Orders
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="bg-[#005CE6] hover:bg-[#004EC2] text-white font-black text-sm shadow-lg shadow-[#005CE6]/25 px-7 py-4 rounded-xl"
            >
              Enter Live Command Center
            </Button>
            <Button
              variant="orange"
              size="lg"
              onClick={() => navigate('/risk')}
              className="bg-[#EA7A18] hover:bg-[#D56B10] text-white font-black text-sm px-7 py-4 rounded-xl shadow-md shadow-[#EA7A18]/25"
            >
              Triage Inventory Risk
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/intelligence')}
              className="bg-[#FCF8EE] border-[#EBDDC6] text-slate-800 font-bold"
            >
              Audit Model Performance
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
