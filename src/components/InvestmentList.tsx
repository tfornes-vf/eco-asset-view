import React, { useMemo } from 'react';
import { Investment } from '@/types/investment';
import { useLanguage } from '@/contexts/LanguageContext';

interface InvestmentListProps {
  investments: Investment[];
}

const InvestmentItem = React.memo(({ investment }: { investment: Investment }) => (
  <div className="p-4 rounded-lg border bg-card">
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
));

const InvestmentSection = React.memo(({ title, investments, emptyMessage }: { 
  title: string; 
  investments: Investment[]; 
  emptyMessage: string;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">{title} ({investments.length})</h2>
    <div className="space-y-3">
      {investments.length > 0 ? (
        investments.map((investment) => (
          <InvestmentItem 
            key={investment.external_id} 
            investment={investment} 
          />
        ))
      ) : (
        <p className="text-muted-foreground text-center py-8">
          {emptyMessage}
        </p>
      )}
    </div>
  </div>
));

const InvestmentList: React.FC<InvestmentListProps> = ({ investments }) => {
  const { t } = useLanguage();
  
  const { economicInvestments, nonEconomicInvestments } = useMemo(() => {
    if (!investments?.length) return { economicInvestments: [], nonEconomicInvestments: [] };
    
    return {
      economicInvestments: investments.filter(inv => inv.is_economic_activity),
      nonEconomicInvestments: investments.filter(inv => !inv.is_economic_activity)
    };
  }, [investments]);
  
  if (!investments?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay inversiones en esta categoría
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <InvestmentSection
        title={t('dashboard.economicActivity')}
        investments={economicInvestments}
        emptyMessage="No hay inversiones de actividad económica en esta categoría."
      />
      <InvestmentSection
        title={t('dashboard.nonEconomic')}
        investments={nonEconomicInvestments}
        emptyMessage="No hay inversiones de no actividad económica en esta categoría."
      />
    </div>
  );
};

export default React.memo(InvestmentList);