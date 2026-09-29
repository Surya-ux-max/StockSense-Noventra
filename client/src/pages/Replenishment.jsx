import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useReplenishment } from '../hooks/useReplenishment';
import { PageHeader } from '../components/layout/PageHeader';
import { OrderSummary } from '../components/replenishment/OrderSummary';
import { ReplenishmentTable } from '../components/replenishment/ReplenishmentTable';
import { ActionPanel } from '../components/replenishment/ActionPanel';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { Dropdown } from '../components/ui/Dropdown';
import { Button } from '../components/ui/Button';
import { STORES_LIST } from '../utils/constants';
import { CheckCheck, RefreshCw } from 'lucide-react';

export function Replenishment() {
  const { currentStore } = useOutletContext();
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState(currentStore === 'ALL' ? 'ALL' : currentStore);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, loading, error, updateItemStatus, refetch } = useReplenishment({
    storeId: selectedStore
  });

  const handleReviewItem = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleApprove = (itemId) => {
    updateItemStatus(itemId, 'APPROVED');
  };

  const storeOptions = [
    { value: 'ALL', label: 'All Stores Network' },
    ...STORES_LIST.map(s => ({ value: s.id, label: `${s.id} — ${s.city}` }))
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Replenishment Queue"
        subtitle="Recommended inventory actions prioritized by stock-out probability and case-pack optimization."
        badge={
          <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#FF6600] text-xs font-black">
            {data?.summary?.totalOrders || 0} Orders Queued
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
              Refresh Queue
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<CheckCheck className="w-4 h-4" />}
              onClick={() => {
                data?.items?.forEach(i => updateItemStatus(i.id, 'APPROVED'));
              }}
            >
              Approve All High Risk
            </Button>
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <OrderSummary summary={data?.summary} />

      {/* Filter toolbar */}
      <div className="flex items-center justify-between bg-[#FCF8EE] rounded-2xl border border-[#EBDDC6] px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Store:</span>
          <Dropdown
            value={selectedStore}
            onChange={setSelectedStore}
            options={storeOptions}
            className="w-64"
          />
        </div>
        <div className="text-xs font-medium text-slate-400 hidden sm:block">
          Orders are auto-sequenced by predicted probability of stock-out
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={10} />
      ) : error ? (
        <ErrorState description={error} onRetry={refetch} />
      ) : data?.items?.length === 0 ? (
        <EmptyState
          title="No Replenishment Orders Pending"
          description="All inventory levels are currently above reorder safety thresholds."
          actionLabel="View Inventory Risk"
          onAction={() => navigate('/risk')}
        />
      ) : (
        <ReplenishmentTable
          items={data.items}
          onReviewItem={handleReviewItem}
          onQuickApprove={handleApprove}
        />
      )}

      {/* Review Modal */}
      <ActionPanel
        isOpen={modalOpen}
        item={selectedItem}
        onClose={() => setModalOpen(false)}
        onApprove={handleApprove}
      />
    </div>
  );
}

export default Replenishment;
