interface Investment {
  id: string;
  name: string;
  amount: number;
  return: number;
  category: string;
}

interface InvestmentListProps {
  investments: Investment[];
}

const InvestmentList: React.FC<InvestmentListProps> = ({ investments }) => {
  if (investments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay inversiones en esta categoría
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {investments.map((investment, index) => (
        <div 
          key={investment.id} 
          className="investment-card p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300" 
          style={{ animationDelay: `${0.1 + index * 0.05}s` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{investment.name}</p>
              <p className="text-sm text-muted-foreground">{investment.category}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-foreground">€{investment.amount.toLocaleString()}</p>
              <p className={`text-sm font-medium ${investment.return > 0 ? 'text-success' : 'text-destructive'}`}>
                {investment.return > 0 ? '+' : ''}{investment.return}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvestmentList;