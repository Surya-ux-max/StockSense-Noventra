import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Star } from 'lucide-react';

export function ReferenceHero() {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-6">
      {/* Main Big Hero Container with Lime Yellow Background */}
      <div className="relative rounded-[40px] bg-[#F6EEDB] border border-[#EBDDC6] shadow-[0_4px_24px_rgba(20,20,10,0.04)] px-6 py-20 md:py-28 overflow-hidden">
        {/* Floating Card: Top Left (Brands moved to Shopify 150+) */}
        <div className="hidden lg:flex absolute top-12 left-10 -rotate-12 bg-[#FCF8EE] border border-[#EBDDC6] rounded-2xl p-4 shadow-xl z-10 w-44 hover:rotate-0 transition-transform duration-300">
          <div className="w-full">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-slate-500 leading-tight">
                Brands moved to Shopify
              </span>
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 ml-1">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">150+</div>
          </div>
        </div>

        {/* Floating Card: Bottom Left (Ratings 5.0) */}
        <div className="hidden lg:flex absolute bottom-12 left-8 -rotate-6 bg-[#FCF8EE] border border-[#EBDDC6] rounded-2xl p-4 shadow-xl z-10 w-56 hover:rotate-0 transition-transform duration-300">
          <div className="w-full space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900">Ratings</span>
              <div className="flex items-center gap-1 text-[#EA7A18]">
                <Star className="w-3.5 h-3.5 fill-[#EA7A18] text-[#EA7A18]" />
                <span className="text-xs font-black text-slate-900">5.0</span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-slate-500 leading-tight">
              Trusted By Clients From Worldwide.
            </p>
            {/* Avatar stack */}
            <div className="flex items-center -space-x-1.5 pt-1">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                alt="Client"
                className="w-7 h-7 rounded-full border-2 border-[#FCF8EE] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                alt="Client"
                className="w-7 h-7 rounded-full border-2 border-[#FCF8EE] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                alt="Client"
                className="w-7 h-7 rounded-full border-2 border-[#FCF8EE] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80"
                alt="Client"
                className="w-7 h-7 rounded-full border-2 border-[#FCF8EE] object-cover"
              />
              <div className="w-7 h-7 rounded-full bg-[#005CE6] text-white text-[10px] font-black flex items-center justify-center border-2 border-[#FCF8EE]">
                +4k
              </div>
            </div>
          </div>
        </div>

        {/* Floating Marketplace Cards: Right Side */}
        {/* Amazon */}
        <div className="hidden lg:flex absolute top-14 right-20 bg-[#FCF8EE] border border-[#EBDDC6] rounded-3xl p-4 shadow-xl z-10 w-24 h-24 items-center justify-center hover:scale-105 transition-transform duration-300">
          <div className="text-center">
            {/* Amazon icon stylized */}
            <span className="text-4xl font-black text-slate-900 lowercase font-serif">a</span>
            <div className="w-8 h-2 border-b-2 border-[#EA7A18] rounded-full mx-auto -mt-1" />
          </div>
        </div>

        {/* eBay */}
        <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 right-8 bg-[#FCF8EE] border border-[#EBDDC6] rounded-3xl p-4 shadow-xl z-10 w-24 h-24 items-center justify-center hover:scale-105 transition-transform duration-300">
          <div className="flex items-center text-xl font-black tracking-tighter">
            <span className="text-[#E53238]">e</span>
            <span className="text-[#0064D2]">b</span>
            <span className="text-[#F5AF02]">a</span>
            <span className="text-[#86B817]">y</span>
          </div>
        </div>

        {/* Walmart Spark Card (Interactive link to StockSense) */}
        <div
          onClick={() => navigate('/dashboard')}
          title="Explore Walmart StockSense Decision Support"
          className="hidden lg:flex absolute bottom-12 right-20 bg-[#FCF8EE] border-2 border-[#FFC220]/60 hover:border-[#0071CE] rounded-3xl p-4 shadow-xl z-10 w-24 h-24 items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer group"
        >
          {/* Walmart Spark Icon */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={i}
                style={{ transform: `rotate(${deg}deg) translateY(-14px)` }}
                className="absolute w-2.5 h-6 bg-[#FFC220] rounded-full group-hover:bg-[#0071CE] transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Center Main Content */}
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          {/* Headline with encircled "Dominate" */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Expand Your Reach,{' '}
            <span className="relative inline-block px-1">
              <span className="relative z-10">Dominate</span>
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
            Every Marketplace – Simplify Your Success!
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since. Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since.
          </p>

          {/* Center CTA Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#EA7A18] hover:bg-[#D56B10] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-lg shadow-[#EA7A18]/30 flex items-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Let's Build Your Product</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
