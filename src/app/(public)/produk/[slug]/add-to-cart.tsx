'use client'

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/hooks/use-cart"
import { useState } from "react"
import { toast } from "sonner"
import type { Product } from "@/types/database"

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart(s => s.addItem)
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    setLoading(true)
    await addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang`)
    setLoading(false)
  }

  return (
    <Button
      size="lg"
      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-base"
      disabled={product.stock <= 0 || loading}
      onClick={handleAdd}
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
    </Button>
  )
}
