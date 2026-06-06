'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Review, Profile } from '@/types/database'

type ReviewWithProfile = Review & { profile: Pick<Profile, 'full_name' | 'avatar_url'> }

export default function ReviewsSection({ productId }: { productId: string }) {
  const router = useRouter()
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userReviewId, setUserReviewId] = useState<string | null>(null)

  useEffect(() => {
    loadReviews()
    checkUser()
  }, [])

  const loadReviews = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profile:profiles(full_name, avatar_url)')
      .eq('product_id', productId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (!error) setReviews((data || []) as ReviewWithProfile[])
  }

  const checkUser = async () => {
    const supabase = createClient()
    const { data: { user: u } } = await supabase.auth.getUser()
    setUser(u)
    if (!u) return
    const { data: existing } = await supabase
      .from('reviews')
      .select('id, rating, comment')
      .eq('product_id', productId)
      .eq('user_id', u.id)
      .maybeSingle()
    if (existing) {
      setUserReviewId(existing.id)
      setRating(existing.rating)
      setComment(existing.comment || '')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('reviews').upsert({
      id: userReviewId || undefined,
      product_id: productId,
      user_id: user.id,
      rating,
      comment: comment || null,
    }).select().single()
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Ulasan berhasil disimpan')
    setUserReviewId(null)
    setRating(5)
    setComment('')
    loadReviews()
    router.refresh()
  }

  const handleDelete = async (reviewId: string) => {
    const supabase = createClient()
    await supabase.from('reviews').delete().eq('id', reviewId)
    toast.success('Ulasan dihapus')
    loadReviews()
  }

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-xl font-bold mb-6">Ulasan Produk</h2>

      {reviews.length > 0 && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-800">{avgRating.toFixed(1)}</div>
          <div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={cn('h-4 w-4', s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
              ))}
            </div>
            <p className="text-sm text-gray-500">{reviews.length} ulasan</p>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {reviews.length === 0 && (
          <p className="text-gray-400 text-sm">Belum ada ulasan untuk produk ini.</p>
        )}
        {reviews.map(review => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700">
                  {(review.profile?.full_name || 'U')[0].toUpperCase()}
                </div>
                <span className="font-medium text-sm">{review.profile?.full_name || 'User'}</span>
              </div>
              <div className="flex items-center gap-1">
                {user && review.user_id === user.id && (
                  <button onClick={() => handleDelete(review.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={cn('h-3.5 w-3.5', s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
                  ))}
                </div>
              </div>
            </div>
            {review.comment && (
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('id-ID')}</p>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6 bg-gray-50">
        <h3 className="font-semibold mb-4">
          {userReviewId ? 'Edit Ulasan' : 'Tulis Ulasan'}
        </h3>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)}>
                    <Star className={cn('h-6 w-6 cursor-pointer', s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Komentar (opsional)</label>
              <Textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Bagikan pengalaman Anda dengan produk ini..."
                rows={3}
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
              {loading ? 'Menyimpan...' : 'Kirim Ulasan'}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-gray-500">
            <button onClick={() => router.push('/login')} className="text-emerald-600 hover:underline">Masuk</button> untuk memberikan ulasan
          </p>
        )}
      </div>
    </div>
  )
}
