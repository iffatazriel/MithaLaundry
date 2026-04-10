// lib/hooks/useReports.ts

import { useState, useMemo } from 'react';
import { ReportData } from '@/lib/types/report';
import { mockReportData } from '@/lib/mockData/reports';

export function useReports() {
  const [reportData, setReportData] = useState<ReportData>(mockReportData);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('month');

  const maxRevenue = useMemo(() => {
    return Math.max(...reportData.chartData.map(d => d.revenue));
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