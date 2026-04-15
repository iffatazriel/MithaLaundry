export default function RecentOrdersSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
      
      <div className="h-5 bg-gray-200 rounded w-40 mb-4" />

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center py-3 border-b"
        >
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>

          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
      ))}

    </div>
  )
}