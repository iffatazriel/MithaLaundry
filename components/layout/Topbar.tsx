'use client'

import { useEffect, useState } from 'react'
import { Bell, Search, X } from 'lucide-react'

interface TopbarProps {
  placeholder?: string
  showSearch?: boolean
  onSearch?: (value: string) => void
  user?: {
    name: string
    role: string
    initials: string
  }
}

export default function Topbar({
  placeholder = 'Search orders, customers, or transactions...',
  showSearch = true,
  onSearch,
  user = {
    name: 'Admin Mitha',
    role: 'Shift Supervisor',
    initials: 'AM',
  },
}: TopbarProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch?.(query.trim())
    }, 300)

    return () => clearTimeout(timeout)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          {showSearch ? (
            <div className="relative w-full max-w-xl">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={query}
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-11 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-gray-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <div />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <button
            type="button"
            className="relative rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-sm">
              {user.initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}