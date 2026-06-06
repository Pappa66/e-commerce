'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ProductCard from '@/components/public/ProductCard'
import type { Product } from '@/types/database'

export default function WishlistPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('wishlists')
        .select('*, product:products(*, category:categories(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setProducts((data || []).map((w: any) => w.product).filter(Boolean))
      setLoading(false)
    }
    fetch()
  }, [router])

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-6 w-6 text-red-500" />
        <h1 className="text-2xl font-bold">Produk Favorit</h1>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <Heart className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg">Belum ada produk favorit</p>
          <p className="text-sm mt-1">Klik ikon hati pada produk untuk menambahkannya</p>
          <Link href="/search">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Jelajahi Produk
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
