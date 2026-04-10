'use client';
 
import { CustomerFilters } from '@/lib/types/customers';
 
interface CustomerSearchProps {
  filters: CustomerFilters;
  onFilterChange: (filters: Partial<CustomerFilters>) => void;
  onExport?: () => void;
}
 
export default function CustomerSearch({
  filters,
  onFilterChange,
  onExport
}: CustomerSearchProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search customers..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
 
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 016 0v12a1 1 0 01-6 0V4z" />
          </svg>
          <span className="text-sm font-medium">Filter</span>
        </button>
 
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-sm font-medium">Export</span>
          </button>
        )}
      </div>
    </div>
  );
}   