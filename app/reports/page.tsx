// app/reports/page.tsx

'use client';

import { useReports } from '@/lib/hooks/useReports';
import ReportsHeader from '@/components/reports/ReportsHeader';
import ReportStats from '@/components/reports/ReportsStats';
import RevenueGrowthChart from '@/components/reports/RevenueGrowthChart';
import ServicePopularity from '@/components/reports/ServicePopularity';
import HighValueOrdersTable from '@/components/reports/HighValueOrderTable';

export default function ReportsPage() {
  const { reportData, getChartBarHeight, maxRevenue } = useReports();

  const handleExportPDF = () => {
    console.log('Exporting PDF...');
    // Implement PDF export logic here
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <ReportsHeader onExport={handleExportPDF} />
      
      <ReportStats stats={reportData.stats} />
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <RevenueGrowthChart 
            data={reportData.chartData} 
            maxRevenue={maxRevenue}
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