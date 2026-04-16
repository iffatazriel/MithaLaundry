'use client';

import { CustomerTableProps } from '@/lib/types/customers';
import CustomerTableRow from './CustomerTableRow';
import CustomerPaginationControls from './CustomerPaginationControls';

export default function CustomerTable({
  customers,
  loading,
  error,
  currentPage,
  totalPages,
  totalCustomers,
  onPageChange,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const itemsPerPage = 10;
  const startItem = totalCustomers === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCustomers);

  if (error) {
    return (
      <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">Customer Directory</h2>
        <p className="mt-1 text-sm text-gray-500">
          Daftar pelanggan aktif dengan status membership dan total order.
        </p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:px-6">
                Customer
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:px-6">
                Phone Number
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:px-6">
                Total Orders
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:px-6">
                Status
              </th>
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:px-6">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(itemsPerPage)].map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-4 py-4 sm:px-6">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                      <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <p className="text-base font-semibold text-gray-700">No customers found</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Coba ubah pencarian atau tambahkan customer baru.
                  </p>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-gray-600">
          {totalCustomers === 0
            ? 'Tidak ada customer untuk ditampilkan'
            : `Showing ${startItem} to ${endItem} of ${totalCustomers} customers`}
        </p>

        {totalPages > 1 && (
          <CustomerPaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}
