export type OrderStatus = 'SORTING' | 'WASHING' | 'IRONING' | 'READY' | 'COMPLETED'

export type ServiceType = 'cuci-setrika' | 'setrika' | 'cuci-sepatu' | 'bedcover'

export type PaymentMethod = 'cash' | 'qris'

export type DashboardPeriod = 'today' | 'week' | 'month' | 'year'

export interface Customer {
  id: string
  name: string
  phone: string
}

export interface OrderItem {
  serviceType: ServiceType
  serviceName: string
  pricePerUnit: number
  unit: 'kg' | 'pair' | 'item'
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
    services: {
    name: string
    price: number
    quantity: number
    subtotal: number
  }[]
  totalAmount: number
  status: OrderStatus
  
  paymentMethod: PaymentMethod
  estimatedCompletion: string
  deliveryDate: string
  createdAt: string
  isExpress?: boolean
  itemCount?: number
}

export interface DashboardStats {
  totalRevenue: number
  revenueChangePercent: number
  revenueLabel: string
  comparisonLabel: string
  period: DashboardPeriod
  activeOrders: number
  activeInWashing: number
  pendingPickups: number
  expressDeliveries: number
  pipeline: {
    sorting: number
    washing: number
    ironing: number
    ready: number
  }
}

export interface Service {
  id: ServiceType
  name: string
  description: string
  price: number
  unit: 'kg' | 'pair' | 'item'
}
