import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  isOrderStatus,
  validateCreateOrderPayload,
} from '../lib/orders/validation'

describe('order validation', () => {
  it('accepts a valid cash order payload', () => {
    const result = validateCreateOrderPayload({
      customerId: 'customer-1',
      services: [
        {
          name: 'Cuci dan Setrika',
          price: 5000,
          quantity: 2,
          subtotal: 10000,
        },
      ],
      payment: 'cash',
      itemCount: 8,
      deliveryDate: '2026-05-06',
      isExpress: true,
      subtotal: 10000,
      expressFee: 5000,
      total: 15000,
    })

    assert.equal(result.ok, true)

    if (result.ok) {
      assert.equal(result.data.payment, 'cash')
      assert.equal(result.data.total, 15000)
      assert.ok(result.data.deliveryDate instanceof Date)
    }
  })

  it('rejects invalid totals and payment methods', () => {
    const result = validateCreateOrderPayload({
      customerId: 'customer-1',
      services: [
        {
          name: 'Cuci dan Setrika',
          price: 5000,
          quantity: 2,
          subtotal: 10000,
        },
      ],
      payment: 'transfer',
      itemCount: 8,
      deliveryDate: '2026-05-06',
      isExpress: false,
      subtotal: 9000,
      expressFee: 0,
      total: 10000,
    })

    assert.equal(result.ok, false)

    if (!result.ok) {
      assert.ok(result.errors.includes('Metode pembayaran tidak valid.'))
      assert.ok(result.errors.includes('Subtotal tidak sesuai dengan rincian layanan.'))
    }
  })

  it('limits order status values to the operational workflow', () => {
    assert.equal(isOrderStatus('sorting'), true)
    assert.equal(isOrderStatus('cancelled'), true)
    assert.equal(isOrderStatus('lost'), false)
  })
})
