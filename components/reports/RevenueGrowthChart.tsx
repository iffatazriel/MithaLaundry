'use client';

import { ChartData } from '@/lib/types/report';

interface RevenueGrowthChartProps {
  data: ChartData[];
  maxRevenue: number;
  periodLabel: string;
}

export default function RevenueGrowthChart({
  data,
  maxRevenue,
  periodLabel,
}: RevenueGrowthChartProps) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Revenue Growth
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Revenue trend for {periodLabel.toLowerCase()}
      </p>

      <div className="mb-6 h-56 overflow-x-auto sm:h-64">
        <div className="flex h-full min-w-[560px] items-end justify-between gap-2">
        {data.map((item, index) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-full rounded transition-all hover:opacity-80 cursor-pointer ${
                  item.isHighlight ? 'bg-blue-600' : 'bg-blue-100'
                }`}
                style={{ height: `${heightPercent}%` }}
              >
                {item.isHighlight && (
                  <div className="h-full flex items-start justify-center pt-2">
                    <span className="text-white text-xs font-bold">
                      {item.week}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      <div className="flex min-w-[560px] justify-between overflow-x-auto text-center">
        {data.map((item, index) => (
          <p key={index} className="flex-1 text-xs font-medium text-gray-600">
            {item.week}
          </p>
        ))}
      </div>
    </div>
  );
}
