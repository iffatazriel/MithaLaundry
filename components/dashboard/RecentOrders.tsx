'use client'

import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import type { Order, DashboardStats } from '@/types'
import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Droplet, Shirt, Sparkles } from 'lucide-react'

interface RecentOrdersProps {
  orders: Order[]
  pipeline: DashboardStats['pipeline']
}

const PIPELINE_STAGES = [
  { key: 'sorting', label: 'Sorting', color: 'bg-gray-700', icon: Shirt },
  { key: 'washing', label: 'Washing', color: 'bg-blue-600', icon: Droplet },
  { key: 'ironing', label: 'Ironing', color: 'bg-amber-500', icon: Sparkles },
  { key: 'ready', label: 'Ready', color: 'bg-green-500', icon: CheckCircle },
]as const

const STATUS_OPTIONS = [
  { value: 'sorting', label: 'Sorting' },
  { value: 'washing', label: 'Washing' },
  { value: 'ironing', label: 'Ironing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
]

function normalizeStatus(status?: string) {
  return (status ?? 'completed').toUpperCase() as Order['status']
}

function formatStatusLabel(status?: string) {
  const normalized = status?.toLowerCase() ?? 'completed'
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

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

      setLocalOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: status as Order['status'] } : order
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
  const totalPipeline = PIPELINE_STAGES.reduce(
    (sum, stage) => sum + (pipeline?.[stage.key] ?? 0),
    0
  )

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <p className="mt-1 text-sm text-gray-500">
            Pantau antrian proses dan update status order terbaru dari dashboard.
          </p>
        </div>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          View All Orders
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mb-6 rounded-2xl bg-gray-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
              Process Pipeline
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {totalPipeline} order sedang berjalan di proses produksi.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {PIPELINE_STAGES.map(({ key, label, color, icon: Icon }) => {
            const value = pipeline?.[key] ?? 0
            const width = totalPipeline > 0 ? (value / totalPipeline) * 100 : 0

            return (
              <div
                key={key}
                className="rounded-2xl border border-white bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className={`rounded-xl p-2 ${color} bg-opacity-10`}>
                    <Icon className={`h-4 w-4 ${color.replace('bg', 'text')}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    {Math.round(width)}%
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
                <div className="mt-3 h-2 rounded-full bg-gray-100">
                  <div className={`h-2 rounded-full ${color}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Customer', 'Service', 'Status', 'Completion', 'Update Status'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="text-base font-semibold text-gray-700">Belum ada order terbaru</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Order yang masuk akan langsung muncul di dashboard ini.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const services =
                    typeof order.services === 'string'
                      ? JSON.parse(order.services)
                      : order.services

                  const firstService = services?.[0]
                  const serviceCount = Array.isArray(services) ? services.length : 0
                  const normalizedStatus = normalizeStatus(order.status)
                  const rawStatus = order.status?.toLowerCase() ?? 'completed'

                  return (
                    <tr key={order.id} className="transition hover:bg-gray-50">
                      <td className="px-4 py-4 pr-3">
                        <p className="text-sm font-semibold text-gray-900">{order.customer?.name ?? 'Walk-in Customer'}</p>
                        <p className="mt-1 text-xs text-gray-400">#{order.id.slice(0, 6)}</p>
                      </td>

                      <td className="px-4 py-4 pr-3">
                        <p className="text-sm font-medium text-gray-800">
                          {firstService?.name ?? 'No Service'}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {firstService?.quantity ?? 0} item
                          {serviceCount > 1 ? ` + ${serviceCount - 1} layanan lain` : ''}
                        </p>
                      </td>

                      <td className="px-4 py-4 pr-3">
                        <StatusBadge status={normalizedStatus} />
                      </td>

                      <td className="px-4 py-4 pr-3">
                        {rawStatus === 'completed' ? (
                          <span className="text-sm font-semibold text-emerald-600">Completed</span>
                        ) : order.deliveryDate ? (
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {new Date(order.deliveryDate).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              Target {formatStatusLabel(rawStatus)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Belum ditentukan</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={rawStatus}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          {localOrders.length === 0
            ? 'Tidak ada order untuk ditampilkan'
            : `Showing ${startIndex + 1} - ${Math.min(endIndex, localOrders.length)} of ${localOrders.length} orders`}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
