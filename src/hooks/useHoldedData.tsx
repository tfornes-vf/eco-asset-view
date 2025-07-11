import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Investment } from '@/types/investment';

export const useHoldedData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['holded-investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('holded_investments')
        .select('*')
        .order('amount', { ascending: false });
      
      if (error) throw error;
      return { investments: data as Investment[] };
    },
  });

  return {
    data,
    loading: isLoading,
    error: error?.message
  };
};