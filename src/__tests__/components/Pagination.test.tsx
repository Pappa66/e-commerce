import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Pagination from '@/components/ui/pagination'

describe('Pagination', () => {
  it('does not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} baseUrl="/search" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders page numbers', () => {
    render(
      <Pagination currentPage={1} totalPages={5} baseUrl="/search" />
    )
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders "Sebelumnya" and "Selanjutnya" navigation', () => {
    render(
      <Pagination currentPage={2} totalPages={5} baseUrl="/search" />
    )
    expect(screen.getByText('Sebelumnya')).toBeInTheDocument()
    expect(screen.getByText('Selanjutnya')).toBeInTheDocument()
  })

  it('disables "Sebelumnya" on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} baseUrl="/search" />
    )
    const prev = screen.getByText('Sebelumnya').closest('a')
    expect(prev).toHaveClass('pointer-events-none')
  })

  it('disables "Selanjutnya" on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} baseUrl="/search" />
    )
    const next = screen.getByText('Selanjutnya').closest('a')
    expect(next).toHaveClass('pointer-events-none')
  })

  it('highlights current page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} baseUrl="/search" />
    )
    const current = screen.getByText('3').closest('a')
    expect(current).toHaveClass('bg-emerald-600')
  })

  it('generates correct URLs with search params', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        baseUrl="/admin/products"
      />
    )
    const page2 = screen.getByText('2').closest('a')
    expect(page2).toHaveAttribute('href', '/admin/products?page=2')
  })

  it('shows ellipsis for large page counts', () => {
    render(
      <Pagination currentPage={5} totalPages={10} baseUrl="/search" />
    )
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThan(0)
  })
})
