import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useReplenishment(initialFilters = {}) {
  const [filters, setFilters] = useState({ storeId: 'ALL', ...initialFilters });
  const [data, setData] = useState({ summary: { totalOrders: 0, totalUnits: 0, criticalCount: 0, mediumCount: 0 }, items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQueue = useCallback(() => {
    setLoading(true);
    setError(null);
    api.replenishment.list(filters)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch replenishment queue');
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const updateItemStatus = (itemId, newStatus) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? { ...item, status: newStatus } : item)
    }));
  };

  return { data, loading, error, filters, setFilters, updateItemStatus, refetch: fetchQueue };
}
