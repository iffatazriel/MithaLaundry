'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { UserPlus, ChevronRight, X, Receipt } from 'lucide-react'
import type { ServiceType, PaymentMethod } from '@/types'
import { SERVICES, formatRupiah } from '@/lib/data'
import SelectCustomerModal from '@/components/orders/SelectCustomerModal'
import ReceiptGenerator, { ReceiptHandle } from '@/components/ReceiptGenerator'

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

  const [openCustomerModal, setOpenCustomerModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [showReceipt, setShowReceipt] = useState(false)

  const receiptRef = useRef<ReceiptHandle>(null)

  const selectedServices = SERVICES.filter((s) => serviceQtys[s.id] > 0)

  const subtotal = selectedServices.reduce((sum, s) => sum + s.price * serviceQtys[s.id], 0)
  const expressCharge = isExpress ? 5000 : 0
  const grandTotal = subtotal + expressCharge

  const updateQty = (id: ServiceType, delta: number) => {
    setServiceQtys((prev) => ({
      ...prev,
      [id]: Math.max(0, Number((prev[id] + delta).toFixed(1))),
    }))
  }

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      alert('Nama customer wajib diisi.')
      return
    }

    if (!customerPhone.trim()) {
      alert('Nomor telepon wajib diisi.')
      return
    }

    if (selectedServices.length === 0) {
      alert('Pilih minimal satu layanan.')
      return
    }

    try {
      let activeCustomer = selectedCustomer

if (!activeCustomer) {
  const createCustomerRes = await fetch('/api/customers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: customerName.trim(),
      phone: customerPhone.trim(),
      status: 'regular',
    }),
  })

  const customerPayload = await createCustomerRes.json()
  console.log('create customer payload:', customerPayload)

  if (!createCustomerRes.ok) {
    throw new Error(
      customerPayload?.detail ||
      customerPayload?.error ||
      'Failed to create customer'
    )
  }

  activeCustomer = customerPayload
  setSelectedCustomer(customerPayload)
}

      const order = {
        customerId: activeCustomer.id,
        services: selectedServices.map((s) => ({
          name: s.name,
          price: s.price,
          quantity: serviceQtys[s.id],
          subtotal: s.price * serviceQtys[s.id],
        })),
        payment,
        itemCount: Number(itemCount),
        deliveryDate,
        isExpress,
        subtotal,
        expressFee: expressCharge,
        total: grandTotal,
      }

      const imageDataUrl = await receiptRef.current?.generateImage()

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to create order')
      }

      const savedOrder = { ...order, id: data.id }
      setCurrentOrder(savedOrder)

      await sendWhatsappWithImage(savedOrder, imageDataUrl ?? null, activeCustomer)
    } catch (error) {
      console.error('Submit error:', error)
      alert(error instanceof Error ? error.message : 'Gagal membuat order. Coba lagi.')
    }
  }

  const sendWhatsappWithImage = async (
    order: any,
    imageDataUrl: string | null,
    customerOverride?: any
  ) => {
    const activeCustomer = customerOverride ?? selectedCustomer

    if (!activeCustomer) {
      alert('Customer tidak ditemukan.')
      return
    }

    const cleanPhone = activeCustomer.phone
      .replace(/\D/g, '')
      .replace(/^0+/, '62')

    if (!imageDataUrl) {
      const msg =
        `Halo *${activeCustomer.name}* 👋%0A` +
        `💰 *Total: ${formatRupiah(order.total)}*%0A` +
        `Terima kasih telah menggunakan layanan kami ✨`
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer')
      return
    }

    const byteString = atob(imageDataUrl.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)

    const blob = new Blob([ab], { type: 'image/png' })
    const file = new File([blob], `receipt-${order.id || Date.now()}.png`, { type: 'image/png' })

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Struk Laundry',
          text: `Halo ${activeCustomer.name}, berikut struk laundry Anda.`,
        })
        return
      } catch {
        return
      }
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])

      const msg =
        `Halo *${activeCustomer.name}* 👋%0A` +
        `%0A` +
        `Struk sudah disalin ke clipboard.%0A` +
        `Silakan *paste (Ctrl+V)* gambar di sini 👇%0A` +
        `%0A` +
        `💰 *Total: ${formatRupiah(order.total)}*%0A` +
        `📅 *Estimasi: ${
          order.deliveryDate
            ? new Date(order.deliveryDate).toLocaleDateString('id-ID')
            : '-'
        }*`

      alert('📋 Struk berhasil disalin!\nSetelah WhatsApp terbuka, tekan Ctrl+V untuk paste gambar.')

      setTimeout(() => {
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer')
      }, 300)
    } catch {
      const msg =
        `Halo *${activeCustomer.name}* 👋%0A` +
        `💰 *Total: ${formatRupiah(order.total)}*%0A` +
        `Terima kasih telah menggunakan layanan kami ✨`
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    if (selectedCustomer) {
      setCustomerName(selectedCustomer.name)
      setCustomerPhone(selectedCustomer.phone)
    }
  }, [selectedCustomer])

  const getServiceIcon = (id: string) => {
    const map: Record<string, string> = {
      'cuci-setrika': '/icons/hanger.svg',
      'setrika': '/icons/setrika.svg',
      'cuci-sepatu': '/icons/cantelan.svg',
    }
    return map[id] ?? '/icons/bed.svg'
  }

  return (
    <>
      <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-7 lg:py-7 max-w-[1100px] mx-auto">
        <div className="flex items-center justify-between mb-5 sm:mb-7">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">New Order</h1>
        </div>

        {currentOrder && selectedCustomer && (
          <div
            className={`
              sticky top-3 sm:top-4 z-20 mb-5 sm:mb-7 p-4 sm:p-5 rounded-2xl border shadow-lg backdrop-blur-sm
              bg-gradient-to-r from-green-50/95 to-blue-50/95 border-green-200/80
              transition-all duration-300 ease-out
              hover:shadow-xl
              group
              ${showReceipt ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
            `}
            style={{
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transform: 'translateZ(0)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
              <div className="relative z-10 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <p className="text-sm font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent truncate">
                    Order #{currentOrder.id?.toString().slice(-6) || 'NEW'} berhasil dibuat!
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                  Total:{' '}
                  <span className="font-semibold text-gray-900">
                    {formatRupiah(currentOrder.total)}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setShowReceipt(true)}
                className="w-full sm:w-auto shrink-0 px-4 sm:px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out active:scale-95 relative overflow-hidden"
              >
                <span className="relative flex items-center justify-center gap-1.5">
                  <Receipt className="w-4 h-4" />
                  Buat Struk
                </span>
              </button>
            </div>

            <div className="absolute bottom-2 right-2 w-20 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          <div className="space-y-5 min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-blue-700">
                  <UserPlus size={17} />
                  Customer Details
                </h2>
                <button
                  type="button"
                  onClick={() => setOpenCustomerModal(true)}
                  className="text-sm text-blue-700 hover:underline text-left sm:text-right"
                >
                  Select Existing
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Budi Santoso"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value)
                      if (selectedCustomer && e.target.value !== selectedCustomer.name) {
                        setSelectedCustomer(null)
                      }
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                    Phone Number
                  </label>
                  {selectedCustomer && (
                    <p className="mt-2 text-xs text-blue-600">
                      Menggunakan customer terdaftar: {selectedCustomer.name}
                    </p>
                  )}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-400">
                    <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-500 border-r border-gray-200">
                      +62
                    </span>
                    <input
                      type="tel"
                      placeholder="812 3456 7890"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value)
                        if (selectedCustomer && e.target.value !== selectedCustomer.phone) {
                          setSelectedCustomer(null)
                        }
                      }}
                      className="flex-1 min-w-0 px-3 py-2.5 text-sm placeholder:text-gray-300 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold text-blue-700">
                  <Image src="/icons/services.svg" alt="Services" width={25} height={25} />
                  Select Services
                </h2>

                <label className="flex items-center gap-1.5 lg:ml-auto text-sm font-normal text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExpress}
                    onChange={(e) => setIsExpress(e.target.checked)}
                    className="accent-blue-600"
                  />
                  Express <span className="text-blue-600 font-semibold">(+Rp 5.000)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          src={getServiceIcon(service.id)}
                          alt={service.id}
                          width={20}
                          height={20}
                        />
                      </div>

                      <p className="text-sm font-semibold text-gray-900 mb-0.5">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-400 mb-3">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-blue-700">
                          {formatRupiah(service.price)}
                          <span className="text-xs font-normal text-gray-400">
                            /{service.unit}
                          </span>
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                    Jumlah Baju (Items)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Enter total pieces..."
                    value={itemCount}
                    onChange={(e) => setItemCount(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                    Pickup / Delivery Date
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

          <div className="space-y-4 min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-2">
                {(['cash', 'qris'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPayment(method)}
                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl text-sm font-medium transition-colors border-2 ${
                      payment === method
                        ? 'border-blue-700 bg-blue-50 text-blue-800'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Image
                      src={method === 'cash' ? '/icons/margin.svg' : '/icons/Icon.svg'}
                      alt={method}
                      width={20}
                      height={20}
                    />
                    {method.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#e0e3e5] rounded-xl p-4 sm:p-5 text-black">
              <h2 className="text-[15px] font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                {selectedServices.length === 0 ? (
                  <p className="text-sm text-gray-400">No services selected</p>
                ) : (
                  selectedServices.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-gray-600 break-words">
                        {s.name} ({serviceQtys[s.id]} {s.unit})
                      </span>
                      <span className="shrink-0">
                        {formatRupiah(s.price * serviceQtys[s.id])}
                      </span>
                    </div>
                  ))
                )}

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-600">Express Service</span>
                  <span className="shrink-0">
                    {isExpress ? formatRupiah(expressCharge) : 'Rp 0'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-400 pt-3 mb-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Grand Total
                </p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xl sm:text-2xl font-bold break-words">
                    {formatRupiah(grandTotal)}
                  </p>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full shrink-0">
                    PENDING
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg py-3 text-sm flex items-center justify-center gap-2 mb-2 transition-colors"
              >
                <ChevronRight size={14} />
                Create Order & WhatsApp
              </button>

              <button className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors">
                Save as Draft
              </button>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-orange-500 mt-0.5 shrink-0">
                  <Image src="/icons/note.svg" alt="Tip" width={20} height={20} />
                </span>
                <div>
                  <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">
                    Operator Tip
                  </p>
                  <p className="text-xs text-orange-600 leading-relaxed">
                    Pastikan baju ditimbang di depan pelanggan untuk menghindari selisih.
                    Jangan lupa cek kantong!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0">
        <ReceiptGenerator
          ref={receiptRef}
          order={{
            id: null,
            services: selectedServices.map((s) => ({
              name: s.name,
              price: s.price,
              quantity: serviceQtys[s.id],
              subtotal: s.price * serviceQtys[s.id],
            })),
            payment,
            itemCount: Number(itemCount),
            deliveryDate,
            isExpress,
            subtotal,
            expressFee: expressCharge,
            total: grandTotal,
          }}
          customer={selectedCustomer ?? { name: '', phone: '' }}
        />
      </div>

      <SelectCustomerModal
        isOpen={openCustomerModal}
        onClose={() => setOpenCustomerModal(false)}
        onSelect={(customer) => setSelectedCustomer(customer)}
      />

      {showReceipt && currentOrder && selectedCustomer && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReceipt(false)
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 sticky top-0 bg-white border-b border-gray-100 z-10 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Digital Receipt
              </h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <ReceiptGenerator order={currentOrder} customer={selectedCustomer} />
          </div>
        </div>
      )}
    </>
  )
}