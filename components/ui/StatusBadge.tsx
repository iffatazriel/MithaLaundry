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
  const normalizedStatus = status.toUpperCase() as OrderStatus

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${STATUS_STYLES[normalizedStatus]}`}>
      {normalizedStatus}
    </span>
  )
}
