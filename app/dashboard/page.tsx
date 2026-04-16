'use client'

import { useEffect, useState } from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import RecentOrders from '@/components/dashboard/RecentOrders'
import StatsCardsSkeleton from '@/components/dashboard/StatsCardsSkeleton'
import RecentOrdersSkeleton from '@/components/dashboard/RecentOrdersSkeleton'
import type { DashboardStats, Order } from '@/types'

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard')
        const data = await res.json()

        if (!isMounted) {
          return
        }

        setOrders(data.orders)
        setStats(data.stats)
      } catch (error) {
        console.error('Dashboard fetch error:', error)
      }
    }

    void fetchDashboard()

    const interval = setInterval(fetchDashboard, 5000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="flex h-full flex-col overflow-hidden bg-gray-50 p-7">
      <div className="mb-6 flex flex-col gap-2 shrink-0 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-600">Operations / Dashboard</p>
          <h1 className="text-3xl font-bold text-gray-900">Daily Overview</h1>
        </div>
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
            orders={orders}
            pipeline={stats.pipeline}
          />
        ) : (
          <RecentOrdersSkeleton />
        )}
      </div>
    </main>
  )
}
