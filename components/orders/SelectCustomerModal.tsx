'use client'

import { useState } from 'react'
import { Search, X, ChevronRight, UserRound } from 'lucide-react'
import { useOrderContext } from '@/lib/context/OrderContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (customer: any) => void
}

export default function SelectCustomerModal({ isOpen, onClose, onSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  const { customers, customersLoading } = useOrderContext()

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Select Customer
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Pilih pelanggan yang sudah terdaftar
              </p>
            </div>

            <button
              onClick={() => {
                onClose()
                setSearchTerm('')
              }}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau nomor telepon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[420px] overflow-y-auto">
          {customersLoading ? (
            <div className="px-5 sm:px-6 py-10">
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center gap-3 p-3 rounded-xl border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-24 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="px-5 sm:px-6 py-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900">No customers found</p>
              <p className="text-sm text-gray-500 mt-1">
                Coba gunakan nama atau nomor lain
              </p>
            </div>
          ) : (
            <div className="p-2 sm:p-3">
              {filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    onSelect(customer)
                    onClose()
                    setSearchTerm('')
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    {customer.name ? (
                      <span className="text-sm font-semibold">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <UserRound className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {customer.phone}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/70">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-500">
              {customersLoading ? 'Loading customers...' : `${filteredCustomers.length} customer ditemukan`}
            </p>

            <button
              onClick={() => {
                onClose()
                setSearchTerm('')
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}