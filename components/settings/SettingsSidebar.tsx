'use client';

import { Store, Tag, User, Bell } from 'lucide-react';

const navItems = [
  { id: 'store', label: 'General Store Info', icon: Store, href: '#store' },
  { id: 'pricing', label: 'Pricing & Services', icon: Tag, href: '#pricing' },
  { id: 'profile', label: 'Account Security', icon: User, href: '#profile' },
];

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export default function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <aside className="w-60 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm h-fit sticky top-8">
      {/* Profile */}
      <div className="p-5 border-b border-gray-100 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 overflow-hidden">
          <span className="text-xl font-semibold text-blue-700">AF</span>
        </div>
        <p className="text-sm font-semibold text-gray-800">Ahmad Faisal</p>
        <p className="text-xs text-gray-500 mt-0.5">Store Manager</p>
        <span className="inline-block mt-2 text-[11px] font-medium bg-blue-50 text-blue-700 px-3 py-0.5 rounded-full border border-blue-100">
          Admin Access
        </span>
      </div>

      {/* Nav */}
      <nav className="p-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
              activeSection === id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Icon size={16} className="flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}