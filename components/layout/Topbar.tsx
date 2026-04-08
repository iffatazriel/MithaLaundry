import { Bell, Search } from 'lucide-react'

interface TopbarProps {
  placeholder?: string
}

export default function Topbar({ placeholder = 'Search orders, customers, or transactions...' }: TopbarProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-7 h-14 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 w-80">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          className="bg-transparent text-sm text-gray-500 placeholder:text-gray-400 outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-600">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 leading-tight">Admin Mitha</p>
            <p className="text-[11px] text-gray-400">Shift Supervisor</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
            AM
          </div>
        </div>
      </div>
    </header>
  )
}