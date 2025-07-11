import React from 'react';
import { Investment } from '@/types/investment';
import { useLanguage } from '@/contexts/LanguageContext';

interface InvestmentListProps {
  investments: Investment[];
}

const InvestmentList: React.FC<InvestmentListProps> = ({ investments }) => {
  const { t } = useLanguage();
  
  if (!investments || investments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay inversiones en esta categoría
      </div>
    );
  }

  // Separate investments by economic activity
  const economicInvestments = investments.filter(inv => inv.is_economic_activity);
  const nonEconomicInvestments = investments.filter(inv => !inv.is_economic_activity);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Economic Investments */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('dashboard.economicActivity')} ({economicInvestments.length})</h2>
        <div className="space-y-3">
          {economicInvestments.map((investment) => (
            <div
              key={investment.external_id}
              className="investment-card p-4 rounded-lg border bg-card transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{investment.name}</h3>
                  {investment.description && (
                    <p className="text-sm text-muted-foreground mt-1">{investment.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    {investment.sub_category && (
                      <span>Subcategoría: {investment.sub_category}</span>
                    )}
                    {investment.investment_type && (
                      <span>Tipo: {investment.investment_type}</span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-lg">
                    €{investment.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {investment.return_percentage.toFixed(2)}% retorno
                  </p>
                </div>
              </div>
            </div>
          ))}
          {economicInvestments.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No hay inversiones de actividad económica en esta categoría.
            </p>
          )}
        </div>
      </div>

      {/* Non-Economic Investments */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('dashboard.nonEconomic')} ({nonEconomicInvestments.length})</h2>
        <div className="space-y-3">
          {nonEconomicInvestments.map((investment) => (
            <div
              key={investment.external_id}
              className="investment-card p-4 rounded-lg border bg-card transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{investment.name}</h3>
                  {investment.description && (
                    <p className="text-sm text-muted-foreground mt-1">{investment.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    {investment.sub_category && (
                      <span>Subcategoría: {investment.sub_category}</span>
                    )}
                    {investment.investment_type && (
                      <span>Tipo: {investment.investment_type}</span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-lg">
                    €{investment.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {investment.return_percentage.toFixed(2)}% retorno
                  </p>
                </div>
              </div>
            </div>
          ))}
          {nonEconomicInvestments.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No hay inversiones de no actividad económica en esta categoría.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentList;