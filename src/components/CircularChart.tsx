import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
  category: 'inner' | 'middle' | 'outer';
}

const CircularChart = () => {
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
      
    </div>
  );
};

export default CircularChart;