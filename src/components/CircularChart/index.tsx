import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CircularChartProps, CenterData } from './types';
import { innerData, middleData, outerData } from './data';
import { renderMiddleLabel, renderOuterLabel } from './renderUtils';
import CenterStats from './CenterStats';
import MiddlePercentages from './MiddlePercentages';

const CircularChart: React.FC<CircularChartProps> = ({ economicActivityPercentage, totalInvestments }) => {
  const { centerData, economicAmount, nonEconomicAmount } = useMemo(() => {
    const ecoAmount = (totalInvestments * economicActivityPercentage) / 100;
    const nonEcoAmount = totalInvestments - ecoAmount;

    const data: CenterData[] = [
      { 
        name: 'Actividad Económica', 
        value: economicActivityPercentage, 
        color: 'hsl(var(--success))',
        amount: ecoAmount
      },
      { 
        name: 'No Económica', 
        value: 100 - economicActivityPercentage, 
        color: 'hsl(var(--muted-foreground))',
        amount: nonEcoAmount
      }
    ];

    return { centerData: data, economicAmount: ecoAmount, nonEconomicAmount: nonEcoAmount };
  }, [economicActivityPercentage, totalInvestments]);

  return (
    <div className="w-full h-[500px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
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

export default React.memo(CircularChart);