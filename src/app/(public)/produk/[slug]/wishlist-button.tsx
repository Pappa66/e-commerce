'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function WishlistButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('wishlists').select('id').eq('user_id', user.id).eq('product_id', productId).maybeSingle()
      setWishlisted(!!data)
    }
    check()
  }, [productId])

  const handleToggle = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }
    const { data: existing } = await supabase.from('wishlists').select('id').eq('user_id', user.id).eq('product_id', productId).maybeSingle()
    if (existing) {
      await supabase.from('wishlists').delete().eq('id', existing.id)
      setWishlisted(false)
      toast.success('Dihapus dari favorit')
    } else {
      await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
      setWishlisted(true)
      toast.success('Ditambahkan ke favorit')
    }
  }

  return (
    <Button variant="outline" size="lg" onClick={handleToggle}>
      <Heart className={cn('h-5 w-5 mr-2', wishlisted ? 'fill-red-500 text-red-500' : '')} />
      {wishlisted ? 'Favorit' : 'Tambah ke Favorit'}
    </Button>
  )
}
