// lib/mockData/reports.ts

import { ReportData } from "../types/report";

export const mockReportData: ReportData = {
  stats: {
    monthlyRevenue: 42800000,
    monthlyRevenueGrowth: 12.5,
    totalOrders: 1482,
    totalOrdersGrowth: 4.2,
    newCustomers: 128,
    newCustomersGrowth: -1.8,
    avgProcessingTime: '32.5h',
    avgProcessingTimeGrowth: 8
  },

  chartData: [
    { week: 'WK 01', revenue: 3200000 },
    { week: 'WK 02', revenue: 3400000 },
    { week: 'WK 03', revenue: 3100000 },
    { week: 'WK 04', revenue: 3500000 },
    { week: 'WK 05', revenue: 3700000 },
    { week: 'WK 06', revenue: 3300000 },
    { week: 'WK 07', revenue: 4200000, isHighlight: true },
    { week: 'WK 08', revenue: 3400000 },
    { week: 'WK 09', revenue: 3800000 }
  ],

  serviceData: [
    { name: 'Cuci Setrika', percentage: 48, color: 'bg-blue-600' },
    { name: 'Setrika Saja', percentage: 24, color: 'bg-blue-400' },
    { name: 'Cuci Selimut/Bedcover', percentage: 18, color: 'bg-blue-200' },
    { name: 'Cuci Karpet', percentage: 10, color: 'bg-gray-300' }
  ],

  highValueOrders: [
    {
      id: 'ORD-8621',
      customerName: 'Aditya Nugraha',
      customerInitials: 'AN',
      customerColor: 'bg-blue-500',
      serviceType: 'Express Cuci + Setrika',
      amount: 450000,
      status: 'completed',
      date: 'Oct 12, 2023'
    },
    {
      id: 'ORD-8819',
      customerName: 'Siska Putri',
      customerInitials: 'SP',
      customerColor: 'bg-blue-300',
      serviceType: 'Setrika Saja (20kg)',
      amount: 320000,
      status: 'in_progress',
      date: 'Oct 12, 2023'
    },
    {
      id: 'ORD-8754',
      customerName: 'Rudi Ramdan',
      customerInitials: 'RR',
      customerColor: 'bg-orange-500',
      serviceType: 'Premium Carpet Care',
      amount: 890000,
      status: 'completed',
      date: 'Oct 11, 2023'
    }
  ],

  insight: {
    title: '"Cuci Setrika" is currently peaking',
    description: 'Consider a bundling discount for "Setrika Saja" to balance workload.',
    icon: 'lightbulb'
  }
};