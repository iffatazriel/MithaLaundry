import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  isOrderStatus,
  validateCreateOrderPayload,
  isPaymentMethod,
  isPaymentStatus,
} from '../lib/orders/validation'

describe('order validation', () => {
  describe('validateCreateOrderPayload', () => {
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
        assert.equal(result.data.isExpress, true)
      }
    })

    it('accepts a valid qris order payload', () => {
      const result = validateCreateOrderPayload({
        customerId: 'customer-2',
        services: [
          {
            name: 'Dry Cleaning',
            price: 15000,
            quantity: 1,
            subtotal: 15000,
          },
        ],
        payment: 'qris',
        itemCount: 3,
        deliveryDate: '2026-05-10',
        isExpress: false,
        subtotal: 15000,
        expressFee: 0,
        total: 15000,
      })

      assert.equal(result.ok, true)

      if (result.ok) {
        assert.equal(result.data.payment, 'qris')
        assert.equal(result.data.expressFee, 0)
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

    it('rejects missing customer id', () => {
      const result = validateCreateOrderPayload({
        customerId: '',
        services: [
          {
            name: 'Cuci',
            price: 5000,
            quantity: 1,
            subtotal: 5000,
          },
        ],
        payment: 'cash',
        itemCount: 5,
        deliveryDate: '2026-05-06',
        isExpress: false,
        subtotal: 5000,
        expressFee: 0,
        total: 5000,
      })

      assert.equal(result.ok, false)

      if (!result.ok) {
        assert.ok(result.errors.includes('Customer wajib dipilih.'))
      }
    })

    it('rejects empty services', () => {
      const result = validateCreateOrderPayload({
        customerId: 'customer-1',
        services: [],
        payment: 'cash',
        itemCount: 0,
        deliveryDate: '2026-05-06',
        isExpress: false,
        subtotal: 0,
        expressFee: 0,
        total: 0,
      })

      assert.equal(result.ok, false)

      if (!result.ok) {
        assert.ok(result.errors.includes('Minimal satu layanan valid wajib dipilih.'))
      }
    })

    it('rejects invalid delivery date', () => {
      const result = validateCreateOrderPayload({
        customerId: 'customer-1',
        services: [
          {
            name: 'Cuci',
            price: 5000,
            quantity: 1,
            subtotal: 5000,
          },
        ],
        payment: 'cash',
        itemCount: 5,
        deliveryDate: 'invalid-date',
        isExpress: false,
        subtotal: 5000,
        expressFee: 0,
        total: 5000,
      })

      assert.equal(result.ok, false)

      if (!result.ok) {
        assert.ok(result.errors.includes('Tanggal estimasi tidak valid.'))
      }
    })

    it('rejects negative amounts', () => {
      const result = validateCreateOrderPayload({
        customerId: 'customer-1',
        services: [
          {
            name: 'Cuci',
            price: -5000,
            quantity: 1,
            subtotal: -5000,
          },
        ],
        payment: 'cash',
        itemCount: 5,
        deliveryDate: '2026-05-06',
        isExpress: false,
        subtotal: -5000,
        expressFee: 0,
        total: -5000,
      })

      assert.equal(result.ok, false)

      if (!result.ok) {
        assert.ok(result.errors.length > 0)
      }
    })

    it('rejects mismatched total calculation', () => {
      const result = validateCreateOrderPayload({
        customerId: 'customer-1',
        services: [
          {
            name: 'Cuci',
            price: 5000,
            quantity: 2,
            subtotal: 10000,
          },
        ],
        payment: 'cash',
        itemCount: 5,
        deliveryDate: '2026-05-06',
        isExpress: true,
        subtotal: 10000,
        expressFee: 5000,
        total: 20000, // Should be 15000
      })

      assert.equal(result.ok, false)

      if (!result.ok) {
        assert.ok(result.errors.includes('Total tidak sesuai dengan subtotal dan biaya express.'))
      }
    })
  })

  describe('type guards', () => {
    it('validates order status values', () => {
      assert.equal(isOrderStatus('sorting'), true)
      assert.equal(isOrderStatus('washing'), true)
      assert.equal(isOrderStatus('ironing'), true)
      assert.equal(isOrderStatus('ready'), true)
      assert.equal(isOrderStatus('completed'), true)
      assert.equal(isOrderStatus('cancelled'), true)
      assert.equal(isOrderStatus('lost'), false)
      assert.equal(isOrderStatus('pending'), false)
    })

    it('validates payment methods', () => {
      assert.equal(isPaymentMethod('cash'), true)
      assert.equal(isPaymentMethod('qris'), true)
      assert.equal(isPaymentMethod('transfer'), false)
      assert.equal(isPaymentMethod('credit_card'), false)
    })

    it('validates payment statuses', () => {
      assert.equal(isPaymentStatus('unpaid'), true)
      assert.equal(isPaymentStatus('pending'), true)
      assert.equal(isPaymentStatus('paid'), true)
      assert.equal(isPaymentStatus('failed'), true)
      assert.equal(isPaymentStatus('expired'), true)
      assert.equal(isPaymentStatus('refunded'), false)
    })
  })

  describe('edge cases', () => {
    it('handles null and undefined values gracefully', () => {
      const result = validateCreateOrderPayload({
        customerId: null,
        services: undefined,
        payment: null,
        itemCount: null,
        deliveryDate: null,
        isExpress: undefined,
        subtotal: null,
        expressFee: null,
        total: null,
      })

      assert.equal(result.ok, false)
      assert.ok(result.errors.length > 0)
    })

    it('handles non-object payloads', () => {
      const result = validateCreateOrderPayload('not an object')
      assert.equal(result.ok, false)
    })

    it('handles very large numbers', () => {
      const result = validateCreateOrderPayload({
        customerId: 'customer-1',
        services: [
          {
            name: 'Premium Service',
            price: 999999999,
            quantity: 1,
            subtotal: 999999999,
          },
        ],
        payment: 'cash',
        itemCount: 1,
        deliveryDate: '2026-05-06',
        isExpress: false,
        subtotal: 999999999,
        expressFee: 0,
        total: 999999999,
      })

      assert.equal(result.ok, true)
    })

    it('handles decimal quantities', () => {
      const result = validateCreateOrderPayload({
        customerId: 'customer-1',
        services: [
          {
            name: 'Cuci',
            price: 5000,
            quantity: 2.5,
            subtotal: 12500,
          },
        ],
        payment: 'cash',
        itemCount: 5,
        deliveryDate: '2026-05-06',
        isExpress: false,
        subtotal: 12500,
        expressFee: 0,
        total: 12500,
      })

      assert.equal(result.ok, true)
    })
  })
})
