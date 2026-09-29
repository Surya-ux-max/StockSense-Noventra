import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useDashboard(storeId = 'WMT_CA_006') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.dashboard.overview(storeId)
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Failed to load dashboard overview');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [storeId]);

  return { data, loading, error };
}
