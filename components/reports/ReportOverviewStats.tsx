'use client';

import { ReportStats as ReportStatsType } from '@/lib/types/report';

interface ReportOverviewStatsProps {
  stats: ReportStatsType;
  periodLabel: string;
  comparisonLabel: string;
}

export default function ReportOverviewStats({
  stats,
  periodLabel,
  comparisonLabel,
}: ReportOverviewStatsProps) {
  const statCards = [
    {
      icon: 'wallet',
      label: `Revenue ${periodLabel}`,
      value: `Rp ${(stats.revenue / 1000000).toFixed(1)}M`,
      change: stats.revenueGrowth,
      changeLabel: comparisonLabel,
    },
    {
      icon: 'orders',
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: stats.totalOrdersGrowth,
      changeLabel: comparisonLabel,
    },
    {
      icon: 'customers',
      label: 'New Customers',
      value: stats.newCustomers,
      change: stats.newCustomersGrowth,
      changeLabel: comparisonLabel,
    },
    {
      icon: 'time',
      label: 'Avg. Processing Time',
      value: stats.avgProcessingTime,
      change: stats.avgProcessingTimeGrowth,
      changeLabel: 'faster',
      isFaster: true,
    },
  ];

  const getIcon = (icon: string) => {
    const icons: Record<string, JSX.Element> = {
      wallet: (
        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l1.007 0A1 1 0 004 10V7a1 1 0 00-1-1H3a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-1.007a1 1 0 00-1 1v3a1 1 0 001 1H19" />
        </svg>
      ),
      orders: (
        <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m8 4v10l8-4v-10" />
        </svg>
      ),
      customers: (
        <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      time: (
        <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };

    return icons[icon] || null;
  };

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-4">{getIcon(card.icon)}</div>
          <p className="mb-2 text-sm text-gray-600">{card.label.toUpperCase()}</p>
          <p className="mb-2 text-2xl font-bold text-gray-900">{card.value}</p>
          <p
            className={`flex items-center gap-1 text-sm font-medium ${
              card.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <span>{card.change > 0 ? '+' : '-'}</span>
            <span>{Math.abs(card.change)}%</span>
            <span>{card.isFaster ? 'faster' : card.changeLabel}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
