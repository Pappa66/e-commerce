"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCoupon, updateCoupon } from "@/lib/actions"
import { toast } from "sonner"
import { useState } from "react"
import type { Coupon } from "@/types/database"

interface Props {
  coupon?: Coupon
}

export default function CouponForm({ coupon }: Props) {
  const router = useRouter()
  const isEditing = !!coupon
  const [type, setType] = useState<string>(coupon?.type || "percentage")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = isEditing
      ? await updateCoupon(coupon!.id, formData)
      : await createCoupon(formData)

    if (result.error) { toast.error(result.error); return }
    toast.success(isEditing ? "Kupon berhasil diperbarui" : "Kupon berhasil ditambahkan")
    router.push("/admin/coupons")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      <div className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">Informasi Kupon</h2>

        <div>
          <Label>Kode Kupon *</Label>
          <Input name="code" defaultValue={coupon?.code} required placeholder="CONTOH50" className="uppercase font-mono" maxLength={30} />
        </div>

        <div>
          <Label>Tipe Diskon *</Label>
          <Select name="type" value={type} onValueChange={(v: any) => v && setType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Persentase (%)</SelectItem>
              <SelectItem value="fixed">Nominal Tetap (Rp)</SelectItem>
              <SelectItem value="free_shipping">Gratis Ongkir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type !== "free_shipping" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nilai *</Label>
              <Input name="value" type="number" defaultValue={coupon?.value || 0} required min="0" placeholder={type === "percentage" ? "10" : "50000"} />
            </div>
            {type === "percentage" && (
              <div>
                <Label>Maks. Diskon (Rp)</Label>
                <Input name="max_discount" type="number" defaultValue={coupon?.max_discount || ""} min="0" placeholder="100000" />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Min. Belanja (Rp)</Label>
            <Input name="min_purchase" type="number" defaultValue={coupon?.min_purchase || 0} min="0" placeholder="0" />
          </div>
          <div>
            <Label>Batas Pemakaian</Label>
            <Input name="usage_limit" type="number" defaultValue={coupon?.usage_limit || 0} min="0" placeholder="0 = tak terbatas" />
          </div>
        </div>

        <div>
          <Label>Berlaku Sampai</Label>
          <Input name="expires_at" type="date" defaultValue={coupon?.expires_at ? coupon.expires_at.slice(0, 10) : ""} />
        </div>

        {isEditing && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_active" defaultChecked={coupon?.is_active} className="rounded" />
            <span className="text-sm">Aktif</span>
          </label>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          {isEditing ? "Simpan Perubahan" : "Tambah Kupon"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
      </div>
    </form>
  )
}
