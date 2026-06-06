'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, getImageUrl, cn } from '@/lib/utils'
import { useCart } from '@/lib/hooks/use-cart'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Product } from '@/types/database'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCart(s => s.addItem)
  const router = useRouter()
  const [wishlisted, setWishlisted] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('wishlists').select('id').eq('user_id', user.id).eq('product_id', product.id).maybeSingle()
      setWishlisted(!!data)
    }
    check()
  }, [product.id])

  const handleAddToCart = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }
    addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang`)
  }

  const handleToggleWishlist = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }
    const { data: existing } = await supabase.from('wishlists').select('id').eq('user_id', user.id).eq('product_id', product.id).maybeSingle()
    if (existing) {
      await supabase.from('wishlists').delete().eq('id', existing.id)
      setWishlisted(false)
      toast.success('Dihapus dari favorit')
    } else {
      await supabase.from('wishlists').insert({ user_id: user.id, product_id: product.id })
      setWishlisted(true)
      toast.success('Ditambahkan ke favorit')
    }
  }

  const discountPercent = product.profit_margin > 0
    ? Math.round((1 - product.final_price / product.base_price) * 100)
    : 0

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:shadow-xl hover:-translate-y-1 card-hover">
      <Link href={`/produk/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={getImageUrl(product.images?.[0] || null)}
          alt={product.name}
          fill
          className={cn("object-cover transition-all duration-500 group-hover:scale-110", imgLoaded ? "opacity-100" : "opacity-0")}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onLoad={() => setImgLoaded(true)}
        />
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">Stok Habis</span>
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); handleToggleWishlist() }}
          className={cn(
            "absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
            wishlisted ? "bg-rose-50 shadow-sm" : "bg-white/80 hover:bg-white shadow-sm"
          )}
        >
          <Heart className={cn('h-4.5 w-4.5 transition-colors', wishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-500 hover:text-rose-400')} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/produk/${product.slug}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-emerald-600">
            {formatPrice(product.final_price)}
          </span>
          {product.profit_margin > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-[10px] text-amber-600 mt-1 font-medium">Sisa {product.stock} lagi!</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
          <Button
            size="sm"
            className="bg-brand-gradient hover:opacity-90 text-white shadow-sm text-xs h-8 px-3"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            Keranjang
          </Button>
          <span className="text-[11px] text-gray-400 font-medium">
            {product.stock > 0 ? `${product.stock} stok` : 'Habis'}
          </span>
        </div>
      </div>
    </div>
  )
}
