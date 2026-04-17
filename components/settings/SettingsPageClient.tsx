'use client'

import { useState } from 'react'
import SettingsSidebar from '@/components/settings/SettingsSidebar'
import GeneralStoreInfo from '@/components/settings/GeneralStoreInfo'
import PricingServices from '@/components/settings/PricingServices'
import AccountSecurity from '@/components/settings/AccountSecurity'

type AccountInfo = {
  fullName: string
  email: string
  role: string
  initials: string
}

type StoreInfo = {
  storeName: string
  description: string
  contactEmail: string
  contactPhone: string
  address: string
  serviceCount: number
  priceRange: string
}

type PricingService = {
  id: string
  name: string
  description: string
  priceLabel: string
  unit: string
  price: number
}

type OperationalSummary = {
  customerCount: number
  orderCount: number
  readyPickupCount: number
  expressOrderCount: number
}

type SettingsPageClientProps = {
  accountInfo: AccountInfo
  operationalSummary: OperationalSummary
  pricingServices: PricingService[]
  storeInfo: StoreInfo
}

export default function SettingsPageClient({
  accountInfo,
  operationalSummary,
  pricingServices,
  storeInfo,
}: SettingsPageClientProps) {
  const [activeSection, setActiveSection] = useState('store')

  const handleSectionChange = (id: string) => {
    setActiveSection(id)
    const sectionMap: Record<string, string> = {
      store: 'store',
      pricing: 'pricing',
      profile: 'profile',
    }
    const targetId = sectionMap[id]

    if (!targetId) {
      return
    }

    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <main className="space-y-4 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <SettingsSidebar
          accountInfo={accountInfo}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4">
            <GeneralStoreInfo
              operationalSummary={operationalSummary}
              storeInfo={storeInfo}
            />
            <PricingServices services={pricingServices} />
            <AccountSecurity accountInfo={accountInfo} />
          </div>
        </div>
      </div>
    </main>
  )
}
