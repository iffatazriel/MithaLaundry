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
        className={`bg-white border-r border-gray-100 flex flex-col h-screen fixed lg:sticky top-0 left-0 transition-transform duration-300 z-50 w-[88vw] max-w-64 lg:max-w-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-gray-100">
          {/* Logo - Hilang saat collapsed */}
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-xl">
                <Image
                  src="/icons/Background.svg"
                  alt="Mitha Laundry"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-none">Mitha Laundry</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Premium Service</p>
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
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={onMobileClose} // Tutup otomatis di mobile saat klik menu
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon
                  size={20}
                  className={isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-6 border-t border-gray-100 space-y-1">
          {!isCollapsed && user && (
            <div className="mx-1 mb-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="mt-1 text-xs text-gray-500">{user.email}</p>
            </div>
          )}

          <Link
            href="/settings"
            onClick={onMobileClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <Settings size={20} className="text-gray-400" />
            {!isCollapsed && <span>Settings</span>}
          </Link>

          <LogoutButton collapsed={isCollapsed} onClick={onMobileClose} />
        </div>
      </aside>
    </>
  );
}
