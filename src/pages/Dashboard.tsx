import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Investment } from '@/types/investment';
import CircularChart from '@/components/CircularChart';
import CategorySummary from '@/components/CategorySummary';
import ProfileDropdown from '@/components/ProfileDropdown';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();

  const { data: investments, isLoading, error } = useQuery({
    queryKey: ['investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('holded_investments')
        .select('*')
        .order('amount', { ascending: false });
      
      if (error) throw error;
      return data as Investment[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Error al cargar los datos</p>
      </div>
    );
  }

  // Calculate metrics
  const totalAmount = investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const averageReturn = investments?.length 
    ? investments.reduce((sum, inv) => sum + inv.return_percentage, 0) / investments.length 
    : 0;

  const economicInvestments = investments?.filter(inv => inv.is_economic_activity) || [];
  const nonEconomicInvestments = investments?.filter(inv => !inv.is_economic_activity) || [];
  
  const economicAmount = economicInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const nonEconomicAmount = nonEconomicInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const economicCount = economicInvestments.length;
  const nonEconomicCount = nonEconomicInvestments.length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">{t('nav.dashboard')}</h1>
        <ProfileDropdown />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="metric-card p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('dashboard.totalPatrimony')}</h3>
            <p className="text-2xl font-bold text-foreground">
              €{totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="metric-card p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('dashboard.totalReturn')}</h3>
            <p className="text-2xl font-bold text-foreground">
              {averageReturn.toFixed(2)}%
            </p>
          </div>
          
          <div className="metric-card p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('dashboard.economicActivity')}</h3>
            <p className="text-2xl font-bold text-foreground">
              €{economicAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="metric-card p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('dashboard.investments')}</h3>
            <p className="text-2xl font-bold text-foreground">
              {investments?.length || 0}
            </p>
          </div>
        </div>

        {/* Circular Chart */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl">
            <CircularChart 
              economicActivityPercentage={totalAmount > 0 ? (economicAmount / totalAmount) * 100 : 0}
              totalInvestments={totalAmount}
            />
          </div>
        </div>

        {/* Distribution Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('dashboard.distributionByActivity')}</h2>
            <div className="space-y-3">
              <div className="investment-card p-4 rounded-lg border bg-card transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('dashboard.economic')}</span>
                  <span className="text-sm text-muted-foreground">{economicCount} {t('category.totalElements')}</span>
                </div>
                <p className="text-lg font-semibold mt-2">
                  €{economicAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <div className="investment-card p-4 rounded-lg border bg-card transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t('dashboard.nonEconomic')}</span>
                  <span className="text-sm text-muted-foreground">{nonEconomicCount} {t('category.totalElements')}</span>
                </div>
                <p className="text-lg font-semibold mt-2">
                  €{nonEconomicAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('dashboard.distributionByCategory')}</h2>
            <CategorySummary investments={investments || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;