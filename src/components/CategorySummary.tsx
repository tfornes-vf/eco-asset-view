import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Investment } from '@/types/investment';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategorySummaryProps {
  investments: Investment[];
}

const CategoryItem = React.memo(({ category, amount, count }: { category: string; amount: number; count: number }) => {
  const { t } = useLanguage();
  
  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ');
  };
  
  return (
    <Link 
      to={`/categoria/${encodeURIComponent(category)}`}
      className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{formatCategoryName(category)}</span>
        <span className="text-sm text-muted-foreground">{count} {t('category.totalElements')}</span>
      </div>
      <p className="text-lg font-semibold mt-2">
        €{amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
      </p>
    </Link>
  );
});

const CategorySummary: React.FC<CategorySummaryProps> = ({ investments }) => {
  const categoryData = useMemo(() => {
    if (!investments?.length) return [];
    
    const categoryMap = new Map<string, { amount: number; count: number }>();
    
    investments.forEach(investment => {
      const category = investment.category;
      const existing = categoryMap.get(category) || { amount: 0, count: 0 };
      categoryMap.set(category, {
        amount: existing.amount + investment.amount,
        count: existing.count + 1
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.amount - a.amount);
  }, [investments]);

  if (!categoryData.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay categorías para mostrar
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categoryData.map(({ category, amount, count }) => (
        <CategoryItem 
          key={category}
          category={category}
          amount={amount}
          count={count}
        />
      ))}
    </div>
  );
};

export default React.memo(CategorySummary);