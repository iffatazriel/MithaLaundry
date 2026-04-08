import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import type { Order, DashboardStats } from '@/types'

interface RecentOrdersProps {
  orders: Order[]
  pipeline: DashboardStats['pipeline']
}

const PIPELINE_STAGES = [
  { key: 'sorting', label: 'Sorting', color: 'bg-gray-700' },
  { key: 'washing', label: 'Washing', color: 'bg-blue-800' },
  { key: 'ironing', label: 'Ironing', color: 'bg-gray-500' },
  { key: 'ready', label: 'Ready', color: 'bg-gray-400' },
] as const

export default function RecentOrders({ orders, pipeline }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-gray-900">Recent Orders</h2>
        <Link href="/orders" className="text-sm text-blue-700 hover:underline">
          View All Orders
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            {['Customer', 'Service', 'Status', 'Est. Completion', 'Action'].map((h) => (
              <th key={h} className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide pb-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-gray-50">
              <td className="py-3 pr-4">
                <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                <p className="text-[11px] text-gray-400">#{order.orderNumber}</p>
              </td>
              <td className="py-3 pr-4">
                <p className="text-sm text-gray-700">{order.items[0]?.serviceName}</p>
                <p className="text-[11px] text-gray-400">
                  {order.items[0]?.quantity} {order.items[0]?.unit === 'kg' ? 'Kg' : order.items[0]?.unit === 'pair' ? 'Pasang' : 'Item'}
                  {order.items[0]?.serviceName === 'Bedcover' ? ' (King)' : ''}
                </p>
              </td>
              <td className="py-3 pr-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="py-3 pr-4">
                {order.status === 'COMPLETED' ? (
                  <span className="text-sm font-semibold text-green-600">COMPLETED</span>
                ) : (
                  <span className="text-sm text-gray-600">{order.estimatedCompletion}</span>
                )}
              </td>
              <td className="py-3">
                <button className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium whitespace-nowrap">
                  📋 WhatsApp Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Process Pipeline */}
      <div className="mt-6">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Process Pipeline</p>
        <div className="grid grid-cols-4 rounded-lg overflow-hidden">
          {PIPELINE_STAGES.map(({ key, label, color }) => (
            <div key={key} className={`${color} text-white text-center py-2.5 text-xs font-semibold tracking-wide`}>
              {label.toUpperCase()} ({pipeline[key]})
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}