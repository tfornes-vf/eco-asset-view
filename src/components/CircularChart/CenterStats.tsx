import { CenterData } from './types';

interface CenterStatsProps {
  centerData: CenterData[];
  economicActivityPercentage: number;
  economicAmount: number;
  nonEconomicAmount: number;
}

const CenterStats: React.FC<CenterStatsProps> = ({ 
  economicActivityPercentage, 
  economicAmount, 
  nonEconomicAmount 
}) => {
  return (
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
  );
};

export default CenterStats;