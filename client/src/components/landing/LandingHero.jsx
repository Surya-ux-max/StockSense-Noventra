import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Star, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { RiskBadge } from '../ui/Badge';

export function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-6 select-none">
      {/* Main Big Hero Container with Lime Yellow Background */}
      <div className="relative rounded-[40px] bg-[#F6EEDB] border border-[#EBDDC6] shadow-[0_4px_24px_rgba(30,25,10,0.04)] px-6 py-20 md:py-28 overflow-hidden">
        {/* Floating Card: Top Left (Network SKUs 15,000+) */}
        <div className="hidden lg:flex absolute top-12 left-10 -rotate-12 bg-[#FCF8EE] border border-[#EBDDC6] rounded-2xl p-4 shadow-xl z-10 w-48 hover:rotate-0 transition-transform duration-300">
          <div className="w-full">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-slate-500 leading-tight">
                Network SKUs Monitored
              </span>
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 ml-1">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">15,000+</div>
            <div className="text-[10px] font-bold text-emerald-700 mt-0.5">● 37 Store Nodes Online</div>
          </div>
        </div>

        {/* Floating Card: Bottom Left (Model Accuracy 93.3% R2) */}
        <div className="hidden lg:flex absolute bottom-12 left-8 -rotate-6 bg-[#FCF8EE] border border-[#EBDDC6] rounded-2xl p-4 shadow-xl z-10 w-60 hover:rotate-0 transition-transform duration-300">
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900">Demand Accuracy</span>
              <div className="flex items-center gap-1 text-[#EA7A18]">
                <Star className="w-3.5 h-3.5 fill-[#EA7A18] text-[#EA7A18]" />
                <span className="text-xs font-black text-slate-900">93.3% R²</span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-500 leading-tight">
              Certified Random Forest Regressor
            </p>
            {/* Avatar stack */}
            <div className="flex items-center -space-x-1.5 pt-1">
              <div className="w-7 h-7 rounded-full bg-[#005CE6] text-white text-[10px] font-black flex items-center justify-center border-2 border-[#FCF8EE]">
                CA
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#FCF8EE]">
                TX
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#FCF8EE]">
                FL
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#FCF8EE]">
                NY
              </div>
              <div className="w-7 h-7 rounded-full bg-[#EA7A18] text-white text-[10px] font-black flex items-center justify-center border-2 border-[#FCF8EE]">
                +37
              </div>
            </div>
          </div>
        </div>

        {/* Floating Retail Node Cards: Right Side */}
        {/* Node 1: Supercenter Los Angeles */}
        <div className="hidden lg:flex absolute top-12 right-16 bg-[#FCF8EE] border border-[#EBDDC6] rounded-3xl p-3.5 shadow-xl z-10 w-52 items-center gap-3 hover:scale-105 transition-transform duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#005CE6] flex items-center justify-center font-black text-xs shrink-0">
            LA
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400">Store Node</div>
            <div className="text-xs font-black text-slate-900">WMT_CA_006</div>
            <div className="text-[11px] font-bold text-emerald-700">84.2% Health Score</div>
          </div>
        </div>

        {/* Node 2: High Risk SKU Alert */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-8 bg-[#FCF8EE] border border-[#EBDDC6] rounded-3xl p-3.5 shadow-xl z-10 w-56 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold bg-[#EBDDC6]/50 px-1 rounded text-slate-700">PRD-0043</span>
            <RiskBadge level="HIGH" size="sm" />
          </div>
          <div className="text-xs font-black text-slate-900 truncate">Sprite 12pk (Beverages)</div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mt-1">
            <span>On-Hand: <strong className="text-red-600">16</strong></span>
            <span>Order: <strong className="text-[#005CE6]">156u</strong></span>
          </div>
        </div>

        {/* Node 3: Walmart Spark Launcher */}
        <div
          onClick={() => navigate('/dashboard')}
          title="Launch Live Walmart StockSense Dashboard"
          className="hidden lg:flex absolute bottom-12 right-20 bg-[#FCF8EE] border-2 border-[#FFC220]/60 hover:border-[#005CE6] rounded-3xl p-4 shadow-xl z-10 w-24 h-24 items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer group"
        >
          {/* Walmart Spark Icon */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={i}
                style={{ transform: `rotate(${deg}deg) translateY(-14px)` }}
                className="absolute w-2.5 h-6 bg-[#FFC220] rounded-full group-hover:bg-[#005CE6] transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Center Main Content */}
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCF8EE] border border-[#EBDDC6] text-xs font-black text-slate-800 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#EA7A18]" />
            <span className="text-[#005CE6]">Walmart StockSense</span>
            <span className="text-slate-300">•</span>
            <span>Intelligent Retail Decision Support</span>
          </div>

          {/* Headline with encircled "Act Before" */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Know What Needs Attention,{' '}
            <span className="relative inline-block px-1">
              <span className="relative z-10">Act Before</span>
              {/* Hand-drawn sketch orange oval */}
              <svg
                viewBox="0 0 190 70"
                className="absolute -top-3 -left-3 w-[116%] h-[135%] text-[#EA7A18] pointer-events-none -rotate-2"
                fill="none"
              >
                <ellipse
                  cx="95"
                  cy="35"
                  rx="90"
                  ry="30"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="450"
                  strokeDashoffset="10"
                  className="opacity-95"
                />
              </svg>
            </span>{' '}
            It Runs Out!
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm md:text-base text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            StockSense forecasts 7-day demand, predicts stock-out risk probabilities, uncovers root-cause drivers, and recommends validated case-pack replenishment orders for Walmart store associates and managers.
          </p>

          {/* Center CTA Button */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#EA7A18] hover:bg-[#D56B10] text-white font-black text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-[#EA7A18]/30 flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/risk')}
              className="bg-[#FCF8EE] hover:bg-[#F6EEDB] text-slate-800 font-bold text-sm sm:text-base px-7 py-4 rounded-xl border border-[#EBDDC6] transition-all cursor-pointer shadow-xs"
            >
              Triage At-Risk SKUs
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-2 flex items-center justify-center gap-6 text-xs font-bold text-slate-600 flex-wrap">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Random Forest Regressor (93.32% R²)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Stock-out Classifier (76.55% ROC-AUC)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              100% Case-Pack Enforced
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
