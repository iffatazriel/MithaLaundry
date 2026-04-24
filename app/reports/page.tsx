// app/reports/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useReports } from '@/lib/hooks/useReports';
import ReportsHeader from '@/components/reports/ReportsHeader';
import ReportOverviewStats from '@/components/reports/ReportOverviewStats';
import RevenueGrowthChart from '@/components/reports/RevenueGrowthChart';
import ServicePopularity from '@/components/reports/ServicePopularity';
import HighValueOrdersTable from '@/components/reports/HighValueOrderTable';

export default function ReportsPage() {
  const router = useRouter();
  const { reportData, period, setPeriod, maxRevenue } = useReports();

  const handleExportPDF = () => {
    router.push(`/reports/print?period=${period}`);
  };

  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <ReportsHeader
        onExport={handleExportPDF}
        period={period}
        onPeriodChange={setPeriod}
      />
      
      <ReportOverviewStats
        stats={reportData.stats}
        periodLabel={reportData.periodLabel}
        comparisonLabel={reportData.comparisonLabel}
      />
      
      <div className="mb-8 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueGrowthChart 
            data={reportData.chartData} 
            maxRevenue={maxRevenue}
            periodLabel={reportData.periodLabel}
          />
        </div>
      </div>

      <ServicePopularity 
        data={reportData.serviceData}
        insight={reportData.insight}
      />

      <HighValueOrdersTable orders={reportData.highValueOrders} />
    </main>
  );
}
