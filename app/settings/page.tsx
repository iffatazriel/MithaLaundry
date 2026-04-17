import { SERVICES, formatRupiah } from '@/lib/data'
import { getCurrentUser, requireSession } from '@/lib/auth/server'
import { prisma } from '@/lib/prisma'
import SettingsPageClient from '@/components/settings/SettingsPageClient'

function formatRole(role: string) {
  return role
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default async function SettingsPage() {
  await requireSession()

  const [currentUser, customerCount, orderCount, readyPickupCount, expressOrderCount] =
    await Promise.all([
      getCurrentUser(),
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: 'ready',
        },
      }),
      prisma.order.count({
        where: {
          isExpress: true,
        },
      }),
    ])

  const operationalSummary = {
    customerCount,
    orderCount,
    readyPickupCount,
    expressOrderCount,
  }

  const highestServicePrice = Math.max(...SERVICES.map((service) => service.price))
  const lowestServicePrice = Math.min(...SERVICES.map((service) => service.price))

  const storeInfo = {
    storeName: 'Mitha Laundry',
    description: 'Laundry management system untuk operasional harian, pelanggan, order, dan laporan.',
    contactEmail: currentUser?.email ?? 'Belum tersedia',
    contactPhone: 'Belum diatur',
    address: 'Belum diatur',
    serviceCount: SERVICES.length,
    priceRange: `${formatRupiah(lowestServicePrice)} - ${formatRupiah(highestServicePrice)}`,
  }

  const accountInfo = {
    fullName: currentUser?.name ?? 'Admin',
    email: currentUser?.email ?? 'Belum tersedia',
    role: formatRole(currentUser?.role ?? 'admin'),
    initials: currentUser?.initials ?? 'AD',
  }

  const pricingServices = SERVICES.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    priceLabel: `${formatRupiah(service.price)} / ${service.unit}`,
    unit: service.unit,
    price: service.price,
  }))

  return (
    <SettingsPageClient
      accountInfo={accountInfo}
      operationalSummary={operationalSummary}
      pricingServices={pricingServices}
      storeInfo={storeInfo}
    />
  )
}
