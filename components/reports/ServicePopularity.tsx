'use client';

import { ServiceData } from '@/lib/types/report';

interface ServicePopularityProps {
  data: ServiceData[];
  insight?: {
    title: string;
    description: string;
  };
}

export default function ServicePopularity({ data, insight }: ServicePopularityProps) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="col-span-2 bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Service Popularity
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Most requested laundry types
        </p>

        <div className="space-y-5">
          {data.map((service, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-900">
                  {service.name}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {service.percentage}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${service.color}`}
                  style={{ width: `${service.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {insight && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Insight: {insight.title}
              </h4>
              <p className="text-sm text-gray-700">
                {insight.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}