'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart2,
  Package,
  Settings,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/order', label: 'Orders', icon: ClipboardList },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/inventory', label: 'Inventory', icon: Package },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
            <div className="w-10 h-10 flex items-center justify-center">
            <Image 
                src="icons/Background.svg" 
                alt="Background Icon" 
                width={30} 
                height={30} 
            />
            </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">Mitha Laundry</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Premium Service</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-800 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-blue-700' : 'text-gray-400'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-gray-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 mb-0.5"
        >
          <Settings size={17} className="text-gray-400" />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
          <LogOut size={17} className="text-gray-400" />
          Logout
        </button>
      </div>
    </aside>
  )
}