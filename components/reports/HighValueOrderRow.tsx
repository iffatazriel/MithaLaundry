'use client';

import { HighValueOrder } from '@/lib/types/report';

interface HighValueOrdersRowProps {
  order: HighValueOrder;
}

export default function HighValueOrdersRow({ order }: HighValueOrdersRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓ COMPLETED';
      case 'in_progress':
        return '→ IN PROGRESS';
      case 'pending':
        return '• PENDING';
      default:
        return status;
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`${order.customerColor} text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm`}>
            {order.customerInitials}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {order.customerName}
            </p>
            <p className="text-xs text-gray-500">
              {order.id}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {order.serviceType}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
        Rp {order.amount.toLocaleString('id-ID')}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {order.date}
      </td>
    </tr>
  );
}