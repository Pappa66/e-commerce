import { describe, it, expect } from 'vitest'
import { formatPrice, slugify, calculateFinalPrice, generateOrderNumber, cn } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats price in IDR correctly', () => {
    expect(formatPrice(10000)).toContain('10.000')
    expect(formatPrice(0)).toContain('0')
    expect(formatPrice(99999)).toContain('99.999')
  })

  it('handles large numbers', () => {
    const result = formatPrice(1000000)
    expect(result).toContain('1.000.000')
  })
})

describe('slugify', () => {
  it('converts text to URL-friendly slug', () => {
    expect(slugify('Hijab Kalisha Premium')).toBe('hijab-kalisha-premium')
    expect(slugify('Hello World!')).toBe('hello-world')
    expect(slugify('  Extra   Spaces  ')).toBe('extra-spaces')
  })

  it('handles special characters', () => {
    expect(slugify('Hijab & Gamis 2024!')).toBe('hijab-gamis-2024')
  })
})

describe('calculateFinalPrice', () => {
  it('calculates price with margin and tax', () => {
    const basePrice = 100000
    const margin = 20  // 20%
    const tax = 11     // 11% PPN
    const result = calculateFinalPrice(basePrice, margin, tax)

    // 100000 * 1.2 = 120000 * 1.11 = 133200
    expect(result).toBe(133200)
  })

  it('returns base price when margin and tax are 0', () => {
    expect(calculateFinalPrice(50000, 0, 0)).toBe(50000)
  })

  it('handles default tax rate of 11%', () => {
    const result = calculateFinalPrice(75000, 20, 11)
    // 75000 * 1.2 = 90000 * 1.11 = 99900
    expect(result).toBe(99900)
  })
})

describe('generateOrderNumber', () => {
  it('generates order number with correct format', () => {
    const orderNum = generateOrderNumber()
    expect(orderNum).toMatch(/^INV\d{6}[A-Z0-9]{6}$/)
  })

  it('generates unique numbers', () => {
    const num1 = generateOrderNumber()
    const num2 = generateOrderNumber()
    expect(num1).not.toBe(num2)
  })
})

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    expect(cn('px-4', false && 'hidden')).toBe('px-4')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })
})
