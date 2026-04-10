'use client';

import { HighValueOrder } from '@/lib/types/report';
import HighValueOrdersRow from './HighValueOrderRow';

interface HighValueOrdersTableProps {
  orders: HighValueOrder[];
}

export default function HighValueOrdersTable({ orders }: HighValueOrdersTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          High-Value Orders
        </h3>
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View All History →
        </a>
      </div>

      <table className="w-full">
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
  );
}