'use client'

import { use } from 'react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

interface ClientShellProps {
  children: React.ReactNode
  user: Promise<
    | {
        id: string
        name: string
        email: string
        role: string
        initials: string
      }
    | null
  >
}

export default function ClientShell({ children, user }: ClientShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const pathname = usePathname()
  const currentUser = use(user)

  if (pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        user={currentUser}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-0">
        <Topbar
          user={
            currentUser
              ? {
                  name: currentUser.name,
                  role: currentUser.role,
                  initials: currentUser.initials,
                }
              : undefined
          }
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
