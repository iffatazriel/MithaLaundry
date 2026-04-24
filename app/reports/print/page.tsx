'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ReportData, ReportPeriod } from '@/lib/types/report'

const EMPTY_REPORT_DATA: ReportData = {
  period: 'month',
  periodLabel: 'This Month',
  comparisonLabel: 'vs Last Month',
  stats: {
    revenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    totalOrdersGrowth: 0,
    newCustomers: 0,
    newCustomersGrowth: 0,
    avgProcessingTime: '0h',
    avgProcessingTimeGrowth: 0,
  },
  chartData: [],
  serviceData: [],
  highValueOrders: [],
  insight: {
    title: 'Belum ada data',
    description: 'Laporan akan muncul setelah ada transaksi.',
    icon: 'lightbulb',
  },
}

function resolvePeriod(value: string | null): ReportPeriod {
  return value === 'quarter' || value === 'year' ? value : 'month'
}

function formatCurrency(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

function formatChange(value: number, suffix: string) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${Math.abs(value)}% ${suffix}`
}

export default function ReportsPrintPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const period = resolvePeriod(searchParams.get('period'))
  const [reportData, setReportData] = useState<ReportData>(EMPTY_REPORT_DATA)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasPrintedRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const loadReport = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/reports?period=${period}`, {
          method: 'GET',
          cache: 'no-store',
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to fetch reports')
        }

        if (!isMounted) {
          return
        }

        setReportData(data)
      } catch (caughtError) {
        if (!isMounted) {
          return
        }

        console.error(caughtError)
        setError('Laporan tidak bisa dimuat untuk dicetak.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadReport()

    return () => {
      isMounted = false
    }
  }, [period])

  useEffect(() => {
    if (isLoading || error || hasPrintedRef.current) {
      return
    }

    hasPrintedRef.current = true
    const timeoutId = window.setTimeout(() => {
      window.print()
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [error, isLoading])

  const statCards = useMemo(
    () => [
      {
        label: `Revenue ${reportData.periodLabel}`,
        value: formatCurrency(reportData.stats.revenue),
        change: formatChange(
          reportData.stats.revenueGrowth,
          reportData.comparisonLabel
        ),
      },
      {
        label: 'Total Orders',
        value: reportData.stats.totalOrders.toLocaleString('id-ID'),
        change: formatChange(
          reportData.stats.totalOrdersGrowth,
          reportData.comparisonLabel
        ),
      },
      {
        label: 'New Customers',
        value: reportData.stats.newCustomers.toLocaleString('id-ID'),
        change: formatChange(
          reportData.stats.newCustomersGrowth,
          reportData.comparisonLabel
        ),
      },
      {
        label: 'Avg. Processing Time',
        value: reportData.stats.avgProcessingTime,
        change: formatChange(reportData.stats.avgProcessingTimeGrowth, 'faster'),
      },
    ],
    [reportData]
  )

  const generatedAt = useMemo(
    () =>
      new Date().toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    []
  )

  return (
    <main className="min-h-screen bg-slate-100 print:bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 print:max-w-none print:px-0 print:py-0">
        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm print:hidden sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Print Preview</p>
            <p className="mt-1 text-sm text-slate-500">
              Halaman ini akan membuka dialog print tanpa popup tambahan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Print Sekarang
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Kembali
            </button>
            <Link
              href="/reports"
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Buka Reports
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Menyiapkan laporan untuk dicetak...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : (
          <article className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:p-0 print:shadow-none">
            <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
                  Performance Analytics
                </p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">
                  Reports & Insights
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                  Ringkasan performa operasional laundry untuk periode{' '}
                  {reportData.periodLabel}.
                </p>
              </div>

              <div className="text-sm text-slate-500 sm:text-right">
                <p>
                  <span className="font-semibold text-slate-800">Periode:</span>{' '}
                  {reportData.periodLabel}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-slate-800">Dibanding:</span>{' '}
                  {reportData.comparisonLabel}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-slate-800">Diekspor:</span>{' '}
                  {generatedAt}
                </p>
              </div>
            </header>

            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-3xl border border-slate-200 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-emerald-700">
                    {card.change}
                  </p>
                </div>
              ))}
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900">
                Revenue Growth
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Ringkasan tren revenue untuk {reportData.periodLabel.toLowerCase()}.
              </p>

              <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Periode', 'Revenue', 'Highlight'].map((label) => (
                        <th
                          key={label}
                          className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {reportData.chartData.map((item) => (
                      <tr key={`${item.week}-${item.revenue}`}>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          {item.week}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatCurrency(item.revenue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {item.isHighlight ? 'Ya' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8 grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <h2 className="text-xl font-semibold text-slate-900">
                  Service Popularity
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Layanan paling sering dipesan pada periode ini.
                </p>

                <div className="mt-4 space-y-3">
                  {reportData.serviceData.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <span className="font-medium text-slate-800">
                        {service.name}
                      </span>
                      <span className="text-sm font-semibold text-slate-600">
                        {service.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-700">
                  Insight: {reportData.insight.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {reportData.insight.description}
                </p>
              </aside>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900">
                High-Value Orders
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Daftar order bernilai tinggi yang muncul pada laporan ini.
              </p>

              <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Customer', 'Service Type', 'Amount', 'Status', 'Date'].map(
                        (label) => (
                          <th
                            key={label}
                            className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400"
                          >
                            {label}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {reportData.highValueOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {order.serviceType}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {order.status}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </article>
        )}
      </div>
    </main>
  )
}
