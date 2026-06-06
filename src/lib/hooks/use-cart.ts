'use client'

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { CartItem, Product } from '@/types/database'

interface CartState {
  items: CartItem[]
  isLoading: boolean
  fetchCart: () => Promise<void>
  addItem: (product: Product, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  getTotal: () => number
  getItemCount: () => number
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: cart } = await supabase
      .from('carts')
      .select('*, items:cart_items(*, product:products(*))')
      .eq('user_id', user.id)
      .maybeSingle()

    if (cart) {
      set({ items: (cart as any).items || [] })
    }
  },

  addItem: async (product: Product, quantity = 1) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let cartId: string
    const { data: existingCart } = await supabase.from('carts').select('id').eq('user_id', user.id).maybeSingle()
    if (existingCart) {
      cartId = existingCart.id
    } else {
      const { data: newCart } = await supabase.from('carts').insert({ user_id: user.id }).select().single()
      cartId = newCart!.id
    }

    const existingItem = get().items.find(i => i.product_id === product.id)
    if (existingItem) {
      await supabase.from('cart_items').update({ quantity: existingItem.quantity + quantity }).eq('id', existingItem.id)
    } else {
      const { data: newItem } = await supabase.from('cart_items').insert({ cart_id: cartId, product_id: product.id, quantity }).select('*, product:products(*)').single()
      if (newItem) {
        set(state => ({ items: [...state.items, newItem as any] }))
      }
    }
    get().fetchCart()
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const supabase = createClient()
    if (quantity <= 0) {
      await get().removeItem(itemId)
      return
    }
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId)
    set(state => ({
      items: state.items.map(i => i.id === itemId ? { ...i, quantity } : i),
    }))
  },

  removeItem: async (itemId: string) => {
    const supabase = createClient()
    await supabase.from('cart_items').delete().eq('id', itemId)
    set(state => ({ items: state.items.filter(i => i.id !== itemId) }))
  },

  clearCart: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).maybeSingle()
      if (cart) await supabase.from('cart_items').delete().eq('cart_id', cart.id)
    }
    set({ items: [] })
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + (item.product?.final_price || 0) * item.quantity, 0)
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
