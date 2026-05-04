'use client'
import { useRef, useImperativeHandle, forwardRef } from 'react'
import html2canvas from 'html2canvas'
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

    // Hitung subtotal dari services
    const subtotal = order.services?.reduce((sum: number, service: any) => sum + service.subtotal, 0) || 0
    const total = subtotal + (order.isExpress ? (order.expressFee || 0) : 0)

    return (
      
      <div style={{ padding: '24px', backgroundColor: '#f3f4f6' }}>

        {/* ── Receipt canvas area ── */}
        <div
          ref={receiptRef}
          style={{
            fontFamily:      "'Courier New', 'Monaco', monospace",
            width:           '400px',
            backgroundColor: '#ffffff',
            margin:          '0 auto',
            boxShadow:       '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header dengan border atas dan bawah */}
          <div style={{ 
            padding: '20px 20px 10px 20px',
            borderTop: '2px solid #000',
            borderBottom: '1px solid #ddd'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', margin: '0 0 4px', letterSpacing: '1px' }}>
                MITHA LAUNDRY
              </h1>
              <p style={{ fontSize: '10px', color: '#666', margin: '0 0 4px', textTransform: 'uppercase' }}>
                123 Anywhere St, Any City, ST 12345
              </p>
              <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>
                +123-456-7890 | mithalaundry@gmail.com
              </p>
            </div>
          </div>

          {/* Billed to section */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #ddd' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', color: '#000', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              TAGIHAN KEPADA:
            </h2>
            <div style={{ fontSize: '11px', color: '#333', lineHeight: '1.5' }}>
              <div>{customer.name || 'Imani Olowe'}</div>
              <div>{customer.phone || '+123-456-7890'}</div>
            </div>
          </div>

          {/* Table Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 0.5fr 1fr',
            padding: '12px 20px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #ddd',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>DESKRIPSI</div>
            <div style={{ textAlign: 'center' }}>QTY</div>
            <div style={{ textAlign: 'right' }}>TOTAL</div>
          </div>

          {/* Table Rows - 3 kolom */}
          <div style={{ padding: '0 20px' }}>
            {order.services?.map((service: any, index: number) => {
              const quantity = service.quantity || 1
              
              return (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 0.5fr 1fr',
                  padding: '10px 0',
                  borderBottom: index < order.services.length - 1 ? '1px solid #f0f0f0' : 'none',
                  fontSize: '11px',
                  color: '#333'
                }}>
                  <div>{service.name}</div>
                  <div style={{ textAlign: 'center' }}>{quantity}</div>
                  <div style={{ textAlign: 'right', fontWeight: '500' }}>{formatRupiah(service.subtotal)}</div>
                </div>
              )
            })}
          </div>

          {/* Totals Section */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #ddd', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
              <div style={{ width: '140px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span>Subtotal:</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
              <div style={{ width: '140px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span>Pajak (0%):</span>
                <span>Rp0</span>
              </div>
            </div>
            {order.isExpress && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                <div style={{ width: '140px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span>Biaya Express:</span>
                  <span>{formatRupiah(order.expressFee || 0)}</span>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #ddd' }}>
              <div style={{ width: '140px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
                <span>TOTAL:</span>
                <span>{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#999', marginBottom: '4px' }}>
              MITHA LAUNDRY
            </div>
            <div style={{ fontSize: '9px', color: '#999' }}>
              123 Anywhere St, Any City, ST 12345
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', padding: '16px 0 0', maxWidth: '400px', margin: '0 auto' }}>
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
            Download PNG
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
            Print
          </button>
        </div>
      </div>
    )
  }
)

ReceiptGenerator.displayName = 'ReceiptGenerator'
export default ReceiptGenerator