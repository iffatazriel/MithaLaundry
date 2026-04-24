'use client';

import type { ReportPeriod } from '@/lib/types/report';

interface ReportsHeaderProps {
  onExport?: () => void;
  isExporting?: boolean;
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
}

const PERIOD_OPTIONS: Array<{ id: ReportPeriod; label: string }> = [
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
];

export default function ReportsHeader({
  onExport,
  isExporting = false,
  period,
  onPeriodChange,
}: ReportsHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-blue-600 mb-2 uppercase">
        Performance Analytics
      </p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Reports & Insights
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => {
              const isActive = period === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => onPeriodChange(option.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isExporting ? 'Menyiapkan PDF...' : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
