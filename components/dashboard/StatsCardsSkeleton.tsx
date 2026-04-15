export default function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_160px_160px] gap-4 mb-6 animate-pulse">
      
      {/* Revenue */}
      <div className="bg-gray-200 rounded-xl h-[110px]" />

      {/* Active Orders */}
      <div className="bg-gray-200 rounded-xl h-[110px]" />

      {/* Pending Pickup */}
      <div className="bg-gray-200 rounded-xl h-[110px]" />

    </div>
  )
}