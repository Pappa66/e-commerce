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
    <div className="min-h-[80vh] bg-gradient-to-b from-emerald-50/30 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl p-6 elevated-shadow mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Pesanan Saya</h1>
              <p className="text-sm text-gray-400">{count || 0} pesanan</p>
            </div>
          </div>
        </div>

        {orders && orders.length > 0 ? (
          <>
            <div className="space-y-3">
              {(orders as Order[]).map(order => (
                <Link key={order.id} href={`/order/${order.id}`} className="block bg-white rounded-2xl p-5 elevated-shadow hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">#{order.order_number}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString("id-ID")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t pt-3">
                    <span className="text-gray-500">{PAYMENT_METHOD_LABELS[order.payment_method]}</span>
                    <span className="font-bold text-emerald-600">{formatPrice(order.total_amount)}</span>
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
          <div className="bg-white rounded-2xl p-12 elevated-shadow text-center">
            <Package className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Belum ada pesanan</p>
            <Link href="/search" className="text-emerald-600 text-sm font-medium hover:underline mt-3 inline-block">Mulai Belanja</Link>
          </div>
        )}
      </div>
    </div>
  )
}
