import type { Order, DashboardStats, Service } from '@/types'

export const SERVICES: Service[] = [
  {
    id: 'cuci-setrika',
    name: 'Cuci dan Setrika',
    description: 'Complete washing & ironing',
    price: 5000,
    unit: 'kg',
  },
  {
    id: 'setrika',
    name: 'Setrika saja',
    description: 'Quick steam press ironing',
    price: 4000,
    unit: 'kg',
  },
  {
    id: 'cuci-sepatu',
    name: 'Cuci sepatu',
    description: 'Deep cleaning for footwear',
    price: 18000,
    unit: 'pair',
  },
  {
    id: 'bedcover',
    name: 'Cuci selimut/bedcover',
    description: 'Sanitized bulky item wash',
    price: 15000,
    unit: 'item',
  },
]

export const DASHBOARD_STATS: DashboardStats = {
  totalRevenueToday: 2450000,
  revenueChangePercent: 12.5,
  activeOrders: 42,
  activeInWashing: 18,
  pendingPickups: 15,
  expressDeliveries: 5,
  pipeline: {
    sorting: 12,
    washing: 18,
    ironing: 8,
    ready: 4,
  },
}

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const STATUS_LABELS: Record<string, string> = {
  SORTING: 'Sorting',
  WASHING: 'Washing',
  IRONING: 'Ironing',
  READY: 'Ready',
  COMPLETED: 'Completed',
}