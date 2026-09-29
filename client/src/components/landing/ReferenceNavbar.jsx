import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function ReferenceNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
      {/* Brand Icon */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-11 h-11 rounded-2xl bg-[#005CE6] text-white flex items-center justify-center shadow-md relative overflow-hidden group-hover:scale-105 transition-transform">
          {/* Stylized V with trend arrow spark */}
          <svg viewBox="0 0 40 40" className="w-8 h-8 fill-none stroke-white stroke-[3.5] stroke-linecap-round stroke-linejoin-round">
            <path d="M 8 12 L 20 32 L 32 12" />
            <path d="M 17 21 L 24 14 L 30 18" stroke="#FFDD55" strokeWidth="3" />
            <path d="M 26 14 L 30 14 L 30 18" fill="#FFDD55" stroke="#FFDD55" />
          </svg>
        </div>
      </Link>

      {/* Center Nav Pill */}
      <div className="hidden md:flex items-center gap-8 bg-[#F6EEDB] border border-[#EBDDC6] px-8 py-2.5 rounded-2xl text-sm font-bold text-slate-800 shadow-xs">
        <Link to="/" className="hover:text-[#005CE6] transition-colors">Home</Link>
        <a href="#services" className="hover:text-[#005CE6] transition-colors">Services</a>
        <a href="#portfolio" className="hover:text-[#005CE6] transition-colors">Portfolio</a>
        <a href="#about" className="hover:text-[#005CE6] transition-colors">About Scalevisor</a>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-[#F6EEDB] hover:bg-[#EFE4CF] text-slate-800 font-bold text-sm px-5 py-2.5 rounded-xl border border-[#EBDDC6] transition-colors cursor-pointer"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-[#005CE6] hover:bg-[#004EC2] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-[#005CE6]/25 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          Start Free Trial
        </button>
      </div>
    </nav>
  );
}
