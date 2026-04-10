// lib/types/report.ts

export interface ReportStats {
  monthlyRevenue: number;
  monthlyRevenueGrowth: number;
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
  stats: ReportStats;
  chartData: ChartData[];
  serviceData: ServiceData[];
  highValueOrders: HighValueOrder[];
  insight: Insight;
}