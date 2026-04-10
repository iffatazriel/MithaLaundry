'use client';

import { ReportStats as ReportStatsType } from '@/lib/types/report';

interface ReportStatsProps {
  stats: ReportStatsType;
}

export default function ReportStats({ stats }: ReportStatsProps) {
  const statCards = [
    {
      icon: 'wallet',
      label: 'Monthly Revenue',
      value: `Rp ${(stats.monthlyRevenue / 1000000).toFixed(1)}M`,
      change: stats.monthlyRevenueGrowth,
      changeLabel: 'vs Last Month'
    },
    {
      icon: 'orders',
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.totalOrdersGrowth,
      changeLabel: 'vs Last Month'
    },
    {
      icon: 'customers',
      label: 'New Customers',
      value: stats.newCustomers,
      change: stats.newCustomersGrowth,
      changeLabel: 'vs Last Month'
    },
    {
      icon: 'time',
      label: 'Avg. Processing Time',
      value: stats.avgProcessingTime,
      change: stats.avgProcessingTimeGrowth,
      changeLabel: 'faster',
      isFaster: true
    }
  ];

  const getIcon = (icon: string) => {
    const icons: Record<string, JSX.Element> = {
      wallet: (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l1.007 0A1 1 0 004 10V7a1 1 0 00-1-1H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-1.007a1 1 0 00-1 1v3a1 1 0 001 1H19" />
        </svg>
      ),
      orders: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m8 4v10l8-4v-10" />
        </svg>
      ),
      customers: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      time: (
        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[icon] || null;
  };

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="mb-4">
            {getIcon(card.icon)}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {card.label.toUpperCase()}
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {card.value}
          </p>
          <p className={`text-sm font-medium flex items-center gap-1 ${
            card.change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {card.change > 0 ? '↗' : '↘'} {Math.abs(card.change)}% {card.isFaster ? 'faster' : card.changeLabel}
          </p>
        </div>
      ))}
    </div>
  );
}