import { useState, useEffect } from 'react';
import { Investment, DashboardMetrics } from '@/types/investment';

interface HoldedApiResponse {
  investments: Investment[];
  metrics: DashboardMetrics;
}

export const useHoldedData = () => {
  const [data, setData] = useState<HoldedApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoldedData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call Supabase Edge Function
        const response = await fetch('/api/holded-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: 'documents' // You may need to adjust this based on Holded API endpoints
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const holdedData = await response.json();
        setData(holdedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching Holded data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHoldedData();
  }, []);

  return { data, loading, error, refetch: () => window.location.reload() };
};