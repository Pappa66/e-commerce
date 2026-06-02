import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import React from 'react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, sizes, ...rest } = props
    return React.createElement('img', { ...rest, 'data-testid': 'next-image' })
  },
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: Record<string, unknown>) =>
    React.createElement('a', { href, ...props }, children as React.ReactNode),
}))
