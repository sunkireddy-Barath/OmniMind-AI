import { useState, useEffect } from 'react';
import { apiClient, QueryResponse } from '@/lib/api';

export function useQuery(queryId: string | null) {
  const [data, setData] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!queryId) return;

    const fetchQuery = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.getQuery(queryId);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch query');
      } finally {
        setLoading(false);
      }
    };

    fetchQuery();
    
    // Poll for updates every 2 seconds if query is processing
    const interval = setInterval(() => {
      if (data?.status === 'queued' || data?.status === 'running') {
        fetchQuery();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [queryId, data?.status]);

  return { data, loading, error };
}

export function useQueries() {
  const [data, setData] = useState<QueryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.listQueries();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return { data, loading, error, refetch: fetchQueries };
}