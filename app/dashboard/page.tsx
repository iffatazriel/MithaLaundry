"use client"

import { useState, useEffect } from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import QuickOrderForm from '@/components/dashboard/QuickOrderForm'
import RecentOrders from '@/components/dashboard/RecentOrders'
import { DASHBOARD_STATS, RECENT_ORDERS } from '@/lib/data'

export default function DashboardPage() {

//   const [stats, setStats] = useState({
//   orders: 0,
//   revenue: 0,
//   pipeline: {
//     pending: 0,
//     process: 0,
//     done: 0
//   }
// })

  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    const res = await fetch('/api/orders')
    const data = await res.json()

    setOrders(data)

    // generate stats
    const today = new Date().toDateString()

    const todayOrders = data.filter(
      (o: any) =>
        new Date(o.createdAt).toDateString() === today
    )

    const revenue = todayOrders.reduce(
      (sum: number, o: any) => sum + o.total,
      0
    )

    setStats({
      orders: todayOrders.length,
      revenue,
      pipeline: {
        pending: data.filter((o: any) => o.status === 'pending').length,
        process: data.filter((o: any) => o.status === 'process').length,
        done: data.filter((o: any) => o.status === 'done').length,
      },
    })
  }

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
      {stats && <StatsCards stats={stats} />}

      {/* Bottom Grid */}
      <div className="grid grid-cols-[320px_1fr] gap-4">
        <QuickOrderForm />
          {stats && (
            <RecentOrders 
              orders={orders.slice(0,5)} 
              pipeline={stats.pipeline}
            />
          )}
      </div>
    </div>
  )
}