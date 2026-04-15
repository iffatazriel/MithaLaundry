'use client'

import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import type { Order, DashboardStats } from '@/types'
import { useState, useEffect } from 'react'
import { Shirt, Droplet, Sparkles, CheckCircle } from 'lucide-react'

interface RecentOrdersProps {
  orders: Order[]
  pipeline: DashboardStats['pipeline']
}

const PIPELINE_STAGES = [
  { key: 'sorting', label: 'Sorting', color: 'bg-gray-700', icon: Shirt },
  { key: 'washing', label: 'Washing', color: 'bg-blue-600', icon: Droplet },
  { key: 'ironing', label: 'Ironing', color: 'bg-purple-500', icon: Sparkles },
  { key: 'ready', label: 'Ready', color: 'bg-green-500', icon: CheckCircle },
]as const

export default function RecentOrders({ orders, pipeline }: RecentOrdersProps) {
  const [localOrders, setLocalOrders] = useState(orders)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    setLocalOrders(orders)
    setCurrentPage(1)
  }, [orders])

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      await res.json()

        // update UI tanpa reload
        setLocalOrders((prev: any) =>
          prev.map((order: any) =>
            order.id === id ? { ...order, status } : order
          )
        )
    } catch (error) {
      console.error(error)
    }
  }

  const totalPages = Math.ceil(localOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedOrders = localOrders.slice(startIndex, endIndex)

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-gray-900">Recent Orders</h2>
        <Link href="/orders" className="text-sm text-blue-700 hover:underline">
          View All Orders
        </Link>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            {['Customer', 'Service', 'Status', 'Est. Completion', 'Action'].map((h) => (
              <th
                key={h}
                className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide pb-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedOrders.map((order) => {
            const services =
              typeof order.services === 'string'
                ? JSON.parse(order.services)
                : order.services

            const firstService = services?.[0]

            return (
              <tr key={order.id} className="border-t border-gray-50">
                <td className="py-3 pr-4">
                  <p className="text-sm font-medium text-gray-900">{order.customer?.name}</p>
                  <p className="text-[11px] text-gray-400">#{order.id.slice(0, 6)}</p>
                </td>

                <td className="py-3 pr-4">
                  <p className="text-sm text-gray-700">{firstService?.name ?? 'No Service'}</p>
                  <p className="text-[11px] text-gray-400">{firstService?.quantity ?? 0} pcs</p>
                </td>

                <td className="py-3 pr-4">
                  <StatusBadge status={order.status ?? 'COMPLETED'} />
                </td>

                <td className="py-3 pr-4">
                  {order.status === 'COMPLETED' ? (
                    <span className="text-sm font-semibold text-green-600">COMPLETED</span>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {new Date(order.deliveryDate).toLocaleDateString('id-ID')}
                    </span>
                  )}
                </td>

                <td className="py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium bg-white 
                              border border-gray-200 rounded-2xl focus:outline-none 
                              focus:ring-2 focus:ring-indigo-500 transition-all duration-200 
                              hover:border-gray-300 cursor-pointer"
                  >
                    <option value="sorting" className="text-orange-600">Sorting</option>
                    <option value="washing" className="text-blue-600">Washing</option>
                    <option value="ironing" className="text-purple-600">Ironing</option>
                    <option value="ready" className="text-emerald-600">Ready</option>
                    <option value="completed" className="text-green-600">Completed</option>
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Showing {startIndex + 1} - {Math.min(endIndex, localOrders.length)} of {localOrders.length} orders
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-6">
  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
    Process Pipeline
  </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PIPELINE_STAGES.map(({ key, label, color, icon }) => {
            const Icon = icon

            return (
              <div
                key={key}
                className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Icon */}
                <div className={`p-2 rounded-xl mb-2 ${color} bg-opacity-10`}>
                  <Icon className={`w-4 h-4 ${color.replace('bg', 'text')}`} />
                </div>

                {/* Label */}
                <p className="text-xs font-medium text-gray-500">
                  {label}
                </p>

                {/* Value */}
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {pipeline?.[key] ?? 0}
                </p>

                {/* Progress line */}
                <div className="w-full h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full ${color}`}
                    style={{
                      width: `${Math.min((pipeline?.[key] ?? 0) * 10, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}