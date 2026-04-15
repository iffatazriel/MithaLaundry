'use client';

import { CustomerTableProps } from '@/lib/types/customers';
import CustomerTableRow from './CustomerTableRow';
import CustomerTablePagination from './CustomerTablePagination';

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
  const itemsPerPage = 4;
  const startItem = totalCustomers === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCustomers);

  if (error) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
      {/* Table wrapper */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Total Orders
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(itemsPerPage)].map((_, index) => (
                <tr key={index} className="animate-pulse border-b border-gray-100">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                      <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No customers found
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

      {/* Footer pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalCustomers} customers
          </p>

          <CustomerTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}