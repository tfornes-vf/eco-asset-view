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

        // Call Supabase Edge Function to sync Holded data
        const response = await fetch('https://fldrdenuwinjymymfnmd.supabase.co/functions/v1/holded-sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsZHJkZW51d2luanlteW1mbm1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjMwOTMsImV4cCI6MjA2NzE5OTA5M30.y4kzPXFK20_QMuxiSWrtlSPYStQSTr6qxjcX405CLVA`
          }
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