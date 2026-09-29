import React from 'react';
import { Search } from '../ui/Search';
import { Dropdown } from '../ui/Dropdown';
import { DEPARTMENTS, STORES_LIST, RISK_LEVELS } from '../../utils/constants';

export function RiskFilters({ filters, onFilterChange }) {
  const storeOptions = [
    { value: 'ALL', label: 'All Stores' },
    ...STORES_LIST.map(s => ({ value: s.id, label: `${s.id} (${s.city})` }))
  ];

  const deptOptions = DEPARTMENTS.map(d => ({ value: d, label: d }));

  const riskOptions = RISK_LEVELS.map(r => ({
    value: r,
    label: r === 'ALL' ? 'All Risk Levels' : `${r} Risk Only`
  }));

  return (
    <div className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-5 shadow-xs mb-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Search */}
        <div className="lg:col-span-1">
          <Search
            value={filters.search}
            onChange={(val) => onFilterChange({ search: val })}
            placeholder="Search SKU, brand, product..."
          />
        </div>

        {/* Store selector */}
        <Dropdown
          value={filters.storeId}
          onChange={(val) => onFilterChange({ storeId: val })}
          options={storeOptions}
        />

        {/* Department selector */}
        <Dropdown
          value={filters.department}
          onChange={(val) => onFilterChange({ department: val })}
          options={deptOptions}
        />

        {/* Risk Level selector */}
        <Dropdown
          value={filters.riskLevel}
          onChange={(val) => onFilterChange({ riskLevel: val })}
          options={riskOptions}
        />
      </div>

      {/* Quick filter pills */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Quick Toggles:</span>
          <button
            onClick={() => onFilterChange({ riskLevel: filters.riskLevel === 'HIGH' ? 'ALL' : 'HIGH' })}
            className={`px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              filters.riskLevel === 'HIGH'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Critical High Risk
          </button>
          <button
            onClick={() => onFilterChange({ department: filters.department === 'Beverages' ? 'All Departments' : 'Beverages' })}
            className={`px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              filters.department === 'Beverages'
                ? 'bg-[#0071CE] text-white'
                : 'bg-blue-50 text-[#0071CE] hover:bg-blue-100'
            }`}
          >
            Beverages Focus
          </button>
          <button
            onClick={() => onFilterChange({ department: filters.department === 'Dairy' ? 'All Departments' : 'Dairy' })}
            className={`px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
              filters.department === 'Dairy'
                ? 'bg-[#0071CE] text-white'
                : 'bg-blue-50 text-[#0071CE] hover:bg-blue-100'
            }`}
          >
            Dairy Products
          </button>
        </div>

        <button
          onClick={() => onFilterChange({ search: '', storeId: 'ALL', department: 'All Departments', riskLevel: 'ALL' })}
          className="text-slate-400 hover:text-slate-700 font-bold transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
}
