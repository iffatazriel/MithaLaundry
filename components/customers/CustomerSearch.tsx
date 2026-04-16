'use client';

import { ArrowDownUp, Download, Search, SlidersHorizontal } from 'lucide-react';
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
    <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 lg:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <select
                value={filters.status ?? 'all'}
                onChange={(e) =>
                  onFilterChange({ status: e.target.value as CustomerFilters['status'] })
                }
                className="bg-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="member">Member</option>
                <option value="guest">Guest</option>
              </select>
            </label>

            <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
              <ArrowDownUp size={16} className="text-gray-400" />
              <select
                value={filters.sortBy ?? 'name'}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value as CustomerFilters['sortBy'] })
                }
                className="bg-transparent outline-none"
              >
                <option value="name">Sort by Name</option>
                <option value="orders">Sort by Orders</option>
              </select>
            </label>
          </div>
        </div>

        {onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download size={16} />
            Export
          </button>
        )}
      </div>
    </div>
  );
}
