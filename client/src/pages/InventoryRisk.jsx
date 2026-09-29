import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useRisk } from '../hooks/useRisk';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskFilters } from '../components/risk/RiskFilters';
import { RiskTable } from '../components/risk/RiskTable';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { RiskBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';

export function InventoryRisk() {
  const { currentStore } = useOutletContext();
  const navigate = useNavigate();
  const { data, loading, error, filters, updateFilters, refetch } = useRisk({
    storeId: currentStore === 'ALL' ? 'ALL' : currentStore
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Risk Priority"
        subtitle="Prioritize the items that need attention before shelves run out."
        badge={
          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black">
            {data?.distribution?.high || 48} High Risk SKUs
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={refetch}
            >
              Refresh Table
            </Button>
            <Button
              variant="orange"
              size="sm"
              onClick={() => navigate('/replenishment')}
            >
              Review Replenishment Queue
            </Button>
          </div>
        }
      />

      {/* Filter Controls */}
      <RiskFilters
        filters={filters}
        onFilterChange={updateFilters}
      />

      {/* Table Data or State */}
      {loading ? (
        <TableSkeleton rows={8} cols={9} />
      ) : error ? (
        <ErrorState description={error} onRetry={refetch} />
      ) : data?.items?.length === 0 ? (
        <EmptyState
          title="No Matching Risk SKUs"
          description="No items match your active search, department, or risk filter criteria."
          actionLabel="Clear Filters"
          onAction={() => updateFilters({ search: '', storeId: 'ALL', department: 'All Departments', riskLevel: 'ALL' })}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Showing {data.items.length} inventory records matching criteria</span>
            <span className="text-slate-400">Click any row to view Explainability & Forecast Detail</span>
          </div>
          <RiskTable items={data.items} />
        </div>
      )}
    </div>
  );
}

export default InventoryRisk;
