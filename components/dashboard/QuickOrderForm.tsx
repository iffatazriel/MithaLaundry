'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const SERVICE_OPTIONS = [
  { value: 'cuci-setrika', label: 'Cuci & Setrika 5k/kg' },
  { value: 'setrika', label: 'Setrika saja 4k/kg' },
  { value: 'cuci-sepatu', label: 'Cuci Sepatu 18k/pair' },
  { value: 'bedcover', label: 'Cuci Bedcover 15k/item' },
]

export default function QuickOrderForm() {
  const [service, setService] = useState('cuci-setrika')
  const [weight, setWeight] = useState('0.0')
  const [items, setItems] = useState('0')
  const [payment, setPayment] = useState<'cash' | 'qris'>('cash')

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-gray-900">Quick New Order</h2>
        <Link href="/orders/new">
          <Plus size={20} className="text-blue-700 cursor-pointer" />
        </Link>
      </div>

      {/* Service Type */}
      <div className="mb-4">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
          Service Type
        </label>
        <div className="relative">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 cursor-pointer pr-8 focus:outline-none focus:border-blue-400"
          >
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
        </div>
      </div>

      {/* Weight & Items */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
            Weight/Qty
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1 text-sm text-gray-800 outline-none w-12 bg-transparent"
              step="0.1"
              min="0"
            />
            <span className="text-xs text-gray-400 font-medium">KG</span>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
            Jumlah Baju
          </label>
          <input
            type="number"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400"
            min="0"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-5">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['cash', 'qris'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setPayment(method)}
              className={`flex flex-col items-center gap-1 py-3 rounded-lg text-sm font-medium transition-colors border ${
                payment === method
                  ? 'border-blue-700 bg-blue-50 text-blue-800 border-2'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="inline-flex items-center text-xl">
                {method === 'cash' ? (
                    <Image src="icons/margin.svg" alt="Cash Icon" width={20} height={20} />
                ) : method === 'qris' ? (
                    <Image src="icons/Icon.svg" alt="QRIS Icon" width={20} height={20} />
                ) : null}
              </span>
              {method.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <Link href="/orders/new">
        <button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors">
          Create Order →
        </button>
      </Link>
    </div>
  )
}