'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { useCart } from '@/lib/hooks/use-cart'

export default function CartDrawer() {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">Keranjang belanja masih kosong</p>
        <Link href="/search">
          <Button variant="outline" className="mt-4">Mulai Belanja</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto px-1">
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-3 bg-white rounded-lg border p-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={getImageUrl(item.product?.images?.[0] || null)}
                  alt={item.product?.name || 'Product'}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.product?.name}</p>
                    {(item as any).variant?.name && <p className="text-xs text-gray-400 truncate">{(item as any).variant.name}</p>}
                  </div>
                  <button onClick={() => removeItem(item.id)} className="shrink-0 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm font-bold text-emerald-600">
                  {formatPrice(item.product?.final_price || 0)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total ({getItemCount()} item)</span>
          <span className="text-lg font-bold text-emerald-600">{formatPrice(getTotal())}</span>
        </div>
        <Link href="/checkout">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            Lanjut ke Checkout
          </Button>
        </Link>
      </div>
    </div>
  )
}
