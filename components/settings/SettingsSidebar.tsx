// components/settings/SettingsSidebar.tsx
'use client';
import { Store, Tag, User } from 'lucide-react';

const navItems = [
  { id: 'store', label: 'General Store Info', icon: Store, href: '#store' },
  { id: 'pricing', label: 'Pricing & Services', icon: Tag, href: '#pricing' },
  { id: 'profile', label: 'Account Security', icon: User, href: '#profile' },
];

interface SettingsSidebarProps {
  accountInfo: {
    fullName: string;
    email: string;
    role: string;
    initials: string;
  };
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export default function SettingsSidebar({
  accountInfo,
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <aside className="h-fit w-full flex-shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm xl:sticky xl:top-8 xl:w-96">
      {/* Profile */}
      <div className="p-5 border-b border-gray-100 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 overflow-hidden">
          <span className="text-xl font-semibold text-blue-700">{accountInfo.initials}</span>
        </div>
        <p className="text-sm font-semibold text-gray-800">{accountInfo.fullName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{accountInfo.role}</p>
        <p className="mt-1 text-xs text-gray-400">{accountInfo.email}</p>
        <span className="inline-block mt-3 text-[11px] font-medium bg-blue-50 text-blue-700 px-3 py-0.5 rounded-full">
          Admin Access
        </span>
      </div>

      {/* Nav */}
      <nav className="flex gap-2 overflow-x-auto p-2 xl:block xl:space-y-0">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 xl:w-full ${
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
