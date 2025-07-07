import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import CircularChart from "@/components/CircularChart";
import CategorySummary from "@/components/CategorySummary";
import { useHoldedData } from "@/hooks/useHoldedData";

const Dashboard = () => {
  const { data: holdedData, loading, error } = useHoldedData();

  // Use real data from Holded API or fallback to defaults
  const totalInvestments = holdedData?.metrics?.totalInvestments || 0;
  const economicActivityPercentage = holdedData?.metrics?.economicActivityPercentage || 0;
  const totalReturn = holdedData?.metrics?.totalReturn || 0;
  const totalPositions = holdedData?.metrics?.totalPositions || 0;
  const isEconomicActivityLow = economicActivityPercentage < 55;

  // Transform Holded investments to match UI format
  const investments = holdedData?.investments?.map(inv => ({
    id: inv.external_id,
    name: inv.name,
    amount: inv.amount,
    return: inv.return_percentage,
    isEconomicActivity: inv.is_economic_activity,
    category: inv.category
  })) || [];

  const economicActivityInvestments = investments.filter(inv => inv.isEconomicActivity);
  const nonEconomicActivityInvestments = investments.filter(inv => !inv.isEconomicActivity);

  // Group investments by category
  const categoryGroups = investments.reduce((groups, investment) => {
    const category = investment.category;
    if (!groups[category]) {
      groups[category] = {
        name: category,
        economicCount: 0,
        nonEconomicCount: 0,
        economicTotal: 0,
        nonEconomicTotal: 0
      };
    }
    
    if (investment.isEconomicActivity) {
      groups[category].economicCount += 1;
      groups[category].economicTotal += investment.amount;
    } else {
      groups[category].nonEconomicCount += 1;
      groups[category].nonEconomicTotal += investment.amount;
    }
    
    return groups;
  }, {} as Record<string, any>);

  const categories = Object.values(categoryGroups);

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
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Panel de Inversiones</h1>
            <p className="text-muted-foreground mt-1">Gestiona tu portafolio y actividad económica</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Última actualización: Hoy
            </Badge>
            <ThemeToggle />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="metric-card fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Portafolio Total</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">€{totalInvestments.toLocaleString()}</div>
              <p className="text-xs text-success mt-1">+2.1% del mes pasado</p>
            </CardContent>
          </Card>

          <Card className="metric-card fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Retorno Total</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">+{totalReturn}%</div>
              <p className="text-xs text-muted-foreground mt-1">Retorno anualizado</p>
            </CardContent>
          </Card>

          <Card className="metric-card fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Actividad Económica</CardTitle>
              <Activity className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${isEconomicActivityLow ? 'text-destructive' : 'text-success'}`}>
                {economicActivityPercentage}%
              </div>
              <p className={`text-xs mt-1 ${isEconomicActivityLow ? 'text-destructive' : 'text-muted-foreground'}`}>
                {isEconomicActivityLow ? 'Por debajo del objetivo (55%)' : 'Por encima del objetivo'}
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inversiones</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalPositions}</div>
              <p className="text-xs text-muted-foreground mt-1">Posiciones activas</p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Distribution Chart - moved to top */}
        <Card className="investment-card slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle className="text-success flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Distribución de Inversiones por Actividad Económica
            </CardTitle>
            <p className="text-sm text-muted-foreground">Estrategia de ponderación de activos a medio plazo</p>
          </CardHeader>
          <CardContent>
            <CircularChart 
              economicActivityPercentage={economicActivityPercentage}
              totalInvestments={totalInvestments}
            />
          </CardContent>
        </Card>

        {/* Categories Summary */}
        <Card className="investment-card slide-up" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              Inversiones por Categoría
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Haz clic en una categoría para ver sus detalles
            </p>
          </CardHeader>
          <CardContent>
            <CategorySummary categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;