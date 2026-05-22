'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LogoutButton from '@/components/layout/LogoutButton';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart2,
  Package,
  Settings,
  X,
  ChevronLeft,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/order', label: 'Orders', icon: ClipboardList },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/inventory', label: 'Inventory', icon: Package },
  // { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    initials: string;
  } | null;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ user, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return localStorage.getItem('sidebarCollapsed') === 'true';
  }); // Desktop collapse

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[18rem] max-w-[calc(100vw-1rem)] flex-col overflow-hidden border-r border-gray-100 bg-white shadow-2xl transition-transform duration-300 lg:fixed lg:max-w-none lg:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-5">
          {/* Logo - Hilang saat collapsed */}
          <div className={`flex min-w-0 items-center gap-3 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Image
                src="/icons/screen.png"
                alt="Mitha Laundry"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-none text-gray-900">Mitha Laundry</p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-widest text-gray-400">
                Premium Service
              </p>
            </div>
          </div>

          {isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-100 lg:flex">
                <Image
                  src="/icons/screen.png"
                  alt="Mitha Laundry"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} className={isCollapsed ? 'rotate-180' : ''} />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-hidden px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={onMobileClose} // Tutup otomatis di mobile saat klik menu
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isCollapsed ? 'lg:justify-center' : ''}`}
              >
                <Icon
                  size={20}
                  className={isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                />
                <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 space-y-1 border-t border-gray-100 px-3 py-4">
          <div className={`${isCollapsed ? 'lg:hidden' : ''}`}>
          {user && (
            <div className="mx-1 mb-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="mt-1 truncate text-xs text-gray-500">{user.email}</p>
            </div>
          )}
          </div>

          <Link
            href="/settings"
            onClick={onMobileClose}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 ${
              isCollapsed ? 'lg:justify-center' : ''
            }`}
          >
            <Settings size={20} className="text-gray-400" />
            <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>Settings</span>
          </Link>

          <LogoutButton collapsed={isCollapsed} onClick={onMobileClose} />
        </div>
      </aside>
    </>
  );
}
