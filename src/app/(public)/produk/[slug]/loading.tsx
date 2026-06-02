import { ProductDetailSkeleton } from '@/components/ui/ProductSkeleton'

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetailSkeleton />
    </div>
  )
}
