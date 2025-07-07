import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface CategoryData {
  name: string;
  economicCount: number;
  nonEconomicCount: number;
  economicTotal: number;
  nonEconomicTotal: number;
}

interface CategorySummaryProps {
  categories: CategoryData[];
}

const CategorySummary: React.FC<CategorySummaryProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <Link 
          key={category.name} 
          to={`/categoria/${encodeURIComponent(category.name.toLowerCase())}`}
          className="block group"
        >
          <Card className="investment-card hover:border-primary/50 transition-all duration-300 h-full" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between group-hover:text-primary transition-colors">
                <span className="capitalize">{category.name}</span>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Economic Activity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-success">Actividad Económica</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.economicCount}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-bold text-success">€{category.economicTotal.toLocaleString()}</p>
              </div>

              {/* Non-Economic Activity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <span className="text-sm text-muted-foreground">No Económica</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {category.nonEconomicCount}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-bold text-muted-foreground">€{category.nonEconomicTotal.toLocaleString()}</p>
              </div>

              {/* Total */}
              <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-bold text-foreground">
                    €{(category.economicTotal + category.nonEconomicTotal).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default CategorySummary;