// app/settings/page.tsx
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
    <main className="space-y-2 p-4 bg-gray-50">
      <div className="flex gap-4 items-start">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-4">
            <GeneralStoreInfo />
            <PricingServices />
            <AccountSecurity />
          </div>
        </div>
      </div>
    </main>
  );
}