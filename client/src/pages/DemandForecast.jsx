import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForecast } from '../hooks/useForecast';
import { PageHeader } from '../components/layout/PageHeader';
import { ForecastMetrics } from '../components/forecast/ForecastMetrics';
import { ForecastFilters } from '../components/forecast/ForecastFilters';
import { ForecastChart } from '../components/forecast/ForecastChart';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function DemandForecast() {
  const { currentStore } = useOutletContext();
  const [filters, setFilters] = useState({
    storeId: currentStore === 'ALL' ? 'WMT_CA_006' : currentStore,
    productId: 'PRD_0043',
    department: 'All Departments',
    horizon: '7D'
  });

  const { data, loading, error } = useForecast(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Demand Intelligence"
        subtitle="Forecast expected unit demand for the next 7 days across Walmart store nodes."
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => window.location.reload()}
          >
            Refresh Predictions
          </Button>
        }
      />

      {/* Model Specification Card with R², WAPE, MAE */}
      <ForecastMetrics metrics={data?.metrics} />

      {/* Filter Parameters */}
      <ForecastFilters
        filters={filters}
        onFilterChange={(newF) => setFilters(prev => ({ ...prev, ...newF }))}
      />

      {/* Main Chart */}
      {loading ? (
        <Skeleton className="h-80 w-full rounded-2xl" />
      ) : error ? (
        <ErrorState description={error} />
      ) : (
        <ForecastChart series={data?.itemSeries} />
      )}
    </div>
  );
}

export default DemandForecast;
