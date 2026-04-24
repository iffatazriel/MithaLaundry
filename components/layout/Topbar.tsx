'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell, LoaderCircle, Menu, Search, X } from 'lucide-react'

interface TopbarProps {
  placeholder?: string
  showSearch?: boolean
  onSearch?: (value: string) => void
  onOpenSidebar?: () => void
  user?: {
    name: string
    role: string
    initials: string
  }
}

type NotificationTone = 'info' | 'warning' | 'success' | 'danger'

interface AppNotification {
  id: string
  tone: NotificationTone
  type: 'new-order' | 'express' | 'ready-pickup' | 'overdue'
  title: string
  message: string
  orderId: string
  createdAt: string
}

interface NotificationsResponse {
  notifications: AppNotification[]
  unreadCount: number
  lastUpdatedAt: string
}

const toneStyles: Record<NotificationTone, string> = {
  info: 'bg-blue-50 text-blue-700 ring-blue-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  danger: 'bg-rose-50 text-rose-700 ring-rose-100',
}

function formatRelativeTime(value: string) {
  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000))

  if (diffMinutes < 60) {
    return `${diffMinutes} menit lalu`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} jam lalu`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} hari lalu`
}

function formatLastUpdated(value: string) {
  return new Date(value).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Topbar({
  placeholder = 'Search orders, customers, or transactions...',
  showSearch = true,
  onSearch,
  onOpenSidebar,
  user = {
    name: 'Admin Mitha',
    role: 'Shift Supervisor',
    initials: 'AM',
  },
}: TopbarProps) {
  const [query, setQuery] = useState('')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true)
  const [notificationError, setNotificationError] = useState<string | null>(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    let isMounted = true

    const loadNotifications = async (showLoader: boolean) => {
      if (showLoader && isMounted) {
        setIsLoadingNotifications(true)
      }

      try {
        const response = await fetch('/api/notifications', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to load notifications')
        }

        const data: NotificationsResponse = await response.json()

        if (!isMounted) {
          return
        }

        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
        setLastUpdatedAt(data.lastUpdatedAt)
        setNotificationError(null)
      } catch (error) {
        if (!isMounted) {
          return
        }

        console.error(error)
        setNotificationError('Notifikasi belum bisa dimuat.')
      } finally {
        if (isMounted) {
          setIsLoadingNotifications(false)
        }
      }
    }

    void loadNotifications(true)
    const intervalId = window.setInterval(() => {
      void loadNotifications(false)
    }, 30000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!isNotificationOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isNotificationOpen])

  const notificationLabel =
    unreadCount <= 0
      ? 'Aktivitas order terbaru'
      : `${unreadCount} order perlu perhatian`

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="mr-3 rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

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
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen((current) => !current)}
              className="relative rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label={notificationLabel}
              aria-expanded={isNotificationOpen}
              aria-haspopup="dialog"
            >
              <Bell size={20} />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-semibold text-white ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </button>

            {isNotificationOpen ? (
              <div className="absolute right-0 top-14 z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
                <div className="border-b border-gray-100 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Notifikasi</p>
                      <p className="text-xs text-gray-500">
                        {lastUpdatedAt
                          ? `Terakhir diperbarui ${formatLastUpdated(lastUpdatedAt)}`
                          : notificationLabel}
                      </p>
                    </div>
                    {isLoadingNotifications ? (
                      <LoaderCircle size={16} className="animate-spin text-gray-400" />
                    ) : null}
                  </div>
                </div>

                <div className="max-h-[26rem] overflow-y-auto px-2 py-2">
                  {notificationError ? (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-4 text-sm text-red-600">
                      {notificationError}
                    </div>
                  ) : null}

                  {!notificationError && !isLoadingNotifications && notifications.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                      <p className="text-sm font-medium text-gray-700">Belum ada notifikasi aktif</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Order baru, express, siap pickup, atau overdue akan muncul di sini.
                      </p>
                    </div>
                  ) : null}

                  {!notificationError
                    ? notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="rounded-2xl border border-transparent px-3 py-3 transition hover:border-gray-100 hover:bg-gray-50"
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${toneStyles[notification.tone]}`}
                            >
                              {notification.orderId.slice(-6).toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold text-gray-900">
                                  {notification.title}
                                </p>
                                <span className="shrink-0 text-[11px] text-gray-400">
                                  {formatRelativeTime(notification.createdAt)}
                                </span>
                              </div>
                              <p className="mt-1 text-sm leading-5 text-gray-600">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    : null}
                </div>

                <div className="border-t border-gray-100 px-4 py-3">
                  <Link
                    href="/orders"
                    onClick={() => setIsNotificationOpen(false)}
                    className="inline-flex items-center text-sm font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    Lihat semua order
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

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
