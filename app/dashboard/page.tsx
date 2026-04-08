import StatsCards from '@/components/dashboard/StatsCards'
import QuickOrderForm from '@/components/dashboard/QuickOrderForm'
import RecentOrders from '@/components/dashboard/RecentOrders'
import { DASHBOARD_STATS, RECENT_ORDERS } from '@/lib/data'

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="p-7">
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Daily Overview</h1>
        <span className="text-sm text-gray-400">{today}</span>
      </div>

      {/* Stats */}
      <StatsCards stats={DASHBOARD_STATS} />

      {/* Bottom Grid */}
      <div className="grid grid-cols-[320px_1fr] gap-4">
        <QuickOrderForm />
        <RecentOrders orders={RECENT_ORDERS} pipeline={DASHBOARD_STATS.pipeline} />
      </div>
    </div>
  )
}