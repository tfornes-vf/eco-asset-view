import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";

const Dashboard = () => {
  // Mock data - will be replaced with Holded API data
  const totalInvestments = 125000;
  const economicActivityPercentage = 45; // This will determine red/green color
  const totalReturn = 8.5;
  const isEconomicActivityLow = economicActivityPercentage < 55;

  const investments = [
    {
      id: 1,
      name: "Tech Startup A",
      amount: 25000,
      return: 12.3,
      isEconomicActivity: true,
      category: "Equity"
    },
    {
      id: 2,
      name: "Real Estate Fund",
      amount: 45000,
      return: 6.8,
      isEconomicActivity: false,
      category: "Real Estate"
    },
    {
      id: 3,
      name: "Manufacturing Co.",
      amount: 30000,
      return: 9.2,
      isEconomicActivity: true,
      category: "Industrial"
    },
    {
      id: 4,
      name: "Government Bonds",
      amount: 25000,
      return: 3.1,
      isEconomicActivity: false,
      category: "Fixed Income"
    }
  ];

  const economicActivityInvestments = investments.filter(inv => inv.isEconomicActivity);
  const nonEconomicActivityInvestments = investments.filter(inv => !inv.isEconomicActivity);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Investment Dashboard</h1>
            <p className="text-muted-foreground">Track your portfolio and economic activity</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Last updated: Today
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalInvestments.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Return</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{totalReturn}%</div>
              <p className="text-xs text-muted-foreground">Annualized return</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Economic Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isEconomicActivityLow ? 'text-destructive' : 'text-green-600'}`}>
                {economicActivityPercentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {isEconomicActivityLow ? 'Below target (55%)' : 'Above target'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investments.length}</div>
              <p className="text-xs text-muted-foreground">Active positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Economic Activity Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Economic Activity Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current: {economicActivityPercentage}%</span>
                <span>Target: 55%</span>
              </div>
              <Progress 
                value={economicActivityPercentage} 
                className="h-3"
              />
              {isEconomicActivityLow && (
                <p className="text-sm text-destructive">
                  ⚠️ Economic activity percentage is below the 55% target
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Investment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Economic Activity Investments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Economic Activity Investments</CardTitle>
              <p className="text-sm text-muted-foreground">
                €{economicActivityInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {economicActivityInvestments.map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{investment.name}</p>
                      <p className="text-sm text-muted-foreground">{investment.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{investment.amount.toLocaleString()}</p>
                      <p className={`text-sm ${investment.return > 0 ? 'text-green-600' : 'text-destructive'}`}>
                        {investment.return > 0 ? '+' : ''}{investment.return}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Non-Economic Activity Investments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-muted-foreground">Non-Economic Activity Investments</CardTitle>
              <p className="text-sm text-muted-foreground">
                €{nonEconomicActivityInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nonEconomicActivityInvestments.map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{investment.name}</p>
                      <p className="text-sm text-muted-foreground">{investment.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{investment.amount.toLocaleString()}</p>
                      <p className={`text-sm ${investment.return > 0 ? 'text-green-600' : 'text-destructive'}`}>
                        {investment.return > 0 ? '+' : ''}{investment.return}%
                      </p>
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