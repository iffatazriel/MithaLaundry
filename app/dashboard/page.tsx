"use client"

import { useState, useEffect } from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import RecentOrders from '@/components/dashboard/RecentOrders'
import StatsCardsSkeleton from '@/components/dashboard/StatsCardsSkeleton'
import RecentOrdersSkeleton from '@/components/dashboard/RecentOrdersSkeleton'

export default function DashboardPage() {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState<any>(null)

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()

      setOrders(data.orders)
      setStats(data.stats)
    } catch (error) {
      console.error("Dashboard fetch error:", error)
    }
  }

  useEffect(() => {
    fetchDashboard()

    const interval = setInterval(fetchDashboard, 5000)
    return () => clearInterval(interval)
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="h-full flex flex-col p-7 overflow-hidden">
      <div className="flex items-baseline gap-3 mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Daily Overview</h1>
        <span className="text-sm text-gray-400">{today}</span>
      </div>

      <div className="shrink-0">
        {stats ? (
          <StatsCards stats={stats} />
        ) : (
          <StatsCardsSkeleton />
        )}
      </div>

      <div className="flex-1 mt-4 min-h-0 overflow-y-auto">
        {stats ? (
          <RecentOrders
            orders={orders.slice(0, 5)}
            pipeline={stats.pipeline}
          />
        ) : (
          <RecentOrdersSkeleton />
        )}
      </div>
    </div>
  )
}