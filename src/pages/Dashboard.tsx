import React, { useMemo } from 'react';
import CircularChart from '@/components/CircularChart';
import CategorySummary from '@/components/CategorySummary';
import ProfileDropdown from '@/components/ProfileDropdown';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHoldedData } from '@/hooks/useHoldedData';

const MetricCard = React.memo(({ title, value, className = "" }: { title: string; value: string; className?: string }) => (
  <div className={`p-6 rounded-lg border bg-card ${className}`}>
    <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </div>
));

const ActivityCard = React.memo(({ title, amount, count, label }: { title: string; amount: number; count: number; label: string }) => (
  <div className="p-4 rounded-lg border bg-card">
    <div className="flex justify-between items-center">
      <span className="font-medium">{title}</span>
      <span className="text-sm text-muted-foreground">{count} {label}</span>
    </div>
    <p className="text-lg font-semibold mt-2">
      €{amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
    </p>
  </div>
));

const Dashboard = () => {
  const { t } = useLanguage();
  const { data, loading, error } = useHoldedData();

  const metrics = useMemo(() => {
    if (!data?.investments) return null;

    const investments = data.investments;
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const averageReturn = investments.length 
      ? investments.reduce((sum, inv) => sum + inv.return_percentage, 0) / investments.length 
      : 0;

    const economicInvestments = investments.filter(inv => inv.is_economic_activity);
    const economicAmount = economicInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      totalAmount,
      averageReturn,
      economicAmount,
      economicCount: economicInvestments.length,
      nonEconomicCount: investments.length - economicInvestments.length,
      nonEconomicAmount: totalAmount - economicAmount,
      totalCount: investments.length
    };
  }, [data?.investments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Error al cargar los datos</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">{t('nav.dashboard')}</h1>
        <ProfileDropdown />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title={t('dashboard.totalPatrimony')}
            value={`€${metrics.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
          />
          <MetricCard 
            title={t('dashboard.totalReturn')}
            value={`${metrics.averageReturn.toFixed(2)}%`}
          />
          <MetricCard 
            title={t('dashboard.economicActivity')}
            value={`€${metrics.economicAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
          />
          <MetricCard 
            title={t('dashboard.investments')}
            value={metrics.totalCount.toString()}
          />
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <CircularChart 
              economicActivityPercentage={metrics.totalAmount > 0 ? (metrics.economicAmount / metrics.totalAmount) * 100 : 0}
              totalInvestments={metrics.totalAmount}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('dashboard.distributionByActivity')}</h2>
            <div className="space-y-3">
              <ActivityCard 
                title={t('dashboard.economic')}
                amount={metrics.economicAmount}
                count={metrics.economicCount}
                label={t('category.totalElements')}
              />
              <ActivityCard 
                title={t('dashboard.nonEconomic')}
                amount={metrics.nonEconomicAmount}
                count={metrics.nonEconomicCount}
                label={t('category.totalElements')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('dashboard.distributionByCategory')}</h2>
            <CategorySummary investments={data.investments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);