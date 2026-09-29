import React from 'react';
import { useIntelligence } from '../hooks/useIntelligence';
import { PageHeader } from '../components/layout/PageHeader';
import { DemandModelCard } from '../components/intelligence/DemandModelCard';
import { StockoutModelCard } from '../components/intelligence/StockoutModelCard';
import { DataHealth, ValidationStatus } from '../components/intelligence/DataHealth';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { Award, ShieldCheck, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function SystemIntelligence() {
  const { data, loading, error } = useIntelligence();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Model & System Intelligence"
        subtitle="Audited ML models, data pipeline validation status, and certified performance benchmarks."
        badge={
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Decision Engine Certified
          </span>
        }
      />

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState description={error} />
      ) : (
        <>
          {/* Section 1 & Section 2: Demand Model + Stock-out Model Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DemandModelCard model={data?.demandModel} />
            <StockoutModelCard model={data?.stockoutModel} />
          </div>

          {/* Section 3: Data Health Pipeline Checks */}
          <DataHealth items={data?.dataHealth} />

          {/* Section 4: Algorithm Compliance & Permitted Status */}
          <ValidationStatus />
        </>
      )}
    </div>
  );
}

export default SystemIntelligence;
