'use client';

import { HighValueOrder } from '@/lib/types/report';
import HighValueOrdersRow from './HighValueOrderRow';

interface HighValueOrdersTableProps {
  orders: HighValueOrder[];
}

export default function HighValueOrdersTable({ orders }: HighValueOrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h3 className="text-lg font-semibold text-gray-900">
          High-Value Orders
        </h3>
        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All History →
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
              Customer
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
              Service Type
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
              Amount
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <HighValueOrdersRow key={order.id} order={order} />
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}
