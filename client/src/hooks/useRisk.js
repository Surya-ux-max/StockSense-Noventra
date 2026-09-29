import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useRisk(initialFilters = {}) {
  const [filters, setFilters] = useState({
    storeId: 'ALL',
    department: 'All Departments',
    riskLevel: 'ALL',
    search: '',
    ...initialFilters
  });

  const [data, setData] = useState({ total: 0, items: [], distribution: { high: 0, medium: 0, low: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRisk = useCallback(() => {
    setLoading(true);
    setError(null);
    api.risk.list(filters)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch inventory risk items');
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    fetchRisk();
  }, [fetchRisk]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return { data, loading, error, filters, updateFilters, refetch: fetchRisk };
}
