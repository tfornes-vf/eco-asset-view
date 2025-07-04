import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import CircularChart from "@/components/CircularChart";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading investment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading data: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
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
            <h1 className="text-4xl font-bold text-foreground">Investment Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your portfolio and economic activity</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Last updated: Today
            </Badge>
            <ThemeToggle />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="metric-card fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">€{totalInvestments.toLocaleString()}</div>
              <p className="text-xs text-success mt-1">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="metric-card fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Return</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">+{totalReturn}%</div>
              <p className="text-xs text-muted-foreground mt-1">Annualized return</p>
            </CardContent>
          </Card>

          <Card className="metric-card fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Economic Activity</CardTitle>
              <Activity className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${isEconomicActivityLow ? 'text-destructive' : 'text-success'}`}>
                {economicActivityPercentage}%
              </div>
              <p className={`text-xs mt-1 ${isEconomicActivityLow ? 'text-destructive' : 'text-muted-foreground'}`}>
                {isEconomicActivityLow ? 'Below target (55%)' : 'Above target'}
              </p>
            </CardContent>
          </Card>

          <Card className="metric-card fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Investments</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalPositions}</div>
              <p className="text-xs text-muted-foreground mt-1">Active positions</p>
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

        {/* Investment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Economic Activity Investments */}
          <Card className="investment-card slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-success flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                Economic Activity Investments
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                €{economicActivityInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {economicActivityInvestments.map((investment, index) => (
                  <div key={investment.id} className="investment-card p-4 border border-border/50 rounded-lg hover:border-success/30 transition-all duration-300" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{investment.name}</p>
                        <p className="text-sm text-muted-foreground">{investment.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">€{investment.amount.toLocaleString()}</p>
                        <p className={`text-sm font-medium ${investment.return > 0 ? 'text-success' : 'text-destructive'}`}>
                          {investment.return > 0 ? '+' : ''}{investment.return}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Non-Economic Activity Investments */}
          <Card className="investment-card slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle className="text-muted-foreground flex items-center gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                Non-Economic Activity Investments
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                €{nonEconomicActivityInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nonEconomicActivityInvestments.map((investment, index) => (
                  <div key={investment.id} className="investment-card p-4 border border-border/50 rounded-lg hover:border-muted-foreground/30 transition-all duration-300" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{investment.name}</p>
                        <p className="text-sm text-muted-foreground">{investment.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">€{investment.amount.toLocaleString()}</p>
                        <p className={`text-sm font-medium ${investment.return > 0 ? 'text-success' : 'text-destructive'}`}>
                          {investment.return > 0 ? '+' : ''}{investment.return}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Long Term Investments */}
          <Card className="investment-card slide-up" style={{ animationDelay: '0.8s' }}>
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Long Term Investments
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                €{investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investments.map((investment, index) => (
                  <div key={`long-${investment.id}`} className="investment-card p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300" style={{ animationDelay: `${0.9 + index * 0.1}s` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{investment.name}</p>
                        <p className="text-sm text-muted-foreground">{investment.category} • Long</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">€{investment.amount.toLocaleString()}</p>
                        <p className={`text-sm font-medium ${investment.return > 0 ? 'text-success' : 'text-destructive'}`}>
                          {investment.return > 0 ? '+' : ''}{investment.return}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Short Term Investments */}
          <Card className="investment-card slide-up" style={{ animationDelay: '0.9s' }}>
            <CardHeader>
              <CardTitle className="text-warning flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                Short Term Investments
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                €{investments.reduce((sum, inv) => sum + inv.amount * 0.3, 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investments.map((investment, index) => (
                  <div key={`short-${investment.id}`} className="investment-card p-4 border border-border/50 rounded-lg hover:border-warning/30 transition-all duration-300" style={{ animationDelay: `${1.0 + index * 0.1}s` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{investment.name}</p>
                        <p className="text-sm text-muted-foreground">{investment.category} • Short</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">€{Math.round(investment.amount * 0.3).toLocaleString()}</p>
                        <p className={`text-sm font-medium ${investment.return > 0 ? 'text-success' : 'text-destructive'}`}>
                          {investment.return > 0 ? '+' : ''}{(investment.return * 0.8).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;