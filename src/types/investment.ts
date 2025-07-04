export interface Investment {
  external_id: string;
  name: string;
  amount: number;
  return_percentage: number;
  is_economic_activity: boolean;
  category: string;
  account_code?: string;
  description?: string;
  investment_type?: string;
  sub_category?: string;
  detail_category?: string;
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