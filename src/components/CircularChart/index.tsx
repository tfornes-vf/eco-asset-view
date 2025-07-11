import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CircularChartProps, CenterData } from './types';
import { innerData, middleData, outerData } from './data';
import { renderMiddleLabel, renderOuterLabel } from './renderUtils';
import CenterStats from './CenterStats';
import MiddlePercentages from './MiddlePercentages';

const CircularChart: React.FC<CircularChartProps> = ({ economicActivityPercentage, totalInvestments }) => {
  const economicAmount = (totalInvestments * economicActivityPercentage) / 100;
  const nonEconomicAmount = totalInvestments - economicAmount;

  // Create center data for inner ring
  const centerData: CenterData[] = [
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

      <MiddlePercentages />
      
      <CenterStats 
        centerData={centerData}
        economicActivityPercentage={economicActivityPercentage}
        economicAmount={economicAmount}
        nonEconomicAmount={nonEconomicAmount}
      />
    </div>
  );
};

export default CircularChart;