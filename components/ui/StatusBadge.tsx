import type { OrderStatus } from '@/types'

const STATUS_STYLES: Record<OrderStatus, string> = {
  SORTING: 'bg-gray-100 text-gray-600',
  WASHING: 'bg-blue-100 text-blue-700',
  IRONING: 'bg-amber-100 text-amber-700',
  READY: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-green-100 text-green-700',
}

interface StatusBadgeProps {
  status: OrderStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}