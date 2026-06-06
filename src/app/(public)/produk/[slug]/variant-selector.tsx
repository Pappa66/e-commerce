'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { toggleWishlist } from "@/lib/actions"
import type { Product, ProductVariant } from "@/types/database"

interface Props {
  variants: ProductVariant[]
  basePrice: number
  product: Product
}

export default function VariantSelector({ variants, basePrice, product }: Props) {
  const [selectedId, setSelectedId] = useState<string>("")
  const [adding, setAdding] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const addItem = useCart(s => s.addItem)
  const router = useRouter()

  const selected = variants.find(v => v.id === selectedId)
  const price = selected ? basePrice + selected.price_adjustment : basePrice
  const inStock = selected ? selected.stock > 0 : variants.some(v => v.stock > 0)

  const sizes = [...new Set(variants.filter(v => v.size).map(v => v.size!))]
  const colors = [...new Set(variants.filter(v => v.color).map(v => v.color!))]
  const hasSize = sizes.length > 0
  const hasColor = colors.length > 0

  const availableSizes = (size: string) => variants.filter(v => v.size === size)
  const availableColors = (color: string) => variants.filter(v => v.color === color)
  const findVariant = (size: string, color: string) => {
    return variants.find(v => v.size === size && v.color === color)
  }

  const selectedSize = selected?.size || ""
  const selectedColor = selected?.color || ""

  const selectBySize = (size: string) => {
    if (hasColor && selectedColor) {
      const v = findVariant(size, selectedColor)
      if (v) setSelectedId(v.id)
    } else {
      const v = variants.find(v => v.size === size)
      if (v) setSelectedId(v.id)
    }
  }

  const selectByColor = (color: string) => {
    if (hasSize && selectedSize) {
      const v = findVariant(selectedSize, color)
      if (v) setSelectedId(v.id)
    } else {
      const v = variants.find(v => v.color === color)
      if (v) setSelectedId(v.id)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedId) { toast.error("Pilih varian terlebih dahulu"); return }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error("Silakan login terlebih dahulu"); router.push("/login"); return }

    setAdding(true)
    const variant = selected!
    const productWithAdjustedPrice = { ...product, final_price: basePrice + variant.price_adjustment, stock: variant.stock }
    await addItem(productWithAdjustedPrice)
    toast.success(`${product.name} (${variant.name}) ditambahkan ke keranjang`)
    setAdding(false)
  }

  const handleWishlist = async () => {
    setWishlistLoading(true)
    await toggleWishlist(product.id)
    toast.success("Berhasil diperbarui")
    setWishlistLoading(false)
  }

  const getStockLabel = () => {
    if (!selected) return `${variants.reduce((s, v) => s + v.stock, 0)} tersedia`
    return selected.stock > 0 ? `${selected.stock} tersedia` : "Stok Habis"
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Price with variant */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-emerald-600">{formatPrice(price)}</span>
        {price !== basePrice && (
          <span className="text-sm text-gray-400 line-through">{formatPrice(basePrice)}</span>
        )}
      </div>

      {/* Sizes */}
      {hasSize && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Ukuran: <span className="text-gray-500">{selectedSize || "Pilih"}</span></p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const avail = availableSizes(size)
              const totalStock = avail.reduce((s, v) => s + v.stock, 0)
              const isSelected = selectedSize === size
              return (
                <button
                  key={size}
                  type="button"
                  disabled={totalStock === 0}
                  onClick={() => selectBySize(size)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    isSelected ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "hover:border-gray-400",
                    totalStock === 0 && "opacity-40 line-through cursor-not-allowed"
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Colors */}
      {hasColor && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Warna: <span className="text-gray-500">{selectedColor || "Pilih"}</span></p>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => {
              const avail = availableColors(color)
              const totalStock = avail.reduce((s, v) => s + v.stock, 0)
              const isSelected = selectedColor === color
              return (
                <button
                  key={color}
                  type="button"
                  disabled={totalStock === 0}
                  onClick={() => selectByColor(color)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    isSelected ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "hover:border-gray-400",
                    totalStock === 0 && "opacity-40 line-through cursor-not-allowed"
                  )}
                >
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Fallback: dropdown for mixed/unnamed variants */}
      {!hasSize && !hasColor && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Varian:</p>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Pilih varian</option>
            {variants.map(v => (
              <option key={v.id} value={v.id} disabled={v.stock <= 0}>
                {v.name} {v.stock > 0 ? `(${formatPrice(basePrice + v.price_adjustment)})` : "- Habis"}
              </option>
            ))}
          </select>
        </div>
      )}

      <p className="text-sm text-gray-500">{getStockLabel()}</p>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-base"
          disabled={!selectedId || !inStock || adding}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {!selectedId ? "Pilih varian" : adding ? "Menambahkan..." : "Tambah ke Keranjang"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleWishlist}
          disabled={wishlistLoading}
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
