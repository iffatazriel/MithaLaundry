export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 h-4 w-40 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-8 w-64 animate-pulse rounded-xl bg-gray-200" />
          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-xl bg-gray-200" />
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 h-11 w-11 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded-xl bg-gray-200" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded-xl bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="h-5 w-44 animate-pulse rounded-xl bg-gray-200" />
        <div className="mt-5 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 w-full animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    </main>
  )
}
