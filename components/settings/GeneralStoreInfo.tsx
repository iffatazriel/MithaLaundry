'use client'

import { Building2, MapPin, Phone, Users } from 'lucide-react'

type GeneralStoreInfoProps = {
  storeInfo: {
    storeName: string
    description: string
    contactEmail: string
    contactPhone: string
    address: string
    serviceCount: number
    priceRange: string
  }
  operationalSummary: {
    customerCount: number
    orderCount: number
    readyPickupCount: number
    expressOrderCount: number
  }
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  const isUnset = value.toLowerCase().includes('belum')

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </label>
      <div
        className={`rounded-lg border px-3 py-2 text-sm ${
          isUnset
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-gray-200 bg-gray-50 text-gray-800'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

export default function GeneralStoreInfo({
  operationalSummary,
  storeInfo,
}: GeneralStoreInfoProps) {
  return (
    <section id="store" className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">General Store Info</h2>
          <p className="mt-1 text-sm text-gray-500">
            Identitas laundry yang saat ini benar-benar tersedia dari konfigurasi aplikasi dan data
            operasional.
          </p>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Live app snapshot
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-xl bg-blue-600 p-2 text-white">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{storeInfo.storeName}</p>
            <p className="mt-1 text-sm leading-6 text-gray-600">{storeInfo.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ReadOnlyField label="Nama Laundry" value={storeInfo.storeName} />
        <ReadOnlyField label="Email Kontak Admin" value={storeInfo.contactEmail} />
        <ReadOnlyField label="Nomor WhatsApp" value={storeInfo.contactPhone} />
        <ReadOnlyField label="Alamat Operasional" value={storeInfo.address} />
        <ReadOnlyField label="Jumlah Layanan Aktif" value={`${storeInfo.serviceCount} layanan`} />
        <ReadOnlyField label="Rentang Harga Layanan" value={storeInfo.priceRange} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Users size={16} />
            Pelanggan
          </div>
          <p className="text-2xl font-bold text-gray-900">{operationalSummary.customerCount}</p>
          <p className="mt-1 text-xs text-gray-500">Total customer tersimpan</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Building2 size={16} />
            Order
          </div>
          <p className="text-2xl font-bold text-gray-900">{operationalSummary.orderCount}</p>
          <p className="mt-1 text-xs text-gray-500">Total order di database</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <MapPin size={16} />
            Pickup Ready
          </div>
          <p className="text-2xl font-bold text-gray-900">{operationalSummary.readyPickupCount}</p>
          <p className="mt-1 text-xs text-gray-500">Status `ready` saat ini</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Phone size={16} />
            Express
          </div>
          <p className="text-2xl font-bold text-gray-900">{operationalSummary.expressOrderCount}</p>
          <p className="mt-1 text-xs text-gray-500">Order express tercatat</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
        Saat ini aplikasi belum memiliki tabel khusus untuk profil laundry seperti alamat, nomor
        WhatsApp, atau branding publik. Karena itu field yang belum tersimpan ditampilkan sebagai
        <span className="font-medium text-amber-700"> belum diatur</span> agar sesuai dengan data
        yang benar-benar ada.
      </div>
    </section>
  )
}
