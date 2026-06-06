import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteCoupon } from "@/lib/actions"
import { formatPrice } from "@/lib/utils"
import type { Coupon } from "@/types/database"

export const metadata = { title: "Kupon - Admin" }

export default async function AdminCouponsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: coupons } = await supabase.from("coupons").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kupon / Voucher ({coupons?.length || 0})</h1>
        <Link href="/admin/coupons/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" /> Tambah Kupon
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-4 font-medium">Kode</th>
                <th className="p-4 font-medium">Tipe</th>
                <th className="p-4 font-medium">Nilai</th>
                <th className="p-4 font-medium">Min Belanja</th>
                <th className="p-4 font-medium">Pemakaian</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Berlaku</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(coupons as Coupon[])?.map(coupon => (
                <tr key={coupon.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-mono font-bold">{coupon.code}</td>
                  <td className="p-4 capitalize">{coupon.type === "percentage" ? "%" : coupon.type === "fixed" ? "Rp" : "Gratis Ongkir"}</td>
                  <td className="p-4">
                    {coupon.type === "percentage" ? `${coupon.value}%` : formatPrice(coupon.value)}
                    {coupon.max_discount && coupon.type === "percentage" && <span className="text-xs text-gray-400"> (max {formatPrice(coupon.max_discount)})</span>}
                  </td>
                  <td className="p-4">{coupon.min_purchase > 0 ? formatPrice(coupon.min_purchase) : "-"}</td>
                  <td className="p-4">{coupon.used_count}/{coupon.usage_limit || "∞"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${coupon.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {coupon.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString("id-ID") : "Tidak ada batas"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/coupons/${coupon.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                      </Link>
                      <form action={deleteCoupon.bind(null, coupon.id)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!coupons || coupons.length === 0) && (
                <tr><td colSpan={8} className="p-8 text-center text-gray-400">Belum ada kupon</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
