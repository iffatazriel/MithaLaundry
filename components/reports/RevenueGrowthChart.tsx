'use client';

import { ChartData } from '@/lib/types/report';

interface RevenueGrowthChartProps {
  data: ChartData[];
  maxRevenue: number;
}

export default function RevenueGrowthChart({ data, maxRevenue }: RevenueGrowthChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Revenue Growth
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Weekly performance over the last 3 months
      </p>

      <div className="flex items-end justify-between gap-2 h-64 mb-6">
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

      <div className="flex justify-between">
        {data.map((item, index) => (
          <p key={index} className="text-xs text-gray-600 font-medium">
            {item.week}
          </p>
        ))}
      </div>
    </div>
  );
}