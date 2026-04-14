"use client"

import { useState, useEffect } from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import QuickOrderForm from '@/components/dashboard/QuickOrderForm'
import RecentOrders from '@/components/dashboard/RecentOrders'

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