import { TrendingUp, ClipboardList, Truck } from 'lucide-react'
import type { DashboardStats } from '@/types'
import { formatRupiah } from '@/lib/data'

interface StatsCardsProps {
  stats: DashboardStats
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-[1fr_160px_160px] gap-4 mb-6">
      {/* Revenue */}
      <div className="bg-blue-800 rounded-xl px-6 py-5 text-white relative overflow-hidden">
        <div className="absolute right-4 bottom-4 opacity-10">
          <div className="w-24 h-24 rounded-full border-[16px] border-white" />
        </div>
        <p className="text-xs text-blue-200 mb-2">Total Revenue Today</p>
        <p className="text-3xl font-bold tracking-tight mb-2">
          {formatRupiah(stats.totalRevenueToday)}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-blue-200">
          <TrendingUp size={12} />
          <span>+{stats.revenueChangePercent}% from yesterday</span>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
          <ClipboardList size={17} className="text-blue-700" />
        </div>
        <p className="text-xs text-gray-500 mb-1">Active Orders</p>
        <p className="text-2xl font-bold text-gray-900 mb-1">{stats.activeOrders}</p>
        <p className="text-xs text-blue-700 font-medium">{stats.activeInWashing} In Washing</p>
      </div>

      {/* Pending Pickups */}
      <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
        <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
          <Truck size={17} className="text-orange-500" />
        </div>
        <p className="text-xs text-gray-500 mb-1">Pending Pickups</p>
        <p className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingPickups}</p>
        <p className="text-xs text-orange-500 font-medium">{stats.expressDeliveries} Express Delivery</p>
      </div>
    </div>
  )
}