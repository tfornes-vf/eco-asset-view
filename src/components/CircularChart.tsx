import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
  category: 'inner' | 'middle' | 'outer';
}

const CircularChart = () => {
  // Sample data based on the uploaded image structure
  const innerData: ChartData[] = [
    { name: 'Directa', value: 47, color: 'hsl(var(--chart-1))', category: 'inner' },
    { name: 'Indirecta', value: 51, color: 'hsl(var(--muted))', category: 'inner' },
    { name: 'Efectivo', value: 2, color: 'hsl(var(--chart-3))', category: 'inner' }
  ];

  const middleData: ChartData[] = [
    { name: 'Fondos de inversión', value: 26, color: 'hsl(var(--chart-1))', category: 'middle' },
    { name: 'Fondos líquidos', value: 25, color: 'hsl(var(--chart-2))', category: 'middle' },
    { name: 'Propiedades inmobiliarias', value: 22, color: 'hsl(var(--chart-3))', category: 'middle' },
    { name: 'Valores negociables', value: 15, color: 'hsl(var(--chart-4))', category: 'middle' },
    { name: 'Hedge funds', value: 10, color: 'hsl(var(--warning))', category: 'middle' },
    { name: 'Otros', value: 2, color: 'hsl(var(--muted-foreground))', category: 'middle' }
  ];

  const outerData: ChartData[] = [
    { name: 'Renta fija', value: 13, color: 'hsl(var(--chart-1))', category: 'outer' },
    { name: 'Private equity', value: 10, color: 'hsl(var(--chart-2))', category: 'outer' },
    { name: 'Renta variable', value: 9, color: 'hsl(var(--chart-3))', category: 'outer' },
    { name: 'Empresas no cotizadas', value: 6, color: 'hsl(var(--chart-4))', category: 'outer' },
    { name: 'Private equity', value: 6, color: 'hsl(var(--warning))', category: 'outer' },
    { name: 'Renta fija', value: 6, color: 'hsl(var(--success))', category: 'outer' },
    { name: 'Commodities', value: 2, color: 'hsl(var(--destructive))', category: 'outer' },
    { name: 'Venture capital', value: 6, color: 'hsl(var(--primary))', category: 'outer' },
    { name: 'Deuda privada', value: 3, color: 'hsl(var(--secondary))', category: 'outer' },
    { name: 'Infraestructura', value: 2, color: 'hsl(var(--accent))', category: 'outer' },
    { name: 'Inmobiliario', value: 2, color: 'hsl(var(--muted))', category: 'outer' },
    { name: 'Mixtos', value: 3, color: 'hsl(var(--card))', category: 'outer' },
    { name: 'Obras de arte', value: 2, color: 'hsl(var(--border))', category: 'outer' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{payload[0].name}</p>
          <p className="text-primary">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] relative">
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
          >
            {outerData.map((entry, index) => (
              <Cell key={`outer-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Portfolio</p>
          <p className="text-lg font-bold text-foreground">Distribution</p>
        </div>
      </div>
    </div>
  );
};

export default CircularChart;