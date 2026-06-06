import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductCard from '@/components/public/ProductCard'
import { setMockUser } from '../setup'
import type { Product } from '@/types/database'

// Mock useCart
const mockAddItem = vi.fn()
vi.mock('@/lib/hooks/use-cart', () => ({
  useCart: (selector?: any) => {
    const state = { addItem: mockAddItem, items: [], fetchCart: vi.fn() }
    return selector ? selector(state) : state
  },
}))

const mockProduct: Product = {
  id: '1',
  name: 'Hijab Kalisha Premium',
  slug: 'hijab-kalisha-premium',
  description: 'Hijab premium bahan jersey',
  category_id: 'cat-1',
  base_price: 75000,
  profit_margin: 20,
  tax_rate: 11,
  final_price: 99900,
  stock: 50,
  weight_grams: 150,
  is_active: true,
  is_featured: true,
  images: ['https://example.com/image.jpg'],
  meta_title: null,
  meta_description: null,
  meta_keywords: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

describe('ProductCard', () => {
  beforeEach(() => {
    mockAddItem.mockReset()
    setMockUser({ id: 'user-1', email: 'test@test.com' })
  })

  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Hijab Kalisha Premium')).toBeInTheDocument()
    expect(screen.getByText(/99.900/)).toBeInTheDocument()
  })

  it('shows stock count', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('50 tersedia')).toBeInTheDocument()
  })

  it('shows "Habis" when stock is 0', () => {
    const outOfStock = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStock} />)
    expect(screen.getByText('Habis')).toBeInTheDocument()
  })

  it('calls addItem when add to cart button is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProductCard product={mockProduct} />)

    const buttons = container.querySelectorAll('button')
    const cartButton = Array.from(buttons).find(b => b.className.includes('inline-flex'))
    await user.click(cartButton!)

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct)
  })

  it('disables add to cart button when stock is 0', () => {
    const outOfStock = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStock} />)

    const buttons = screen.getAllByRole('button')
    const disabledButtons = buttons.filter(b => b.hasAttribute('disabled'))
    expect(disabledButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('renders product link', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByText('Hijab Kalisha Premium').closest('a')
    expect(link).toHaveAttribute('href', '/produk/hijab-kalisha-premium')
  })
})
