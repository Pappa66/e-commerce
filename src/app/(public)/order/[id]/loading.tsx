import { Skeleton } from '@/components/ui/skeleton'

export default function OrderDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="rounded-xl border p-6 bg-white space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}
