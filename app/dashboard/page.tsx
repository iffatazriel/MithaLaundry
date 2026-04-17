'use client'

import { useEffect, useState } from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import RecentOrders from '@/components/dashboard/RecentOrders'
import StatsCardsSkeleton from '@/components/dashboard/StatsCardsSkeleton'
import RecentOrdersSkeleton from '@/components/dashboard/RecentOrdersSkeleton'
import type { DashboardPeriod, DashboardStats, Order } from '@/types'

const PERIOD_OPTIONS: Array<{ id: DashboardPeriod; label: string }> = [
  { id: 'today', label: 'Hari Ini' },
  { id: 'week', label: 'Minggu Ini' },
  { id: 'month', label: 'Bulan Ini' },
  { id: 'year', label: 'Tahun Ini' },
]

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [period, setPeriod] = useState<DashboardPeriod>('today')

  useEffect(() => {
    let isMounted = true

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`/api/dashboard?period=${period}`)
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
  }, [period])

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="flex h-full flex-col overflow-hidden bg-gray-50 p-4 sm:p-6 lg:p-7">
      <div className="mb-6 flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-600">Operations / Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Business Overview</h1>
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <span className="text-sm text-gray-400">{today}</span>
          <div className="w-full overflow-x-auto pb-1 lg:w-auto">
            <div className="inline-flex min-w-max rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
            {PERIOD_OPTIONS.map((option) => {
              const isActive = period === option.id

              return (
                <button
                  key={option.id}
                  onClick={() => setPeriod(option.id)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition sm:px-4 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
            </div>
          </div>
        </div>
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
