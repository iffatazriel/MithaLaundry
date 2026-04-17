'use client'

import { Tag } from 'lucide-react'

type PricingService = {
  id: string
  name: string
  description: string
  priceLabel: string
  unit: string
  price: number
}

type PricingServicesProps = {
  services: PricingService[]
}

const iconToneByIndex = [
  'bg-blue-50 text-blue-600',
  'bg-orange-50 text-orange-500',
  'bg-emerald-50 text-emerald-600',
  'bg-gray-100 text-gray-500',
]

export default function PricingServices({ services }: PricingServicesProps) {
  return (
    <section id="pricing" className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Pricing & Services</h2>
          <p className="mt-1 text-sm text-gray-500">
            Daftar layanan ini berasal dari konfigurasi aktif yang dipakai form order saat ini.
          </p>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {services.length} layanan aktif
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-100 hover:bg-white"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  iconToneByIndex[index % iconToneByIndex.length]
                }`}
              >
                <Tag size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{service.name}</p>
                    <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                    {service.priceLabel}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-gray-200">
                    Unit: {service.unit}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 ring-1 ring-gray-200">
                    Source: `lib/data.ts`
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
        Section ini sekarang hanya menampilkan layanan yang benar-benar dipakai aplikasi. Form edit
        dihapus dulu supaya halaman settings tetap konsisten dengan data yang tersedia saat ini.
      </div>
    </section>
  )
}
