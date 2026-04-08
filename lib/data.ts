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

export const RECENT_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2891',
    customer: { id: 'c1', name: 'Budi Santoso', phone: '081234567890' },
    items: [{ serviceType: 'cuci-setrika', serviceName: 'Cuci & Setrika', pricePerUnit: 5000, unit: 'kg', quantity: 5.2, subtotal: 26000 }],
    totalAmount: 26000,
    status: 'WASHING',
    paymentMethod: 'cash',
    estimatedCompletion: 'Today, 17:00',
    createdAt: '2024-10-24T08:00:00',
    itemCount: 5,
  },
  {
    id: '2',
    orderNumber: 'ORD-2890',
    customer: { id: 'c2', name: 'Siska Amelia', phone: '081987654321' },
    items: [{ serviceType: 'cuci-sepatu', serviceName: 'Cuci Sepatu', pricePerUnit: 18000, unit: 'pair', quantity: 2, subtotal: 36000 }],
    totalAmount: 36000,
    status: 'SORTING',
    paymentMethod: 'qris',
    estimatedCompletion: 'Oct 26, 10:00',
    createdAt: '2024-10-24T07:30:00',
  },
  {
    id: '3',
    orderNumber: 'ORD-2889',
    customer: { id: 'c3', name: 'Doni Pratama', phone: '081122334455' },
    items: [{ serviceType: 'setrika', serviceName: 'Setrika', pricePerUnit: 4000, unit: 'kg', quantity: 10, subtotal: 40000 }],
    totalAmount: 40000,
    status: 'IRONING',
    paymentMethod: 'cash',
    estimatedCompletion: 'Today, 14:30',
    createdAt: '2024-10-24T06:00:00',
  },
  {
    id: '4',
    orderNumber: 'ORD-2888',
    customer: { id: 'c4', name: 'Lestari Putri', phone: '081556677889' },
    items: [{ serviceType: 'bedcover', serviceName: 'Bedcover', pricePerUnit: 15000, unit: 'item', quantity: 1, subtotal: 15000 }],
    totalAmount: 15000,
    status: 'COMPLETED',
    paymentMethod: 'cash',
    estimatedCompletion: 'COMPLETED',
    createdAt: '2024-10-23T14:00:00',
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