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
  onPageChange,
  onEdit,
  onDelete
}: CustomerTableProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {error}
      </div>
    );
  }
 
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Total Orders
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                Loading customers...
              </td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
 
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * 4 + 1} to {Math.min(currentPage * 4, 1482)} of 1,482 customers
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