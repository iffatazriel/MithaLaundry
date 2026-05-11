'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, RefreshCcw } from 'lucide-react'
import { formatRupiah } from '@/lib/data'

type QrisResponse = {
  token?: string
  redirect_url?: string
  client_key?: string
  snap_script_url?: string
  qr_string?: string
  status?: string
  message?: string
  error_code?: string
  qr_code_id?: string
  reference_id?: string
  gateway_status?: number
}

const canSimulatePayment = process.env.NODE_ENV !== 'production'

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void
          onPending?: (result: unknown) => void
          onError?: (result: unknown) => void
          onClose?: () => void
        }
      ) => void
    }
  }
}

function loadMidtransSnap(scriptUrl: string, clientKey: string) {
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-midtrans-snap="true"]'
    )

    if (
      existingScript &&
      existingScript.src === scriptUrl &&
      existingScript.dataset.clientKey === clientKey &&
      window.snap
    ) {
      resolve()
      return
    }

    if (existingScript) {
      existingScript.remove()
    }

    const script = document.createElement('script')
    script.src = scriptUrl
    script.async = true
    script.dataset.midtransSnap = 'true'
    script.dataset.clientKey = clientKey
    script.setAttribute('data-client-key', clientKey)
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap.'))
    document.body.appendChild(script)
  })
}

export default function QrisPayment({
  orderId,
  amount,
}: {
  orderId: string
  amount: number
}) {
  const [redirectUrl, setRedirectUrl] = useState('')
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

      if (!data.token) {
        throw new Error('Snap berhasil dibuat, tetapi token tidak ditemukan.')
      }

      if (!data.client_key || !data.snap_script_url) {
        throw new Error('Konfigurasi Snap belum lengkap.')
      }

      setRedirectUrl(data.redirect_url ?? '')
      setStatus(data.status ?? 'ACTIVE')
      await loadMidtransSnap(data.snap_script_url, data.client_key)

      if (!window.snap) {
        throw new Error('Midtrans Snap belum siap.')
      }

      window.snap.pay(data.token, {
        onSuccess: () => setStatus('paid'),
        onPending: () => setStatus('pending'),
        onError: () => setStatus('failed'),
        onClose: () => setStatus((currentStatus) => currentStatus || 'pending'),
      })
    } catch (caughtError) {
      setRedirectUrl('')
      setStatus('')
      setError(caughtError instanceof Error ? caughtError.message : 'Gagal membuat Snap payment')
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
          data.gateway_status ? `Gateway HTTP ${data.gateway_status}` : '',
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
          <ExternalLink className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900">Midtrans Snap</h3>
          <p className="mt-1 text-xs leading-5 text-gray-600">
            Buka halaman pembayaran Snap untuk order #{orderId.slice(-6).toUpperCase()} senilai{' '}
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
            Membuat Snap...
          </>
        ) : redirectUrl ? (
          <>
            <RefreshCcw className="h-4 w-4" />
            Buka Ulang Snap
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            Bayar via Snap
          </>
        )}
      </button>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}

      {redirectUrl ? (
        <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-900">Halaman Pembayaran Snap</p>
          <a
            href={redirectUrl}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            <ExternalLink className="h-4 w-4" />
            Buka Midtrans
          </a>
          <div className="mt-3 space-y-1 text-xs text-gray-500">
            <p>
              Nominal:{' '}
              <span className="font-semibold text-gray-800">{formatRupiah(amount)}</span>
            </p>
            {status ? <p>Status: {status}</p> : null}
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
