export interface CircularChartProps {
  economicActivityPercentage: number;
  totalInvestments: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
  category: 'inner' | 'middle' | 'outer';
}

export interface CenterData {
  name: string;
  value: number;
  color: string;
  amount: number;
}