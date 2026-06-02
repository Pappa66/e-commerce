import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function BannerSkeleton() {
  return (
    <Skeleton className="w-full h-[300px] md:h-[450px] rounded-xl" />
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <Skeleton className="aspect-square rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function CartSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3 bg-white rounded-lg border p-3">
          <Skeleton className="h-20 w-20 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-7 w-7" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
