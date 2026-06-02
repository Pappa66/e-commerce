import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateOrderStatus, updateShippingTracking } from "@/lib/actions"
import { formatPrice } from "@/lib/utils"
import Pagination from "@/components/ui/pagination"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS, ITEMS_PER_PAGE } from "@/lib/constants"
import type { Order } from "@/types/database"

export const metadata = { title: "Pesanan - Admin" }

interface Props {
  searchParams: Promise<{ page?: string; status?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const supabase = await createServerSupabaseClient()
  const { page: pageStr, status } = await searchParams
  const page = parseInt(pageStr || '1', 10)
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  let query = supabase
    .from("orders")
    .select("*, items:order_items(*), shipping_address:addresses(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (status) query = query.eq("status", status)

  const { data: orders, count } = await query
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pesanan ({count || 0})</h1>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
            <a
              key={s}
              href={`/admin/orders?${s === 'all' ? '' : `status=${s}`}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                (s === 'all' && !status) || status === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'Semua' : ORDER_STATUS_LABELS[s] || s}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Pembayaran</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Tanggal</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders && (orders as Order[]).map(order => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-medium">#{order.order_number}</p>
                    <p className="text-xs text-gray-400">{order.payment_method === "cod" ? "COD" : "Midtrans"}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs ${order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                      {order.payment_status === "paid" ? "Lunas" : "Belum Dibayar"}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(order.total_amount)}</td>
                  <td className="p-4 text-gray-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4">
                    <StatusActions order={order} />
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Belum ada pesanan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/orders"
        searchParams={status ? { status } as Record<string, string> : {}}
      />
    </div>
  )
}

function StatusActions({ order }: { order: Order }) {
  const nextStatus = order.status === "pending" ? "confirmed"
    : order.status === "confirmed" ? "processing"
    : order.status === "processing" ? "shipped"
    : order.status === "shipped" ? "delivered"
    : null

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {nextStatus && (
        <form action={updateOrderStatus.bind(null, order.id, nextStatus)}>
          <Button type="submit" size="sm" variant="outline" className="text-xs h-7">
            {(order.status === "pending" && "Konfirmasi") ||
             (order.status === "confirmed" && "Proses") ||
             (order.status === "processing" && "Kirim") ||
             (order.status === "shipped" && "Selesai")}
          </Button>
        </form>
      )}
      {order.status !== "cancelled" && order.status !== "delivered" && (
        <form action={updateOrderStatus.bind(null, order.id, "cancelled")}>
          <Button type="submit" size="sm" variant="outline" className="text-xs h-7 text-red-500 border-red-200 hover:bg-red-50">
            Batal
          </Button>
        </form>
      )}
      {order.status === "shipped" && !order.shipping_tracking_number && (
        <ShippingForm orderId={order.id} />
      )}
    </div>
  )
}

function ShippingForm({ orderId }: { orderId: string }) {
  return (
    <form action={async (formData: FormData) => {
      "use server"
      await updateShippingTracking(
        orderId,
        formData.get("courier") as string,
        formData.get("service") as string,
        formData.get("tracking") as string,
      )
    }} className="flex items-center gap-1">
      <Input name="courier" placeholder="Kurir" className="h-7 w-14 text-xs" required />
      <Input name="service" placeholder="Layan" className="h-7 w-14 text-xs" required />
      <Input name="tracking" placeholder="Resi" className="h-7 w-20 text-xs" required />
      <Button type="submit" size="sm" className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700">Set</Button>
    </form>
  )
}
