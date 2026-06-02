"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createProduct, updateProduct } from "@/lib/actions"
import { toast } from "sonner"
import { useState } from "react"
import type { Category, Product } from "@/types/database"
import { calculateFinalPrice, formatPrice } from "@/lib/utils"

interface Props {
  product?: Product
  categories: Category[]
}

export default function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const isEditing = !!product
  const [basePrice, setBasePrice] = useState(product?.base_price?.toString() || "")
  const [profitMargin, setProfitMargin] = useState(product?.profit_margin?.toString() || "0")
  const [taxRate, setTaxRate] = useState(product?.tax_rate?.toString() || "11")

  const basePriceNum = parseFloat(basePrice) || 0
  const profitMarginNum = parseFloat(profitMargin) || 0
  const taxRateNum = parseFloat(taxRate) || 11
  const previewPrice = calculateFinalPrice(basePriceNum, profitMarginNum, taxRateNum)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = isEditing
      ? await updateProduct(product!.id, formData)
      : await createProduct(formData)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(isEditing ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan")
    router.push("/admin/products")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">Informasi Produk</h2>

        <div>
          <Label htmlFor="name">Nama Produk *</Label>
          <Input id="name" name="name" defaultValue={product?.name} required placeholder="Nama produk" />
        </div>

        <div>
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea id="description" name="description" defaultValue={product?.description || ""} rows={4} placeholder="Deskripsi produk..." />
        </div>

        <div>
          <Label htmlFor="category_id">Kategori</Label>
          <Select name="category_id" defaultValue={product?.category_id || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">Harga & Stok</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="base_price">Harga Dasar *</Label>
            <Input id="base_price" name="base_price" type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} required placeholder="0" min="0" />
          </div>
          <div>
            <Label htmlFor="profit_margin">Margin (%)</Label>
            <Input id="profit_margin" name="profit_margin" type="number" value={profitMargin} onChange={e => setProfitMargin(e.target.value)} placeholder="0" min="0" step="0.1" />
          </div>
          <div>
            <Label htmlFor="tax_rate">PPN (%)</Label>
            <Input id="tax_rate" name="tax_rate" type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} placeholder="11" min="0" step="0.1" />
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-3 text-sm">
          <span className="font-medium">Harga Final: </span>
          <span className="text-emerald-700 font-bold">{formatPrice(previewPrice)}</span>
          <span className="text-gray-500 ml-2">
            (Dasar: {formatPrice(basePriceNum)} + Margin {profitMarginNum}% + PPN {taxRateNum}%)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock">Stok</Label>
            <Input id="stock" name="stock" type="number" defaultValue={product?.stock || 0} placeholder="0" min="0" />
          </div>
          <div>
            <Label htmlFor="weight_grams">Berat (gram)</Label>
            <Input id="weight_grams" name="weight_grams" type="number" defaultValue={product?.weight_grams || 0} placeholder="0" min="0" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">SEO (Search Engine Optimization)</h2>
        <p className="text-xs text-gray-400">Optimasi agar produk mudah ditemukan di Google</p>

        <div>
          <Label htmlFor="meta_title">Meta Title</Label>
          <Input id="meta_title" name="meta_title" defaultValue={product?.meta_title || ""} placeholder="Judul untuk SEO (max 60 karakter)" maxLength={60} />
        </div>

        <div>
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea id="meta_description" name="meta_description" defaultValue={product?.meta_description || ""} rows={2} placeholder="Deskripsi untuk hasil pencarian (max 160 karakter)" maxLength={160} />
        </div>

        <div>
          <Label htmlFor="meta_keywords">Keywords</Label>
          <Input id="meta_keywords" name="meta_keywords" defaultValue={product?.meta_keywords || ""} placeholder="hijab, fashion, muslim, ..." />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 space-y-4">
        <h2 className="font-semibold">Pengaturan Lainnya</h2>

        <div className="flex items-center gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured} className="rounded" />
            <span className="text-sm">Produk Unggulan</span>
          </label>

          {isEditing && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_active" defaultChecked={product?.is_active} className="rounded" />
              <span className="text-sm">Aktif</span>
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          {isEditing ? "Simpan Perubahan" : "Tambah Produk"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
      </div>
    </form>
  )
}
