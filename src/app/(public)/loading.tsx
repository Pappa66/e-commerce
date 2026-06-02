import { BannerSkeleton, ProductGridSkeleton } from '@/components/ui/ProductSkeleton'

export default function HomeLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <BannerSkeleton />
      <div className="mt-10">
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  )
}
