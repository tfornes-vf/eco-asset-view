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

  const renderMiddleLabel = (entry: any, radius: number) => {
    const RADIAN = Math.PI / 180;
    const midAngle = (entry.startAngle + entry.endAngle) / 2;
    const x = entry.cx + radius * Math.cos(-midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-midAngle * RADIAN);

    if (entry.value < 3) return null; // Don't show labels for very small segments

    return (
      <text 
        x={x} 
        y={y} 
        fill="hsl(var(--foreground))" 
        textAnchor={x > entry.cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="11"
        fontWeight="600"
        className="drop-shadow-md"
        style={{
          filter: 'drop-shadow(1px 1px 2px hsl(var(--background)))',
          stroke: 'hsl(var(--background))',
          strokeWidth: '0.5px',
          paintOrder: 'stroke fill'
        }}
      >
        {entry.name}
      </text>
    );
  };

  const renderMiddlePercentage = (entry: any, innerRadius: number, outerRadius: number) => {
    const RADIAN = Math.PI / 180;
    const midAngle = (entry.startAngle + entry.endAngle) / 2;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = entry.cx + radius * Math.cos(-midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-midAngle * RADIAN);

    if (entry.value < 3) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="hsl(var(--foreground))" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="9"
        fontWeight="600"
      >
        {`${entry.value}%`}
      </text>
    );
  };

  const renderOuterLabel = (entry: any, radius: number) => {
    const RADIAN = Math.PI / 180;
    const midAngle = (entry.startAngle + entry.endAngle) / 2;
    const x = entry.cx + radius * Math.cos(-midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Line end points
    const lineEndX = entry.cx + (radius + 25) * Math.cos(-midAngle * RADIAN);
    const lineEndY = entry.cy + (radius + 25) * Math.sin(-midAngle * RADIAN);
    
    // Text position
    const textX = entry.cx + (radius + 35) * Math.cos(-midAngle * RADIAN);
    const textY = entry.cy + (radius + 35) * Math.sin(-midAngle * RADIAN);

    if (entry.value < 2) return null;

    return (
      <g>
        {/* Connection line with better contrast */}
        <line 
          x1={x} 
          y1={y} 
          x2={lineEndX} 
          y2={lineEndY} 
          stroke="hsl(var(--foreground))" 
          strokeWidth="1.5"
          opacity="0.7"
        />
        {/* Label with better contrast */}
        <text 
          x={textX} 
          y={textY} 
          fill="hsl(var(--foreground))" 
          textAnchor={textX > entry.cx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize="10"
          fontWeight="600"
          style={{
            filter: 'drop-shadow(1px 1px 2px hsl(var(--background)))',
            stroke: 'hsl(var(--background))',
            strokeWidth: '0.5px',
            paintOrder: 'stroke fill'
          }}
        >
          {`${entry.name} ${entry.value}%`}
        </text>
      </g>
    );
  };

  const economicAmount = (totalInvestments * economicActivityPercentage) / 100;
  const nonEconomicAmount = totalInvestments - economicAmount;

  // Create center data for inner ring
  const centerData = [
    { 
      name: 'Actividad Económica', 
      value: economicActivityPercentage, 
      color: 'hsl(var(--success))',
      amount: economicAmount
    },
    { 
      name: 'No Económica', 
      value: 100 - economicActivityPercentage, 
      color: 'hsl(var(--muted-foreground))',
      amount: nonEconomicAmount
    }
  ];

  return (
    <div className="w-full h-[500px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Level 1 - Center ring (Economic Activity) */}
          <Pie
            data={centerData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={50}
            dataKey="value"
            startAngle={90}
            endAngle={450}
          >
            {centerData.map((entry, index) => (
              <Cell key={`center-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {/* Level 2 - Middle ring */}
          <Pie
            data={middleData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            startAngle={90}
            endAngle={450}
            label={(entry) => renderMiddleLabel(entry, 115)}
          >
            {middleData.map((entry, index) => (
              <Cell key={`middle-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {/* Level 3 - Outer ring */}
          <Pie
            data={outerData}
            cx="50%"
            cy="50%"
            innerRadius={110}
            outerRadius={150}
            dataKey="value"
            startAngle={90}
            endAngle={450}
            label={(entry) => renderOuterLabel(entry, 150)}
          >
            {outerData.map((entry, index) => (
              <Cell key={`outer-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Level 2 Percentages */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full">
          {middleData.map((entry, index) => {
            const angle = (entry.value / 100) * 360;
            const startAngle = middleData.slice(0, index).reduce((sum, item) => sum + (item.value / 100) * 360, 0) + 90;
            const midAngle = startAngle + angle / 2;
            const RADIAN = Math.PI / 180;
            const cx = 250; // Center X (assuming 500px width)
            const cy = 250; // Center Y (assuming 500px height)
            const radius = 80; // Middle point of level 2 ring
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            if (entry.value < 3) return null;

            return (
              <text 
                key={`middle-percent-${index}`}
                x={x} 
                y={y} 
                fill="hsl(var(--foreground))" 
                textAnchor="middle" 
                dominantBaseline="central"
                fontSize="10"
                fontWeight="700"
                style={{
                  filter: 'drop-shadow(1px 1px 3px hsl(var(--background)))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: '0.8px',
                  paintOrder: 'stroke fill'
                }}
              >
                {`${entry.value}%`}
              </text>
            );
          })}
        </svg>
      </div>
      
      {/* Center Stats Display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-success font-medium">{economicActivityPercentage}%</span>
            </div>
            <div className="text-xs text-success">€{economicAmount.toLocaleString()}</div>
            
            <div className="flex items-center justify-center gap-1 mt-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              <span className="text-muted-foreground font-medium">{(100 - economicActivityPercentage).toFixed(1)}%</span>
            </div>
            <div className="text-xs text-muted-foreground">€{nonEconomicAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularChart;