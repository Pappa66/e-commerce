import { cache } from 'react'
import { createServerSupabaseClient } from './supabase/server'

type BatchLoader<T> = {
  load: (key: string) => Promise<T | null>
  loadMany: (keys: string[]) => Promise<(T | null)[]>
}

export function createSupabaseLoader<T extends { id: string }>(
  tableName: string,
  selectQuery: string = '*'
): BatchLoader<T> {
  const load = cache(async (key: string): Promise<T | null> => {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from(tableName)
      .select(selectQuery)
      .eq('id', key)
      .single()
    return data as T | null
  })

  const loadMany = cache(async (keys: string[]): Promise<(T | null)[]> => {
    if (keys.length === 0) return []
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from(tableName)
      .select(selectQuery)
      .in('id', keys)
    const map = new Map((data || []).map((item: any) => [item.id, item]))
    return keys.map(key => map.get(key) || null)
  })

  return { load, loadMany }
}

export const productLoader = createSupabaseLoader<any>('products', '*, category:categories(*)')
export const categoryLoader = createSupabaseLoader<any>('categories')
export const orderLoader = createSupabaseLoader<any>('orders', '*, items:order_items(*), shipping_address:addresses(*)')

export function createSlugLoader<T extends { slug: string }>(
  tableName: string,
  selectQuery: string = '*'
) {
  const loadBySlug = cache(async (slug: string): Promise<T | null> => {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from(tableName)
      .select(selectQuery)
      .eq('slug', slug)
      .single()
    return data as T | null
  })

  return { loadBySlug }
}

export const productSlugLoader = createSlugLoader<any>('products', '*, category:categories(*)')
