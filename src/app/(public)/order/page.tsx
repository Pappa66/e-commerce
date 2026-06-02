import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Package, ChevronRight } from "lucide-react"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS, ITEMS_PER_PAGE } from "@/lib/constants"
import { formatPrice } from "@/lib/utils"
import Pagination from "@/components/ui/pagination"
import type { Order } from "@/types/database"

export const metadata = { title: "Pesanan Saya" }

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function OrderListPage({ searchParams }: Props) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const page = parseInt((await searchParams).page || '1', 10)

  if (!user) redirect("/login")

  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data: orders, count } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-6 w-6 text-emerald-600" />
        <h1 className="text-2xl font-bold">Pesanan Saya ({count || 0})</h1>
      </div>

      {orders && orders.length > 0 ? (
        <>
          <div className="space-y-4">
            {(orders as Order[]).map(order => (
              <Link key={order.id} href={`/order/${order.id}`} className="block rounded-xl border bg-white p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium">#{order.order_number}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString("id-ID")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{PAYMENT_METHOD_LABELS[order.payment_method]}</span>
                  <span className="font-bold">{formatPrice(order.total_amount)}</span>
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/order"
          />
        </>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <Package className="h-12 w-12 mx-auto mb-3" />
          <p>Belum ada pesanan</p>
          <Link href="/search" className="text-emerald-600 text-sm hover:underline mt-2 inline-block">Mulai Belanja</Link>
        </div>
      )}
    </div>
  )
}
