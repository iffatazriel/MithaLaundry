
'use client'

import { useState } from 'react'
import Image from 'next/image';
import { UserPlus, ChevronRight } from 'lucide-react'
import type { ServiceType, PaymentMethod } from '@/types'
import { SERVICES, formatRupiah } from '@/lib/data'

interface ServiceQuantity {
  quantity: number
}

export default function NewOrderPage() {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [serviceQtys, setServiceQtys] = useState<Record<ServiceType, number>>(
    Object.fromEntries(SERVICES.map((s) => [s.id, 0])) as Record<ServiceType, number>
  )
  const [payment, setPayment] = useState<PaymentMethod>('cash')
  const [itemCount, setItemCount] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [isExpress, setIsExpress] = useState(false)

  const updateQty = (id: ServiceType, delta: number) => {
    setServiceQtys((prev) => ({
      ...prev,
      [id]: Math.max(0, Number((prev[id] + delta).toFixed(1))),
    }))
  }

  const selectedServices = SERVICES.filter((s) => serviceQtys[s.id] > 0)

  const subtotal = selectedServices.reduce(
    (sum, s) => sum + s.price * serviceQtys[s.id],
    0
  )
  const expressCharge = isExpress ? 5000 : 0
  const grandTotal = subtotal + expressCharge

  const handleSubmit = () => {
    const order = {
      customer: { name: customerName, phone: customerPhone },
      services: selectedServices.map((s) => ({
        ...s,
        quantity: serviceQtys[s.id],
        subtotal: s.price * serviceQtys[s.id],
      })),
      payment,
      itemCount,
      deliveryDate,
      isExpress,
      grandTotal,
    }
    console.log('New order:', order)
    alert('Order created! Redirecting to WhatsApp...')
  }

  return (
    <div className="p-7 max-w-[1100px]">
      <h1 className="text-2xl font-bold text-gray-900 mb-7">New Order</h1>

      <div className="grid grid-cols-[1fr_280px] gap-5">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Customer Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold text-blue-700">
                <UserPlus size={17} />
                Customer Details
              </h2>
              <button className="text-sm text-blue-700 hover:underline">Select Existing</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Phone Number
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-400">
                  <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r border-gray-200">+62</span>
                  <input
                    type="tel"
                    placeholder="812 3456 7890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="flex-1 px-3 py-2.5 text-sm placeholder:text-gray-300 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Select Services */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-blue-700 mb-5">
              <span>
                <Image src="icons/services.svg" alt="Service Icon" width={25} height={25} />
              </span>
              Select Services
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((service) => {
                const qty = serviceQtys[service.id]
                const isSelected = qty > 0
                return (
                  <div
                    key={service.id}
                    className={`rounded-xl border p-4 transition-colors relative ${
                      isSelected
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                    )}
                   <div className="w-8 h-8 bg-gray-100 rounded-lg mb-3 flex items-center justify-center flex-shrink-0">
                      <Image 
                        src={
                          service.id === 'cuci-setrika' ? '/icons/hanger.svg' : 
                          service.id === 'setrika' ? 'icons/setrika.svg' : 
                          service.id === 'cuci-sepatu' ? 'icons/cantelan.svg' : 
                          'icons/bed.svg'
                        } 
                        alt={service.id} 
                        width={20} 
                        height={20} 
                      />
                    </div>

                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{service.name}</p>
                    <p className="text-xs text-gray-400 mb-3">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-700">
                        {formatRupiah(service.price)}
                        <span className="text-xs font-normal text-gray-400">/{service.unit}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(service.id, -0.5)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{qty}</span>
                        <button
                          onClick={() => updateQty(service.id, 0.5)}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Item count & date */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Jumlah Baju (Items)
                </label>
                <input
                  type="number"
                  placeholder="Enter total pieces..."
                  value={itemCount}
                  onChange={(e) => setItemCount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Pickup/Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-2">
              {(['cash', 'qris'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPayment(method)}
                  className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl text-sm font-medium transition-colors border ${
                    payment === method
                      ? 'border-blue-700 border-2 bg-blue-50 text-blue-800'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                    <span className="inline-flex items-center text-xl">
                    <Image
                        src={
                        method === 'cash' ? 'icons/margin.svg' : 
                        method === 'qris' ? 'icons/Icon.svg' : 
                        '/code.svg'
                        }
                        alt={method}
                        width={20}
                        height={20}
                    />
                    </span>
                  {method.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#e0e3e5] rounded-xl p-5 text-black">
            <h2 className="text-[15px] font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {selectedServices.length === 0 ? (
                <p className="text-sm text-gray-400">No services selected</p>
              ) : (
                selectedServices.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {s.name} ({serviceQtys[s.id]} {s.unit})
                    </span>
                    <span>{formatRupiah(s.price * serviceQtys[s.id])}</span>
                  </div>
                ))
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Express Service</span>
                <span>{isExpress ? formatRupiah(expressCharge) : 'Rp 0'}</span>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-3 mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Grand Total</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{formatRupiah(grandTotal)}</p>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">PENDING</span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-3 text-sm flex items-center justify-center gap-2 mb-2 transition-colors"
            >
              <ChevronRight size={14} />
              Create Order & WhatsApp
            </button>
            <button className="w-full text-gray-400 hover:text-gray-300 text-sm py-2">
              Save as Draft
            </button>
          </div>

          {/* Operator Tip */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-orange-500 mt-0.5">
                <Image src="icons/note.svg" alt="Tip Icon" width={20} height={20} />
              </span>
              <div>
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">Operator Tip</p>
                <p className="text-xs text-orange-600 leading-relaxed">
                  Ensure clothes are weighed in front of the customer to avoid disputes. Don't forget to check pockets!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}