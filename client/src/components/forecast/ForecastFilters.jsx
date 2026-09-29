import React from 'react';
import { Dropdown } from '../ui/Dropdown';
import { DEPARTMENTS, STORES_LIST } from '../../utils/constants';

export function ForecastFilters({ filters, onFilterChange }) {
  const storeOptions = [
    { value: 'ALL', label: 'All Stores Network' },
    ...STORES_LIST.map(s => ({ value: s.id, label: `${s.id} — ${s.city}` }))
  ];

  const deptOptions = DEPARTMENTS.map(d => ({ value: d, label: d }));

  const productOptions = [
    { value: 'ALL', label: 'All SKUs Aggregate' },
    { value: 'PRD_0043', label: 'PRD_0043 — Sprite (12 pk)' },
    { value: 'PRD_0027', label: 'PRD_0027 — Sargento Cheddar' },
    { value: 'PRD_0002', label: 'PRD_0002 — Fairlife 2% Milk' },
    { value: 'PRD_0150', label: 'PRD_0150 — Campbell Soup' },
    { value: 'PRD_0074', label: 'PRD_0074 — Starbucks Pike Roast' }
  ];

  const horizonOptions = [
    { value: '7D', label: 'Next 7 Days (Official Cycle)' },
    { value: '14D', label: 'Next 14 Days (Extended DC)' },
    { value: '30D', label: 'Next 30 Days (Monthly Outlook)' }
  ];

  return (
    <div className="bg-[#FCF8EE] rounded-3xl border border-[#EBDDC6] p-5 shadow-xs mb-6">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        Forecast Segment Parameters
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Dropdown
          label="Store Node"
          value={filters.storeId || 'WMT_CA_006'}
          onChange={(val) => onFilterChange({ storeId: val })}
          options={storeOptions}
        />
        <Dropdown
          label="Product SKU"
          value={filters.productId || 'PRD_0043'}
          onChange={(val) => onFilterChange({ productId: val })}
          options={productOptions}
        />
        <Dropdown
          label="Department"
          value={filters.department || 'All Departments'}
          onChange={(val) => onFilterChange({ department: val })}
          options={deptOptions}
        />
        <Dropdown
          label="Forecast Horizon"
          value={filters.horizon || '7D'}
          onChange={(val) => onFilterChange({ horizon: val })}
          options={horizonOptions}
        />
      </div>
    </div>
  );
}
