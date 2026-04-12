'use client'
import { useRef, useImperativeHandle, forwardRef } from 'react'
import html2canvas from 'html2canvas'
import Image from 'next/image'
import { formatRupiah } from '@/lib/data'

interface ReceiptProps {
  order: any
  customer: any
}

export interface ReceiptHandle {
  generateImage: () => Promise<string | null>
}

const ReceiptGenerator = forwardRef<ReceiptHandle, ReceiptProps>(
  ({ order, customer }, ref) => {
    const receiptRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      generateImage: async () => {
        if (!receiptRef.current) return null
        try {
          const canvas = await html2canvas(receiptRef.current, {
            scale:           3,
            useCORS:         true,
            backgroundColor: '#ffffff',
            logging:         false,
          })
          return canvas.toDataURL('image/png')
        } catch (error) {
          console.error('Error generating receipt:', error)
          return null
        }
      },
    }))

    const handleDownload = async () => {
      if (!receiptRef.current) return
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale:           3,
          useCORS:         true,
          backgroundColor: '#ffffff',
          logging:         false,
        })
        const link     = document.createElement('a')
        link.download  = `receipt-${order.id || Date.now()}.png`
        link.href      = canvas.toDataURL('image/png')
        link.click()
      } catch (error) {
        console.error('Error downloading receipt:', error)
      }
    }

    return (
      
      <div style={{ padding: '24px', backgroundColor: '#f9fafb' }}>

        {/* ── Receipt canvas area ── */}
        <div
          ref={receiptRef}
          style={{
            fontFamily:      'Arial, sans-serif', 
            width:           '400px',
            minHeight:       '600px',
            padding:         '32px 24px',
            backgroundColor: '#ffffff',
            borderRadius:    '16px',
            margin:          '0 auto',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width:           '72px',
              height:          '72px',
              background:      'linear-gradient(135deg, #6366f1, #3b82f6)',
              borderRadius:    '16px',
              margin:          '0 auto 16px',
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
            }}>
              <Image 
                src="icons/Background.svg" 
                alt="Background Icon" 
                width={30} 
                height={30} 
            />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px' }}>
              LAUNDRY EXPRESS
            </h1>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Cepat • Bersih • Terpercaya
            </p>
          </div>

          {/* Customer Info */}
          <div style={{ marginBottom: '20px' }}>
            {[
              { label: 'Customer', value: customer.name },
              { label: 'Phone',    value: customer.phone },
              { label: 'Tanggal',  value: new Date().toLocaleDateString('id-ID') },
            ].map((row) => (
              <div key={row.label} style={{
                display:        'flex',
                justifyContent: 'space-between',
                fontSize:       '13px',
                color:          '#4b5563',
                marginBottom:   '8px',
              }}>
                <span>{row.label}</span>
                <span style={{ fontWeight: '600', color: '#111827' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '20px 0' }} />

          {/* Services */}
          <div style={{ marginBottom: '20px' }}>
            {order.services?.map((service: any, index: number) => (
              <div key={index} style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
                padding:        '10px 0',
                borderBottom:   index < order.services.length - 1 ? '1px solid #f3f4f6' : 'none',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                    {service.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                    {service.quantity} {service.quantity <= 1 ? 'pcs' : 'pcs'}
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                  {formatRupiah(service.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Express fee jika ada */}
          {order.isExpress && (
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              fontSize:       '13px',
              color:          '#4b5563',
              marginBottom:   '12px',
            }}>
              <span>Express Fee</span>
              <span style={{ fontWeight: '600' }}>{formatRupiah(order.expressFee)}</span>
            </div>
          )}

          {/* Total */}
          <div style={{
            background:    'linear-gradient(135deg, #eef2ff, #eff6ff)',
            padding:       '16px',
            borderRadius:  '12px',
            marginBottom:  '20px',
          }}>
            <div style={{
              display:        'flex',
              justifyContent: 'space-between',
              fontSize:       '16px',
              fontWeight:     'bold',
              color:          '#111827',
            }}>
              <span>TOTAL</span>
              <span>{formatRupiah(order.total)}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px', textAlign: 'center' }}>
              Status: <span style={{ fontWeight: '700', color: '#4f46e5' }}>PENDING</span>
            </div>
          </div>

          {/* Payment method */}
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            fontSize:       '12px',
            color:          '#6b7280',
            marginBottom:   '20px',
          }}>
            <span>Metode Pembayaran</span>
            <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>{order.payment}</span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '16px 0' }} />

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 4px' }}>
              Terima kasih telah menggunakan layanan kami
            </p>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 12px' }}>
              Hubungi 0812-3456-7890 untuk info lebih lanjut
            </p>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#374151', margin: 0 }}>
              Simpan struk ini untuk penjemputan
            </p>
          </div>
        </div>

        {/* Action Buttons  */}
        <div style={{ display: 'flex', gap: '12px', padding: '16px 0 0' }}>
          <button
            onClick={handleDownload}
            style={{
              flex:          1,
              background:    'linear-gradient(135deg, #6366f1, #3b82f6)',
              color:         '#ffffff',
              padding:       '14px',
              borderRadius:  '12px',
              fontWeight:    '600',
              fontSize:      '14px',
              border:        'none',
              cursor:        'pointer',
            }}
          >
            📸 Download PNG
          </button>
          <button
            onClick={() => window.print()}
            style={{
              flex:          1,
              background:    'linear-gradient(135deg, #6b7280, #4b5563)',
              color:         '#ffffff',
              padding:       '14px',
              borderRadius:  '12px',
              fontWeight:    '600',
              fontSize:      '14px',
              border:        'none',
              cursor:        'pointer',
            }}
          >
            🖨️ Print
          </button>
        </div>
      </div>
    )
  }
)

ReceiptGenerator.displayName = 'ReceiptGenerator'
export default ReceiptGenerator