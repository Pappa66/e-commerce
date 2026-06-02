import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DollarSign, ShoppingCart, Package, TrendingUp, AlertCircle } from "lucide-react"

export const metadata = { title: "Dashboard Admin" }

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  const [{ count: totalProducts }, { count: totalOrders }, { data: recentOrders }, { data: pendingOrders }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*, items:order_items(*)").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("*").eq("status", "pending"),
  ])

  const totalRevenue = recentOrders?.reduce((sum, o) => sum + (o as any).total_amount, 0) || 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Total Produk" value={totalProducts?.toString() || "0"} color="bg-blue-500" />
        <StatCard icon={ShoppingCart} label="Total Pesanan" value={totalOrders?.toString() || "0"} color="bg-emerald-500" />
        <StatCard icon={DollarSign} label="Pendapatan" value={`Rp${(totalRevenue / 1000).toFixed(0)}k`} color="bg-purple-500" />
        <StatCard icon={AlertCircle} label="Pending" value={pendingOrders?.length.toString() || "0"} color="bg-amber-500" />
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold mb-4">Pesanan Terbaru</h2>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">#{order.order_number}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        order.status === "delivered" ? "bg-green-100 text-green-700" :
                        order.status === "cancelled" ? "bg-red-100 text-red-700" :
                        order.status === "shipped" ? "bg-purple-100 text-purple-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{order.status}</span>
                    </td>
                    <td className="py-3">Rp{(order as any).total_amount?.toLocaleString("id-ID")}</td>
                    <td className="py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Belum ada pesanan</p>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 flex items-center gap-4">
      <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}
