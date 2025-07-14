import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InvestmentList from '@/components/InvestmentList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHoldedData } from '@/hooks/useHoldedData';

const CategoryDetails = () => {
  const { category } = useParams<{ category: string }>();
  const { t } = useLanguage();
  const { data, loading, error } = useHoldedData();

  const categoryData = useMemo(() => {
    if (!data?.investments || !category) return null;

    const decodedCategory = decodeURIComponent(category);
    const categoryInvestments = data.investments.filter(
      inv => inv.category === decodedCategory
    );

    const totalAmount = categoryInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const averageReturn = categoryInvestments.length 
      ? categoryInvestments.reduce((sum, inv) => sum + inv.return_percentage, 0) / categoryInvestments.length 
      : 0;

    return {
      investments: categoryInvestments,
      totalAmount,
      averageReturn,
      count: categoryInvestments.length,
      categoryName: decodedCategory
    };
  }, [data?.investments, category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Error al cargar los datos</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              {t('nav.back')}
            </Link>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl capitalize">
              {t('category.details')} {categoryData.categoryName}
            </CardTitle>
            <CardDescription>
              <Badge variant="secondary">
                {categoryData.count} {t('category.totalElements')}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('category.totalAmount')}</p>
                <p className="text-2xl font-bold">
                  €{categoryData.totalAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('dashboard.totalReturn')}</p>
                <p className="text-2xl font-bold">
                  {categoryData.averageReturn.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <InvestmentList investments={categoryData.investments} />
      </div>
    </div>
  );
};

export default React.memo(CategoryDetails);