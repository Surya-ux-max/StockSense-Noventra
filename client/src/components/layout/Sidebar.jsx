import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  TrendingUp,
  PackageCheck,
  Store,
  Cpu,
  Sparkles,
  X
} from 'lucide-react';
import { cn } from '../../utils/helpers';

export function Sidebar({ currentStore = 'WMT_CA_006', isOpen = false, onClose }) {
  const mainNav = [
    { label: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory Risk', path: '/risk', icon: AlertTriangle, badge: '48' },
    { label: 'Demand Forecast', path: '/forecast', icon: TrendingUp },
    { label: 'Replenishment', path: '/replenishment', icon: PackageCheck, badge: '22' },
    { label: 'Stores', path: '/stores', icon: Store }
  ];

  const intelligenceNav = [
    { label: 'Model Intelligence', path: '/intelligence', icon: Cpu, badge: '93.3% R²' }
  ];

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 group',
      isActive
        ? 'bg-[#005CE6] text-white shadow-sm'
        : 'text-slate-700 hover:text-slate-900 hover:bg-[#EFE4CF]'
    );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F6EEDB] border-r border-[#EBDDC6] w-64 p-4 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 pt-2 pb-6">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#005CE6] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-white/20 text-[#FFDD55]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900">STOCKSENSE</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-[#EA7A18] text-white">PROD</span>
            </div>
            <p className="text-[11px] font-bold text-slate-600 tracking-wide uppercase">Intelligent Retail System</p>
          </div>
        </NavLink>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-[#EBDDC6]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-1">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-3.5 mb-2">
            Operations
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={linkClass}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-900')} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[11px] px-1.5 py-0.5 rounded-md font-bold',
                            isActive ? 'bg-white/20 text-white' : 'bg-[#EBDDC6] text-slate-800'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Intelligence Section */}
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-3.5 mb-2">
            Intelligence & System
          </div>
          <nav className="space-y-1">
            {intelligenceNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={linkClass}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-900')} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded-md font-bold',
                            isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#005CE6]'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Operational User / Store Context Box */}
      <div className="pt-4 border-t border-[#EBDDC6] space-y-2">
        <div className="bg-[#FCF8EE] rounded-2xl p-3.5 border border-[#EBDDC6] shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-black text-slate-500 uppercase tracking-wider text-[10px]">Active Node</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Online
            </span>
          </div>
          <div className="text-xs font-black text-slate-900">{currentStore}</div>
          <div className="text-[11px] text-slate-500 font-medium">Los Angeles Supercenter</div>
        </div>

        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#EFE4CF] hover:bg-[#EBDDC6] text-xs font-bold text-slate-700 transition-colors"
        >
          <span>← Back to Landing Page</span>
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
