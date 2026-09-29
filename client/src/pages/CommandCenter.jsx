import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { HeroCard } from '../components/dashboard/HeroCard';
import { KPIGrid } from '../components/dashboard/KPIGrid';
import { PriorityActions } from '../components/dashboard/PriorityActions';
import { RiskOverview } from '../components/dashboard/RiskOverview';
import { DemandOverview } from '../components/dashboard/DemandOverview';
import { OperationalSummary } from '../components/dashboard/OperationalSummary';
import { PageHeader } from '../components/layout/PageHeader';
import { CardSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';
import { RefreshCw, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function CommandCenter() {
  const { currentStore } = useOutletContext();
  const navigate = useNavigate();
  const { data, loading, error } = useDashboard(currentStore);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-72 bg-slate-200 rounded-xl" />
        <div className="h-64 w-full bg-slate-200 rounded-3xl" />
        <CardSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Command Center Unavailable" description={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Greeting & Operational State */}
      <PageHeader
        title="Good Morning, Associate"
        subtitle={`Walmart Operations Dashboard • Store ${currentStore} • Fiscal Cycle Active`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => window.location.reload()}
            >
              Sync Signals
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowUpRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => navigate('/risk')}
            >
              Open Inventory Risk
            </Button>
          </div>
        }
      />

      {/* Hero Operational Banner with floating risk card */}
      <HeroCard
        currentStore={currentStore}
        topAction={data?.priorityActions?.[0]}
        onReviewCritical={() => navigate('/risk')}
      />

      {/* 4 Core KPIs */}
      <KPIGrid kpis={data?.kpis} />

      {/* Priority Operational Items */}
      <PriorityActions items={data?.priorityActions} />

      {/* Supporting Analytics Grid: Risk Distribution + Demand Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-5">
          <RiskOverview distribution={data?.riskDistribution} />
        </div>
        <div className="lg:col-span-7">
          <DemandOverview data={data?.demandTrend} />
        </div>
      </div>

      {/* Network Business Summary KPIs */}
      <div className="mt-8">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Executive Retail Network Benchmarks
        </div>
        <OperationalSummary kpis={data?.kpis} />
      </div>
    </div>
  );
}

export default CommandCenter;
