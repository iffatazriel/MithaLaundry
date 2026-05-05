export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="mx-auto h-14 w-14 animate-pulse rounded-2xl bg-gray-200" />
        <div className="mx-auto mt-6 h-7 w-44 animate-pulse rounded-xl bg-gray-200" />
        <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded-xl bg-gray-200" />
        <div className="mt-8 space-y-4">
          <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-gray-300" />
        </div>
      </section>
    </main>
  )
}
