import { CartSkeleton } from '@/components/ui/ProductSkeleton'

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <CartSkeleton />
    </div>
  )
}
