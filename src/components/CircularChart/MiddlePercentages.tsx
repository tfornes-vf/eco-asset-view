import { middleData } from './data';

const MiddlePercentages: React.FC = () => {
  return (
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
  );
};

export default MiddlePercentages;