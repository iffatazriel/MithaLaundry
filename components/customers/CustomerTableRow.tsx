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
  const status = (customer.status ?? 'regular').toLowerCase();

  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`${customer.avatarColor ?? 'bg-gray-400'} flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white`}
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
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            status === 'member'
              ? 'bg-blue-50 text-blue-700'
              : status === 'guest'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
              status === 'member'
                ? 'bg-blue-500'
                : status === 'guest'
                  ? 'bg-amber-500'
                  : 'bg-gray-400'
            }`}
          />
          {status.toUpperCase()}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(customer)}
            className="rounded-xl border border-blue-200 px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(customer.id)}
            className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
