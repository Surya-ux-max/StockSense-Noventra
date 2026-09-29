import React, { useState, useEffect } from 'react';
import { PortalHeader } from '../components/portal/PortalHeader';
import { ManagerHeader } from '../components/manager/ManagerHeader';
import { LiveOrderFeed } from '../components/manager/LiveOrderFeed';
import { RealtimeDemandTable } from '../components/manager/RealtimeDemandTable';
import { ModelForecastModal } from '../components/manager/ModelForecastModal';
import { DemandAdvisorChat } from '../components/manager/DemandAdvisorChat';
import { api } from '../services/api';
import { RefreshCw } from 'lucide-react';

export function ManagerPortal() {
  const [selectedStore, setSelectedStore] = useState('WMT_CA_006');
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Real-Time Model Forecast Modal state
  const [forecastModalOpen, setForecastModalOpen] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);

  const fetchDemand = () => {
    api.manager.getRealtimeDemand(selectedStore)
      .then((res) => {
        setDemandData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load real-time demand:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchDemand();

    // Auto poll every 6 seconds to capture live orders placed in Store Portal
    const interval = setInterval(fetchDemand, 6000);
    return () => clearInterval(interval);
  }, [selectedStore]);

  const handleRunAIForecast = async (productId) => {
    setForecastModalOpen(true);
    setForecastLoading(true);
    try {
      const res = await api.manager.getAIForecast(selectedStore, productId);
      setForecastData(res);
    } catch (err) {
      console.error('AI Forecast error:', err);
    } finally {
      setForecastLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5E8] flex flex-col">
      <PortalHeader activePortal="manager" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Manager Header with Metrics */}
        <ManagerHeader
          selectedStore={selectedStore}
          onChangeStore={setSelectedStore}
          totalOrders={demandData?.total_orders_today || 0}
          totalUnits={demandData?.total_units_ordered_today || 0}
          impactedSkus={demandData?.active_skus_impacted || 0}
          onRefresh={fetchDemand}
        />

        {/* Real-Time Operational Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: SKU Demand Table (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <RealtimeDemandTable
              products={demandData?.products || []}
              onSelectForAIForecast={handleRunAIForecast}
            />

            {/* Demand Advisor Chat */}
            <DemandAdvisorChat storeId={selectedStore} />
          </div>

          {/* Right Column: Live Order Stream (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <LiveOrderFeed orders={demandData?.recent_orders || []} />
          </div>
        </div>
      </main>

      {/* Model Demand Forecast Modal */}
      <ModelForecastModal
        isOpen={forecastModalOpen}
        onClose={() => setForecastModalOpen(false)}
        data={forecastData}
        loading={forecastLoading}
      />
    </div>
  );
}

export default ManagerPortal;
