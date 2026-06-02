'use client'

import CartDrawer from "@/components/public/CartDrawer"
import { ShoppingBag } from "lucide-react"

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="h-6 w-6 text-emerald-600" />
        <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
      </div>
      <CartDrawer />
    </div>
  )
}
