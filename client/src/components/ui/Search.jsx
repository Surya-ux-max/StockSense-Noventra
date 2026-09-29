import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function Search({
  value,
  onChange,
  placeholder = 'Search by SKU, product, brand, or store...',
  className = '',
  onClear
}) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#FCF8EE] border border-[#EBDDC6] hover:border-[#D9C4A5] text-slate-900 text-sm font-semibold rounded-xl pl-10 pr-9 py-2.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#005CE6]/20 focus:border-[#005CE6] transition-all placeholder:text-slate-400"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-[#EBDDC6]/50 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
