'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Clock3,
  Filter,
  PackageCheck,
  Plus,
  Search,
  X,
} from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import type { Order } from '@/types'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'sorting', label: 'Sorting' },
  { value: 'washing', label: 'Washing' },
  { value: 'ironing', label: 'Ironing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
] as const

const QUICK_ACTION_LABELS: Record<string, string> = {
  washing: 'Mulai Washing',
  ironing: 'Lanjut Ironing',
  ready: 'Tandai Ready',
  completed: 'Selesaikan',
}

type ServiceItem = {
  name?: string
  quantity?: number
  subtotal?: number
  price?: number
}

type LocalOrder = Order & {
  payment?: string
  itemCount?: number | null
  subtotal?: number
  expressFee?: number
  total?: number
}

function normalizeStatus(status?: string) {
  return (status ?? 'completed').toUpperCase() as Order['status']
}

function parseServices(services: unknown) {
  if (Array.isArray(services)) {
    return services
  }

  if (typeof services === 'string') {
    try {
      const parsed = JSON.parse(services)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return []
}

function formatCurrency(value?: number) {
  return `Rp ${Number(value ?? 0).toLocaleString('id-ID')}`
}

function formatOrderDate(value?: string) {
  if (!value) {
    return 'Belum ditentukan'
  }

  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getNextStatus(status?: string) {
  const normalizedStatus = status?.toLowerCase() ?? 'completed'

  switch (normalizedStatus) {
    case 'sorting':
      return 'washing'
    case 'washing':
      return 'ironing'
    case 'ironing':
      return 'ready'
    case 'ready':
      return 'completed'
    default:
      return null
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<LocalOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<LocalOrder | null>(null)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data: LocalOrder[] = await response.json()

        if (!isMounted) {
          return
        }

        setOrders(data)
        setSelectedOrder((current) =>
          current ? data.find((order) => order.id === current.id) ?? current : null
        )
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadOrders()
    const intervalId = window.setInterval(() => {
      void loadOrders()
    }, 15000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!statusMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage(null)
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [statusMessage])

  useEffect(() => {
    if (!selectedOrder) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedOrder(null)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedOrder])

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingOrderId(orderId)

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const updatedOrder = (await response.json()) as LocalOrder

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      )
      setSelectedOrder((current) =>
        current && current.id === orderId
          ? { ...current, status: updatedOrder.status }
          : current
      )
      setStatusMessage(`Status order #${orderId.slice(-6).toUpperCase()} diperbarui.`)
    } catch (error) {
      console.error(error)
      setStatusMessage('Status order gagal diperbarui.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const filteredOrders = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()

    return orders.filter((order) => {
      const services = parseServices(order.services)
      const matchesStatus =
        statusFilter === 'all' ||
        (order.status?.toLowerCase() ?? 'completed') === statusFilter

      const matchesSearch =
        normalizedQuery.length === 0 ||
        order.id.toLowerCase().includes(normalizedQuery) ||
        (order.customer?.name ?? '').toLowerCase().includes(normalizedQuery) ||
        services.some((service) =>
          String(service?.name ?? '')
            .toLowerCase()
            .includes(normalizedQuery)
        )

      return matchesStatus && matchesSearch
    })
  }, [orders, search, statusFilter])

  const summary = useMemo(() => {
    const active = orders.filter((order) =>
      ['sorting', 'washing', 'ironing'].includes(order.status?.toLowerCase() ?? '')
    ).length
    const ready = orders.filter((order) => order.status?.toLowerCase() === 'ready').length
    const express = orders.filter((order) => order.isExpress).length

    return {
      total: orders.length,
      active,
      ready,
      express,
    }
  }, [orders])

  const drawerServices = selectedOrder
    ? (parseServices(selectedOrder.services) as ServiceItem[])
    : []
  const selectedNextStatus = getNextStatus(selectedOrder?.status)

  return (
    <main className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-600">Operations / Orders</p>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">All Orders</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Satu halaman khusus untuk memantau seluruh order, mencari customer, dan melihat
              progres operasional dengan lebih nyaman.
            </p>
          </div>

          <Link
            href="/order"
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Plus size={16} />
            Buat Order Baru
          </Link>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Order</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Sedang Diproses</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.active}</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Siap Diambil</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.ready}</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Express</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{summary.express}</p>
          </div>
        </div>

        <section className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Order Monitor</h2>
              <p className="mt-1 text-sm text-gray-500">
                Cari order berdasarkan nama customer, ID order, atau layanan.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
              <div className="relative w-full lg:w-80">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari customer atau ID order..."
                  className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="relative w-full lg:w-56">
                <Filter
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
              <PackageCheck size={14} />
              {filteredOrders.length} order tampil
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
              <Clock3 size={14} />
              Refresh otomatis setiap 15 detik
            </span>
            {statusMessage ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
                {statusMessage}
              </span>
            ) : null}
          </div>

          <div className="space-y-3 md:hidden">
            {isLoading ? (
              <div className="rounded-2xl border border-gray-100 px-4 py-10 text-center text-sm text-gray-500">
                Memuat daftar order...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center">
                <p className="text-base font-semibold text-gray-700">Belum ada order yang cocok</p>
                <p className="mt-2 text-sm text-gray-500">
                  Coba ubah kata kunci pencarian atau filter status.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const services = parseServices(order.services)
                const firstService = services[0]
                const nextStatus = getNextStatus(order.status)
                const isUpdating = updatingOrderId === order.id

                return (
                  <div key={order.id} className="rounded-2xl border border-gray-100 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {order.customer?.name ?? 'Walk-in Customer'}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">#{order.id.slice(-6).toUpperCase()}</p>
                      </div>
                      <StatusBadge status={normalizeStatus(order.status)} />
                    </div>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                          Layanan
                        </p>
                        <p className="mt-1 font-medium text-gray-800">
                          {firstService?.name ?? 'Belum ada layanan'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Total
                          </p>
                          <p className="mt-1 font-medium text-gray-800">
                            Rp {Number(order.total ?? 0).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                            Estimasi
                          </p>
                          <p className="mt-1 font-medium text-gray-800">
                            {formatOrderDate(order.deliveryDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2">
                        <span>{order.isExpress ? 'Express' : 'Regular'}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 font-medium text-blue-600"
                        >
                          Detail
                          <ArrowRight size={14} />
                        </button>
                      </div>

                      {nextStatus ? (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                          disabled={isUpdating}
                          className="w-full rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating ? 'Memperbarui...' : QUICK_ACTION_LABELS[nextStatus]}
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order', 'Customer', 'Service', 'Status', 'Total', 'Delivery'].map((head) => (
                      <th
                        key={head}
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                        Memuat daftar order...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <p className="text-base font-semibold text-gray-700">Belum ada order yang cocok</p>
                        <p className="mt-2 text-sm text-gray-500">
                          Coba ubah kata kunci pencarian atau filter status.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const services = parseServices(order.services)
                      const firstService = services[0]
                      const serviceCount = services.length
                      const nextStatus = getNextStatus(order.status)
                      const isUpdating = updatingOrderId === order.id

                      return (
                        <tr
                          key={order.id}
                          className="cursor-pointer transition hover:bg-gray-50"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-4 py-4">
                            <p className="text-sm font-semibold text-gray-900">
                              #{order.id.slice(-6).toUpperCase()}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleString('id-ID')}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-800">
                              {order.customer?.name ?? 'Walk-in Customer'}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-800">
                              {firstService?.name ?? 'Belum ada layanan'}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {serviceCount > 1 ? `+ ${serviceCount - 1} layanan lain` : '1 layanan'}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <StatusBadge status={normalizeStatus(order.status)} />
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">
                            Rp {Number(order.total ?? 0).toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm text-gray-600">
                                {formatOrderDate(order.deliveryDate)}
                              </span>
                              {nextStatus ? (
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    void updateOrderStatus(order.id, nextStatus)
                                  }}
                                  disabled={isUpdating}
                                  className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {isUpdating ? '...' : QUICK_ACTION_LABELS[nextStatus]}
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {selectedOrder ? (
        <div
          className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[1px]"
          onClick={() => setSelectedOrder(null)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5">
              <div>
                <p className="text-sm font-medium text-blue-600">Order Detail</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  #{selectedOrder.id.slice(-6).toUpperCase()}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Dibuat {new Date(selectedOrder.createdAt).toLocaleString('id-ID')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-2xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Tutup detail order"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="mb-5 flex items-center justify-between gap-3 rounded-3xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status Saat Ini</p>
                  <div className="mt-2">
                    <StatusBadge status={normalizeStatus(selectedOrder.status)} />
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{selectedOrder.isExpress ? 'Express service' : 'Regular service'}</p>
                  <p className="mt-1">{formatOrderDate(selectedOrder.deliveryDate)}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Customer
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {selectedOrder.customer?.name ?? 'Walk-in Customer'}
                  </p>
                </div>
                <div className="rounded-3xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Payment
                  </p>
                  <p className="mt-2 text-base font-semibold uppercase text-gray-900">
                    {selectedOrder.payment ?? '-'}
                  </p>
                </div>
                <div className="rounded-3xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Item Count
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {selectedOrder.itemCount ?? 0} item
                  </p>
                </div>
                <div className="rounded-3xl border border-gray-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Total Tagihan
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900">
                    {formatCurrency(selectedOrder.total)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-gray-100 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Layanan</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Rincian layanan yang masuk dalam order ini.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {drawerServices.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      Belum ada rincian layanan.
                    </div>
                  ) : (
                    drawerServices.map((service, index) => (
                      <div
                        key={`${selectedOrder.id}-${service.name ?? 'service'}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {service.name ?? 'Layanan'}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {service.quantity ?? 0} item
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(service.subtotal)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 py-4">
              <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(selectedOrder.subtotal)}
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-500">Express Fee</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(selectedOrder.expressFee)}
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {selectedNextStatus ? (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(selectedOrder.id, selectedNextStatus)}
                    disabled={updatingOrderId === selectedOrder.id}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingOrderId === selectedOrder.id
                      ? 'Memperbarui status...'
                      : QUICK_ACTION_LABELS[selectedNextStatus]}
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Tutup
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  )
}
