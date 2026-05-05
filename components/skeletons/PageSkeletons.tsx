import type { CSSProperties } from 'react'

function SkeletonBlock({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} style={style} />
}

function HeaderSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <SkeletonBlock className="mb-3 h-4 w-40" />
        <SkeletonBlock className="h-8 w-64" />
        <SkeletonBlock className="mt-3 h-4 w-full max-w-xl" />
      </div>
      <SkeletonBlock className="h-11 w-40" />
    </div>
  )
}

function StatGridSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <SkeletonBlock className="h-11 w-11" />
            <SkeletonBlock className="h-3 w-14" />
          </div>
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="mt-3 h-8 w-16" />
          <SkeletonBlock className="mt-3 h-4 w-36" />
        </div>
      ))}
    </div>
  )
}

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="border-b border-gray-100 px-6 py-5">
        <SkeletonBlock className="h-5 w-44" />
        <SkeletonBlock className="mt-2 h-4 w-80" />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-5 gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-3 w-24" />
            ))}
          </div>
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 border-b border-gray-100 px-6 py-4">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-6 w-24 rounded-full" />
              <div className="flex gap-2">
                <SkeletonBlock className="h-8 w-14" />
                <SkeletonBlock className="h-8 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CustomersPageSkeleton() {
  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <HeaderSkeleton />
      <StatGridSkeleton />
      <div className="mb-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <SkeletonBlock className="h-11 flex-1" />
          <SkeletonBlock className="h-11 w-full lg:w-48" />
          <SkeletonBlock className="h-11 w-full lg:w-48" />
        </div>
      </div>
      <TableSkeleton rows={8} />
    </main>
  )
}

export function OrdersPageSkeleton() {
  return (
    <main className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-7xl">
        <HeaderSkeleton />
        <StatGridSkeleton />
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="mt-2 h-4 w-80" />
            </div>
            <div className="flex flex-col gap-3 lg:flex-row">
              <SkeletonBlock className="h-11 w-full lg:w-80" />
              <SkeletonBlock className="h-11 w-full lg:w-56" />
            </div>
          </div>
          <TableSkeleton rows={7} />
        </div>
      </div>
    </main>
  )
}

export function ReportsPageSkeleton() {
  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <HeaderSkeleton />
      <StatGridSkeleton />
      <div className="mb-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 xl:col-span-2">
          <SkeletonBlock className="h-5 w-44" />
          <SkeletonBlock className="mt-2 h-4 w-64" />
          <div className="mt-8 flex h-72 items-end gap-3">
            {[42, 64, 38, 78, 55, 92, 70].map((height, index) => (
              <SkeletonBlock key={index} className="flex-1 rounded-t-xl" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <SkeletonBlock className="h-5 w-40" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="mb-2 flex justify-between">
                  <SkeletonBlock className="h-4 w-28" />
                  <SkeletonBlock className="h-4 w-10" />
                </div>
                <SkeletonBlock className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <TableSkeleton rows={5} />
    </main>
  )
}

export function InventoryPageSkeleton() {
  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <HeaderSkeleton />
      <StatGridSkeleton />
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <SkeletonBlock className="h-6 w-44" />
              <SkeletonBlock className="mt-2 h-4 w-72" />
            </div>
            <SkeletonBlock className="h-11 w-full lg:w-96" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-gray-100 p-5">
                <div className="flex justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <SkeletonBlock className="h-5 w-56" />
                    <SkeletonBlock className="mt-2 h-4 w-72" />
                  </div>
                  <SkeletonBlock className="h-9 w-24" />
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((__, itemIndex) => (
                    <div key={itemIndex}>
                      <SkeletonBlock className="h-3 w-24" />
                      <SkeletonBlock className="mt-2 h-6 w-20" />
                    </div>
                  ))}
                </div>
                <SkeletonBlock className="mt-5 h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="mt-2 h-4 w-56" />
              <div className="mt-5 space-y-3">
                {Array.from({ length: 3 }).map((__, itemIndex) => (
                  <SkeletonBlock key={itemIndex} className="h-20 w-full" />
                ))}
              </div>
            </div>
          ))}
        </aside>
      </section>
    </main>
  )
}

export function SettingsPageSkeleton() {
  return (
    <main className="space-y-4 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 xl:w-80">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="mt-2 h-3 w-44" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-11 w-full" />
            ))}
          </div>
        </aside>
        <div className="min-w-0 flex-1 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <section key={index} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <SkeletonBlock className="h-6 w-48" />
              <SkeletonBlock className="mt-2 h-4 w-80" />
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((__, itemIndex) => (
                  <SkeletonBlock key={itemIndex} className="h-24 w-full" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

export function NewOrderPageSkeleton() {
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
      <SkeletonBlock className="mb-6 h-8 w-40" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <section key={index} className="rounded-xl border border-gray-100 bg-white p-5">
              <SkeletonBlock className="h-5 w-44" />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {Array.from({ length: index === 0 ? 2 : 4 }).map((__, itemIndex) => (
                  <SkeletonBlock key={itemIndex} className="h-24 w-full" />
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="space-y-4">
          <SkeletonBlock className="h-36 w-full" />
          <SkeletonBlock className="h-72 w-full" />
          <SkeletonBlock className="h-28 w-full" />
        </aside>
      </div>
    </main>
  )
}
