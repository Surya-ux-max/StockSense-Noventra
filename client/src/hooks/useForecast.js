import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useForecast(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.forecast.get(filters)
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch demand forecast');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
}
