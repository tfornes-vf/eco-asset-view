import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Investment } from '@/types/investment';

export const useHoldedData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['holded-investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('holded_investments')
        .select('id, external_id, name, category, amount, return_percentage, is_economic_activity')
        .order('amount', { ascending: false });
      
      if (error) throw error;
      return { investments: data as Investment[] };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    data,
    loading: isLoading,
    error: error?.message
  };
};