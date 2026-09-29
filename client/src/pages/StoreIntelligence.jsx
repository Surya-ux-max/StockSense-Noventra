import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { PageHeader } from '../components/layout/PageHeader';
import { StoreCard } from '../components/stores/StoreCard';
import { StoreRiskHeatmap } from '../components/stores/StoreRiskHeatmap';
import { StoreTable } from '../components/stores/StoreTable';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function StoreIntelligence() {
  const { currentStore, setCurrentStore } = useOutletContext();
  const navigate = useNavigate();
  const { data, loading, error } = useStores();

  const handleSelectStore = (storeId) => {
    setCurrentStore(storeId);
    navigate(`/risk`);
  };

  const handleHeatmapClick = (storeId, dept) => {
    setCurrentStore(storeId);
    navigate(`/risk`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Intelligence"
        subtitle="Network inventory health, regional demand run-rates, and cross-store risk allocation."
        badge={
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#0071CE] text-xs font-black">
            37 Network Stores Active
          </span>
        }
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => window.location.reload()}
          >
            Refresh Nodes
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <CardSkeleton count={4} />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState description={error} />
      ) : (
        <>
          {/* Key Store Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {data.stores.slice(0, 4).map(s => (
              <StoreCard
                key={s.store_id}
                store={s}
                onSelectStore={handleSelectStore}
              />
            ))}
          </div>

          {/* Store × Department Heatmap */}
          <StoreRiskHeatmap
            heatmapData={data.heatmap}
            onStoreDeptClick={handleHeatmapClick}
          />

          {/* Store Comparison Table */}
          <div className="space-y-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Network Store Benchmarks
            </h3>
            <StoreTable
              stores={data.stores}
              onSelectStore={handleSelectStore}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default StoreIntelligence;
