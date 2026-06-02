'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    return `${baseUrl}?${params.toString()}`
  }

  const pages: (number | string)[] = []
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <Link
        href={buildUrl(currentPage - 1)}
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          currentPage <= 1
            ? 'pointer-events-none text-gray-300'
            : 'text-gray-700 hover:bg-gray-100'
        )}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </Link>

      {pages.map((page, i) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-gray-400">...</span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              'flex items-center justify-center min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-emerald-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      )}

      <Link
        href={buildUrl(currentPage + 1)}
        className={cn(
          'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          currentPage >= totalPages
            ? 'pointer-events-none text-gray-300'
            : 'text-gray-700 hover:bg-gray-100'
        )}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
      >
        <span className="hidden sm:inline">Selanjutnya</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  )
}
