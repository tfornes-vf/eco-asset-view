import { PieChart, Pie, Cell, ResponsiveContainer, LabelList } from 'recharts';

interface CircularChartProps {
  economicActivityPercentage: number;
  totalInvestments: number;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  category: 'inner' | 'middle' | 'outer';
}

const CircularChart: React.FC<CircularChartProps> = ({ economicActivityPercentage, totalInvestments }) => {
  // Data based on the Spanish investment chart structure
  const innerData: ChartData[] = [
    { name: 'Directa', value: 47, color: 'hsl(25, 95%, 53%)', category: 'inner' },
    { name: 'Indirecta', value: 51, color: 'hsl(210, 40%, 70%)', category: 'inner' },
    { name: 'Efectivo', value: 2, color: 'hsl(210, 40%, 85%)', category: 'inner' }
  ];

  const middleData: ChartData[] = [
    { name: 'Fondos de inversión', value: 26, color: 'hsl(25, 95%, 53%)', category: 'middle' },
    { name: 'Fondos líquidos', value: 25, color: 'hsl(25, 85%, 60%)', category: 'middle' },
    { name: 'Propiedades inmobiliarias', value: 22, color: 'hsl(25, 75%, 65%)', category: 'middle' },
    { name: 'Valores negociables', value: 15, color: 'hsl(25, 65%, 70%)', category: 'middle' },
    { name: 'Hedge funds', value: 10, color: 'hsl(25, 55%, 75%)', category: 'middle' },
    { name: 'Mixtos', value: 2, color: 'hsl(25, 45%, 80%)', category: 'middle' }
  ];

  const outerData: ChartData[] = [
    { name: 'Renta fija', value: 13, color: 'hsl(25, 95%, 53%)', category: 'outer' },
    { name: 'Private equity', value: 10, color: 'hsl(25, 85%, 58%)', category: 'outer' },
    { name: 'Renta variable', value: 9, color: 'hsl(25, 75%, 63%)', category: 'outer' },
    { name: 'Empresas no cotizadas y proyectos', value: 6, color: 'hsl(25, 65%, 68%)', category: 'outer' },
    { name: 'Commodities', value: 6, color: 'hsl(25, 55%, 73%)', category: 'outer' },
    { name: 'Venture capital', value: 6, color: 'hsl(25, 45%, 78%)', category: 'outer' },
    { name: 'Deuda privada', value: 3, color: 'hsl(25, 35%, 83%)', category: 'outer' },
    { name: 'Infraestructura', value: 2, color: 'hsl(25, 25%, 88%)', category: 'outer' },
    { name: 'Inmobiliario', value: 2, color: 'hsl(25, 15%, 93%)', category: 'outer' },
    { name: 'Obras de arte, joyas etc.', value: 2, color: 'hsl(210, 40%, 70%)', category: 'outer' }
  ];

  const renderCustomLabel = (entry: any, radius: number) => {
    const RADIAN = Math.PI / 180;
    const midAngle = (entry.startAngle + entry.endAngle) / 2;
    const x = entry.cx + radius * Math.cos(-midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-midAngle * RADIAN);

    if (entry.value < 5) return null; // Don't show labels for small segments

    return (
      <text 
        x={x} 
        y={y} 
        fill="hsl(var(--foreground))" 
        textAnchor={x > entry.cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="11"
        fontWeight="500"
      >
        {`${entry.name} ${entry.value}%`}
      </text>
    );
  };

  const economicAmount = (totalInvestments * economicActivityPercentage) / 100;
  const nonEconomicAmount = totalInvestments - economicAmount;

  return (
    <div className="w-full h-[450px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Inner ring */}
          <Pie
            data={innerData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={60}
            dataKey="value"
            startAngle={90}
            endAngle={450}
            label={(entry) => renderCustomLabel(entry, 80)}
          >
            {innerData.map((entry, index) => (
              <Cell key={`inner-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {/* Middle ring */}
          <Pie
            data={middleData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            dataKey="value"
            startAngle={90}
            endAngle={450}
            label={(entry) => renderCustomLabel(entry, 130)}
          >
            {middleData.map((entry, index) => (
              <Cell key={`middle-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {/* Outer ring */}
          <Pie
            data={outerData}
            cx="50%"
            cy="50%"
            innerRadius={120}
            outerRadius={160}
            dataKey="value"
            startAngle={90}
            endAngle={450}
            label={(entry) => renderCustomLabel(entry, 180)}
          >
            {outerData.map((entry, index) => (
              <Cell key={`outer-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Stats Display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm font-medium text-foreground">Actividad Económica</span>
            </div>
            <div className="text-lg font-bold text-success">{economicActivityPercentage}%</div>
            <div className="text-xs text-muted-foreground">€{economicAmount.toLocaleString()}</div>
            
            <div className="border-t border-border/50 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                <span className="text-sm font-medium text-foreground">No Económica</span>
              </div>
              <div className="text-lg font-bold text-muted-foreground">{(100 - economicActivityPercentage).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">€{nonEconomicAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularChart;