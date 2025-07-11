import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Investment } from '@/types/investment';
import InvestmentList from '@/components/InvestmentList';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHoldedData } from '@/hooks/useHoldedData';
import ThemeToggle from '@/components/ThemeToggle';

const CategoryDetails = () => {
  const { category } = useParams<{ category: string }>();
  const { t } = useLanguage();

  // Function to format category names (replace underscores with spaces)
  const formatCategoryName = (categoryName: string) => {
    return categoryName.replace(/_/g, ' ');
  };
  const { data: holdedData, loading, error } = useHoldedData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando datos de inversión...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error al cargar los datos: {error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const investments = holdedData?.investments || [];

  const categoryInvestments = investments.filter(inv => 
    inv.category.toLowerCase() === category?.toLowerCase()
  );

  const economicActivityInvestments = categoryInvestments.filter(inv => inv.is_economic_activity);
  const nonEconomicActivityInvestments = categoryInvestments.filter(inv => !inv.is_economic_activity);

  const economicTotal = economicActivityInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const nonEconomicTotal = nonEconomicActivityInvestments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between fade-in">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-foreground capitalize">{category}</h1>
              <p className="text-muted-foreground mt-1">
                Inversiones en {category} - {categoryInvestments.length} posiciones
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Total: €{(economicTotal + nonEconomicTotal).toLocaleString()}
            </Badge>
            <ThemeToggle />
          </div>
        </div>

        {/* Filter Space - Preparado para el futuro */}
        <Card className="fade-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Espacio reservado para filtros y buscador
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Actividad Económica: {economicActivityInvestments.length}
                </Badge>
                <Badge variant="outline">
                  No Económica: {nonEconomicActivityInvestments.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Economic Activity Investments */}
          <Card className="investment-card slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-success flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Inversiones de Actividad Económica
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                €{economicTotal.toLocaleString()} • {economicActivityInvestments.length} posiciones
              </p>
            </CardHeader>
            <CardContent>
              <InvestmentList investments={economicActivityInvestments} />
            </CardContent>
          </Card>

          {/* Non-Economic Activity Investments */}
          <Card className="investment-card slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                Inversiones No Económicas
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                €{nonEconomicTotal.toLocaleString()} • {nonEconomicActivityInvestments.length} posiciones
              </p>
            </CardHeader>
            <CardContent>
              <InvestmentList investments={nonEconomicActivityInvestments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;