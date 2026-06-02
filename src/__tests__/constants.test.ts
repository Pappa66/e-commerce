import { describe, it, expect } from 'vitest'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_METHOD_LABELS,
  INDONESIAN_PROVINCES,
  ITEMS_PER_PAGE,
  DEFAULT_TAX_RATE,
  APP_NAME,
} from '@/lib/constants'

describe('Constants', () => {
  it('APP_NAME is set', () => {
    expect(APP_NAME).toBe('D2C Pro')
  })

  it('DEFAULT_TAX_RATE is 11 (PPN)', () => {
    expect(DEFAULT_TAX_RATE).toBe(11)
  })

  it('ITEMS_PER_PAGE is a positive number', () => {
    expect(ITEMS_PER_PAGE).toBeGreaterThan(0)
    expect(Number.isInteger(ITEMS_PER_PAGE)).toBe(true)
  })

  it('ORDER_STATUS_LABELS has all statuses', () => {
    expect(ORDER_STATUS_LABELS).toHaveProperty('pending')
    expect(ORDER_STATUS_LABELS).toHaveProperty('confirmed')
    expect(ORDER_STATUS_LABELS).toHaveProperty('processing')
    expect(ORDER_STATUS_LABELS).toHaveProperty('shipped')
    expect(ORDER_STATUS_LABELS).toHaveProperty('delivered')
    expect(ORDER_STATUS_LABELS).toHaveProperty('cancelled')
    expect(ORDER_STATUS_LABELS).toHaveProperty('returned')
  })

  it('ORDER_STATUS_COLORS has all statuses', () => {
    expect(Object.keys(ORDER_STATUS_COLORS)).toEqual(Object.keys(ORDER_STATUS_LABELS))
  })

  it('PAYMENT_METHOD_LABELS has COD', () => {
    expect(PAYMENT_METHOD_LABELS).toHaveProperty('cod')
    expect(PAYMENT_METHOD_LABELS.cod).toContain('COD')
  })

  it('INDONESIAN_PROVINCES includes major provinces', () => {
    expect(INDONESIAN_PROVINCES).toContain('DKI Jakarta')
    expect(INDONESIAN_PROVINCES).toContain('Jawa Barat')
    expect(INDONESIAN_PROVINCES).toContain('Jawa Timur')
    expect(INDONESIAN_PROVINCES.length).toBeGreaterThan(30)
  })
})
