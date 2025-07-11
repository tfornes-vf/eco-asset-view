import React from 'react';
import { Link } from 'react-router-dom';
import { Investment } from '@/types/investment';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategorySummaryProps {
  investments: Investment[];
}

const CategorySummary: React.FC<CategorySummaryProps> = ({ investments }) => {
  const { t } = useLanguage();

  // Function to format category names (replace underscores with spaces)
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ');
  };

  if (!investments || investments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay categorías para mostrar
      </div>
    );
  }

  // Group investments by category
  const categoryData = investments.reduce((acc, investment) => {
    const category = investment.category;
    if (!acc[category]) {
      acc[category] = {
        totalAmount: 0,
        totalCount: 0,
        economicAmount: 0,
        economicCount: 0,
        nonEconomicAmount: 0,
        nonEconomicCount: 0
      };
    }

    acc[category].totalAmount += investment.amount;
    acc[category].totalCount += 1;

    if (investment.is_economic_activity) {
      acc[category].economicAmount += investment.amount;
      acc[category].economicCount += 1;
    } else {
      acc[category].nonEconomicAmount += investment.amount;
      acc[category].nonEconomicCount += 1;
    }

    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-3">
      {Object.entries(categoryData).map(([category, data]) => (
        <Link
          key={category}
          to={`/categoria/${encodeURIComponent(category)}`}
          className="investment-card block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{formatCategoryName(category)}</span>
            <span className="text-sm text-muted-foreground">{data.totalCount} {t('category.totalElements')}</span>
          </div>
          <p className="text-lg font-semibold mt-2">
            €{data.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default CategorySummary;