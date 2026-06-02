'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { useCart } from '@/lib/hooks/use-cart'
import type { Product } from '@/types/database'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCart(s => s.addItem)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-white transition-all hover:shadow-lg">
      <Link href={`/produk/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={getImageUrl(product.images?.[0] || null)}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1 rounded text-sm font-medium">Habis</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/produk/${product.slug}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-lg font-bold text-emerald-600">
            {formatPrice(product.final_price)}
          </span>
          {product.profit_margin > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {product.stock > 0 ? `${product.stock} tersedia` : 'Stok habis'}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={product.stock <= 0}
            onClick={() => addItem(product)}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
