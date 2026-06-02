import { ProductGridSkeleton } from '@/components/ui/ProductSkeleton'

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-6" />
      <ProductGridSkeleton count={8} />
    </div>
  )
}
