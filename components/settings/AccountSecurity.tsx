'use client'

import { KeyRound, ShieldCheck, UserRound } from 'lucide-react'

type AccountSecurityProps = {
  accountInfo: {
    fullName: string
    email: string
    role: string
    initials: string
  }
}

function InfoField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </label>
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
        {value}
      </div>
    </div>
  )
}

export default function AccountSecurity({ accountInfo }: AccountSecurityProps) {
  return (
    <section id="profile" className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Account Security</h2>
          <p className="mt-1 text-sm text-gray-500">
            Menampilkan identitas admin yang sedang aktif di session aplikasi.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <ShieldCheck size={14} />
          Session aktif
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
          {accountInfo.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{accountInfo.fullName}</p>
          <p className="truncate text-sm text-gray-500">{accountInfo.email}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <InfoField label="Nama Admin" value={accountInfo.fullName} />
        <InfoField label="Email Login" value={accountInfo.email} />
        <InfoField label="Role" value={accountInfo.role} />
        <InfoField label="Status Akses" value="Admin internal" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
            <UserRound size={16} />
            Informasi yang tersedia
          </div>
          <p className="text-sm leading-6 text-gray-500">
            Sistem saat ini sudah menyimpan nama, email, dan role admin dari akun login aktif.
          </p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800">
            <KeyRound size={16} />
            Password management
          </div>
          <p className="text-sm leading-6 text-amber-700">
            Penggantian password belum memiliki form penyimpanan khusus di settings, jadi belum
            ditampilkan sebagai aksi edit agar informasinya tetap akurat.
          </p>
        </div>
      </div>
    </section>
  )
}
