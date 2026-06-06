import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateFinalPrice(basePrice: number, profitMargin: number, taxRate: number): number {
  const withMargin = basePrice * (1 + profitMargin / 100)
  const withTax = withMargin * (1 + taxRate / 100)
  return Math.round(withTax)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const yy = date.getFullYear().toString().slice(-2)
  const mm = (date.getMonth() + 1).toString().padStart(2, '0')
  const dd = date.getDate().toString().padStart(2, '0')
  const random = crypto.randomUUID().substring(0, 6).toUpperCase()
  return `INV${yy}${mm}${dd}${random}`
}

export function getImageUrl(path: string | null): string {
  if (!path) return '/placeholder.svg'
  if (path.startsWith('http')) return path
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/${path}`
}
