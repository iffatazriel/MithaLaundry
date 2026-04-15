'use client';

import { Customer } from '@/lib/types/customers';

interface CustomerTableRowProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customerId: string) => void;
}

export default function CustomerTableRow({
  customer,
  onEdit,
  onDelete
}: CustomerTableRowProps) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`${customer.avatarColor ?? 'bg-gray-400'} text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm`}
          >
            {customer.avatar ?? customer.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.email ?? '-'}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-gray-700">
        {customer.phone}
      </td>

      <td className="px-6 py-4">
        <span className="font-semibold text-blue-600 text-lg">
          {customer.totalOrders ?? 0}
        </span>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            customer.status === 'member'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              customer.status === 'member' ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          />
          {(customer.status ?? 'regular').toUpperCase()}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(customer)}
            className="px-3 py-1.5 text-sm rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(customer.id)}
            className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}