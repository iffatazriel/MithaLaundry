// lib/types/report.ts

export type ReportPeriod = 'month' | 'quarter' | 'year';

export interface ReportStats {
  revenue: number;
  revenueGrowth: number;
  totalOrders: number;
  totalOrdersGrowth: number;
  newCustomers: number;
  newCustomersGrowth: number;
  avgProcessingTime: string;
  avgProcessingTimeGrowth: number;
}

export interface ChartData {
  week: string;
  revenue: number;
  isHighlight?: boolean;
}

export interface ServiceData {
  name: string;
  percentage: number;
  color: string;
}

export interface HighValueOrder {
  id: string;
  customerName: string;
  customerInitials: string;
  customerColor: string;
  serviceType: string;
  amount: number;
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
}

export interface Insight {
  title: string;
  description: string;
  icon: string;
}

export interface ReportData {
  period: ReportPeriod;
  periodLabel: string;
  comparisonLabel: string;
  stats: ReportStats;
  chartData: ChartData[];
  serviceData: ServiceData[];
  highValueOrders: HighValueOrder[];
  insight: Insight;
}
