import { cache } from 'react'
import { createServerSupabaseClient } from './supabase/server'

export const CACHE_TAGS = {
  products: 'products',
  product: (slug: string) => `product:${slug}`,
  categories: 'categories',
  banners: 'banners',
  orders: 'orders',
  order: (id: string) => `order:${id}`,
  featured: 'featured-products',
}

export const REVALIDATION_TIMES = {
  products: 60,
  product: 120,
  categories: 300,
  banners: 300,
  orders: 30,
}

export const getCachedProducts = cache(async (options?: {
  categoryId?: string
  isFeatured?: boolean
  searchQuery?: string
  page?: number
  limit?: number
  sort?: string
}) => {
  const supabase = await createServerSupabaseClient()
  const { categoryId, isFeatured, searchQuery, page = 1, limit = 12, sort } = options || {}
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('is_active', true)

  if (categoryId) query = query.eq('category_id', categoryId)
  if (isFeatured) query = query.eq('is_featured', true)
  if (searchQuery) query = query.ilike('name', `%${searchQuery}%`)

  if (sort === 'price_asc') query = query.order('final_price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('final_price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(from, to)

  const { data, count } = await query
  return {
    products: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
})

export const getCachedProduct = cache(async (slug: string) => {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single()
  return data
})

export const getCachedCategories = cache(async () => {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data || []
})

export const getCachedBanners = cache(async () => {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data || []
})

export const getCachedOrders = cache(async (userId?: string, page = 1, limit = 10) => {
  const supabase = await createServerSupabaseClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('orders')
    .select('*, items:order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (userId) query = query.eq('user_id', userId)

  const { data, count } = await query
  return {
    orders: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
})
