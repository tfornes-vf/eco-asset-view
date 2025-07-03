export interface Investment {
  id: string;
  name: string;
  amount: number;
  return: number;
  isEconomicActivity: boolean;
  category: string;
  accountCode?: string;
  description?: string;
  dateCreated?: string;
  lastUpdated?: string;
}

export interface HoldedApiResponse {
  data: Investment[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardMetrics {
  totalInvestments: number;
  economicActivityPercentage: number;
  totalReturn: number;
  totalPositions: number;
}