import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  disabled = false
}) {
  return (
    <div className={cn('relative inline-flex flex-col', className)}>
      {label && <label className="text-xs font-semibold text-slate-600 mb-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="appearance-none w-full bg-[#FCF8EE] border border-[#EBDDC6] hover:border-[#D9C4A5] text-slate-800 font-bold text-sm rounded-xl pl-3.5 pr-9 py-2.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#005CE6]/20 focus:border-[#005CE6] transition-all cursor-pointer disabled:opacity-50"
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
