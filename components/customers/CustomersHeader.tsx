'use client';

import { Plus, Users } from 'lucide-react';

interface CustomersHeaderProps {
  onAddClick?: () => void;
}

export default function CustomersHeader({ onAddClick }: CustomersHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 text-sm font-medium text-blue-600">CRM / Customers</p>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Customers
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Kelola pelanggan loyal, anggota aktif, dan riwayat hubungan pelanggan dalam satu alur yang rapi.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
      >
        <Plus size={18} />
        Add New Customer
      </button>
    </div>
  );
}
