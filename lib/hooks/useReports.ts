// lib/hooks/useReports.ts

import { useEffect, useMemo, useState } from 'react';
import { ReportData, ReportPeriod } from '@/lib/types/report';

const emptyReportData: ReportData = {
  period: 'month',
  periodLabel: 'This Month',
  comparisonLabel: 'vs Last Month',
  stats: {
    revenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    totalOrdersGrowth: 0,
    newCustomers: 0,
    newCustomersGrowth: 0,
    avgProcessingTime: '0h',
    avgProcessingTimeGrowth: 0,
  },
  chartData: [],
  serviceData: [],
  highValueOrders: [],
  insight: {
    title: 'Belum ada data',
    description: 'Laporan akan muncul setelah ada transaksi.',
    icon: 'lightbulb',
  },
};

export function useReports() {
  const [reportData, setReportData] = useState<ReportData>(emptyReportData);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<ReportPeriod>('month');

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/reports?period=${period}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch reports');
        }

        if (isMounted) {
          setReportData(data);
        }
      } catch (error) {
        console.error('Reports fetch error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchReports();

    return () => {
      isMounted = false;
    };
  }, [period]);

  const maxRevenue = useMemo(() => {
    if (reportData.chartData.length === 0) {
      return 1;
    }

    return Math.max(...reportData.chartData.map(d => d.revenue), 1);
  }, [reportData.chartData]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    }
    return `Rp ${(value / 1000).toFixed(0)}K`;
  };

  const getChartBarHeight = (value: number) => {
    return (value / maxRevenue) * 100;
  };

  return {
    reportData,
    loading,
    period,
    setPeriod,
    formatCurrency,
    getChartBarHeight,
    maxRevenue
  };
}
