import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ItemHeader } from '../components/item/ItemHeader';
import { InventorySummary } from '../components/item/InventorySummary';
import { DemandChart } from '../components/item/DemandChart';
import { LiveModelSimulator } from '../components/item/LiveModelSimulator';
import { ExplainabilityPanel } from '../components/item/ExplainabilityPanel';
import { ReplenishmentRecommendation } from '../components/item/ReplenishmentRecommendation';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/EmptyState';

export function ItemIntelligence() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.risk.getById(id || 'PRD_0043')
      .then((res) => {
        if (isMounted) {
          setItem(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to load item intelligence details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <ErrorState
        title="Item Intelligence Unavailable"
        description={error || 'Could not find the requested item SKU in the system.'}
        onRetry={() => navigate('/risk')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with SKU, Store, Risk callout */}
      <ItemHeader item={item} />

      {/* 2. Four Core Inventory Cards */}
      <InventorySummary item={item} />

      {/* 3. Demand Forecast Chart */}
      <DemandChart series={item.forecastSeries} />

      {/* 4. Interactive Live What-If Model Simulator */}
      <LiveModelSimulator item={item} />

      {/* 5. Explainability Panel (Why is this at risk?) */}
      <ExplainabilityPanel
        reasons={item.reasons}
        topDrivers={[item.top_driver_1, item.top_driver_2, item.top_driver_3].filter(Boolean)}
      />

      {/* 5. Replenishment Recommendation & Manager Action */}
      <ReplenishmentRecommendation item={item} />
    </div>
  );
}

export default ItemIntelligence;
