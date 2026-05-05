'use client'

import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Loader2, QrCode, RefreshCcw } from 'lucide-react'
import { formatRupiah } from '@/lib/data'

type QrisResponse = {
  qr_string?: string
  status?: string
  message?: string
  error_code?: string
  qr_code_id?: string
  reference_id?: string
  xendit_status?: number
}

const canSimulatePayment = process.env.NODE_ENV !== 'production'

export default function QrisPayment({
  orderId,
  amount,
}: {
  orderId: string
  amount: number
}) {
  const [qrString, setQrString] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [simulating, setSimulating] = useState(false)

  async function handleCreateQris() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/payment/qris', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, amount }),
      })

      const data = (await res.json()) as QrisResponse

      if (!res.ok) {
        throw new Error(data.message || data.error_code || 'Gagal membuat QRIS')
      }

      if (!data.qr_string) {
        throw new Error('QRIS berhasil dibuat, tetapi QR string tidak ditemukan.')
      }

      setQrString(data.qr_string)
      setStatus(data.status ?? 'ACTIVE')
    } catch (caughtError) {
      setQrString('')
      setStatus('')
      setError(caughtError instanceof Error ? caughtError.message : 'Gagal membuat QRIS')
    } finally {
      setLoading(false)
    }
  }

  async function handleSimulatePayment() {
    setSimulating(true)
    setError('')

    try {
      const res = await fetch('/api/payment/qris/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      })

      const data = (await res.json()) as QrisResponse

      if (!res.ok) {
        const details = [
          data.message || data.error_code || 'Gagal mensimulasikan pembayaran',
          data.qr_code_id ? `QR: ${data.qr_code_id}` : '',
          data.reference_id ? `Ref: ${data.reference_id}` : '',
          data.xendit_status ? `Xendit HTTP ${data.xendit_status}` : '',
        ].filter(Boolean)

        throw new Error(details.join(' | '))
      }

      setStatus(data.status ?? 'COMPLETED')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Gagal mensimulasikan pembayaran'
      )
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <QrCode className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900">QRIS Dinamis</h3>
          <p className="mt-1 text-xs leading-5 text-gray-600">
            Buat QRIS untuk order #{orderId.slice(-6).toUpperCase()} senilai{' '}
            <span className="font-semibold text-gray-900">{formatRupiah(amount)}</span>.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCreateQris}
        disabled={loading || amount <= 0}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Membuat QRIS...
          </>
        ) : qrString ? (
          <>
            <RefreshCcw className="h-4 w-4" />
            Buat Ulang QRIS
          </>
        ) : (
          <>
            <QrCode className="h-4 w-4" />
            Buat QRIS
          </>
        )}
      </button>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}

      {qrString ? (
        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-900">Scan QRIS Pembayaran</p>
          <div className="inline-flex rounded-lg bg-white p-2">
            <QRCodeCanvas value={qrString} size={220} includeMargin />
          </div>
          <div className="mt-3 space-y-1 text-xs text-gray-500">
            <p>
              Nominal:{' '}
              <span className="font-semibold text-gray-800">{formatRupiah(amount)}</span>
            </p>
            {status ? <p>Status QR: {status}</p> : null}
          </div>
          {canSimulatePayment ? (
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={simulating}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
            >
              {simulating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Simulasi berjalan...
                </>
              ) : (
                'Simulasikan Pembayaran Test'
              )}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
