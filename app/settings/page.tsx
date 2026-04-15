'use client';

import { useState } from 'react';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import GeneralStoreInfo from '@/components/settings/GeneralStoreInfo';
import PricingServices from '@/components/settings/PricingServices';
import AccountSecurity from '@/components/settings/AccountSecurity';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('store');
  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    const sectionMap: Record<string, string> = {
      store: 'store',
      pricing: 'pricing',
      profile: 'profile',
    };
    const targetId = sectionMap[id];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        {/* Content */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <GeneralStoreInfo />
          <PricingServices />
          <AccountSecurity />
        </div>
      </div>
    </main>
  );
}