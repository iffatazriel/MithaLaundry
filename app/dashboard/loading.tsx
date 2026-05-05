import StatsCardsSkeleton from '@/components/dashboard/StatsCardsSkeleton'
import RecentOrdersSkeleton from '@/components/dashboard/RecentOrdersSkeleton'

export default function Loading() {
  return (
    <main className="flex min-h-full min-w-0 flex-col bg-gray-50 p-4 sm:p-6 lg:p-7">
      <div className="mb-6 flex shrink-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 h-4 w-40 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-8 w-64 animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div className="h-11 w-80 animate-pulse rounded-2xl bg-gray-200" />
      </div>
      <div className="shrink-0">
        <StatsCardsSkeleton />
      </div>
      <div className="mt-4 min-h-0 flex-1">
        <RecentOrdersSkeleton />
      </div>
    </main>
  )
}
