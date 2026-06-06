'use server'

import { createServerSupabaseClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify, calculateFinalPrice, generateOrderNumber } from './utils'
import type { Address, Wishlist, Review, Profile, FAQ } from '@/types/database'

// --- AUTH ---

export async function login(email: string, password: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { success: true }
}

export async function register(email: string, password: string, fullName: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) return { error: error.message }
  return { success: true }
}

export async function logout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}

// --- PRODUCTS (Admin) ---

export async function createProduct(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('category_id') as string
  const basePrice = parseFloat(formData.get('base_price') as string)
  const profitMargin = parseFloat(formData.get('profit_margin') as string || '0')
  const taxRate = parseFloat(formData.get('tax_rate') as string || '11')
  const stock = parseInt(formData.get('stock') as string || '0')
  const weight = parseInt(formData.get('weight_grams') as string || '0')
  const metaTitle = formData.get('meta_title') as string
  const metaDescription = formData.get('meta_description') as string
  const metaKeywords = formData.get('meta_keywords') as string
  const isFeatured = formData.get('is_featured') === 'on'

  const slug = slugify(name)
  const finalPrice = calculateFinalPrice(basePrice, profitMargin, taxRate)

  const { error } = await supabase.from('products').insert({
    name,
    slug,
    description,
    category_id: categoryId || null,
    base_price: basePrice,
    profit_margin: profitMargin,
    tax_rate: taxRate,
    final_price: finalPrice,
    stock,
    weight_grams: weight,
    is_featured: isFeatured,
    meta_title: metaTitle || null,
    meta_description: metaDescription || null,
    meta_keywords: metaKeywords || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('category_id') as string
  const basePrice = parseFloat(formData.get('base_price') as string)
  const profitMargin = parseFloat(formData.get('profit_margin') as string || '0')
  const taxRate = parseFloat(formData.get('tax_rate') as string || '11')
  const stock = parseInt(formData.get('stock') as string || '0')
  const weight = parseInt(formData.get('weight_grams') as string || '0')
  const metaTitle = formData.get('meta_title') as string
  const metaDescription = formData.get('meta_description') as string
  const metaKeywords = formData.get('meta_keywords') as string
  const isFeatured = formData.get('is_featured') === 'on'
  const isActive = formData.get('is_active') === 'on'

  const slug = slugify(name)
  const finalPrice = calculateFinalPrice(basePrice, profitMargin, taxRate)

  const { error } = await supabase.from('products').update({
    name,
    slug,
    description,
    category_id: categoryId || null,
    base_price: basePrice,
    profit_margin: profitMargin,
    tax_rate: taxRate,
    final_price: finalPrice,
    stock,
    weight_grams: weight,
    is_featured: isFeatured,
    is_active: isActive,
    meta_title: metaTitle || null,
    meta_description: metaDescription || null,
    meta_keywords: metaKeywords || null,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath(`/produk/${slug}`)
  return { success: true }
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.from('products').delete().eq('id', id)
  revalidatePath('/admin/products')
}

// --- CATEGORIES (Admin) ---

export async function createCategory(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const slug = slugify(name)

  const { error } = await supabase.from('categories').insert({
    name, slug, description,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const isActive = formData.get('is_active') === 'on'

  const { error } = await supabase.from('categories').update({
    name, description, is_active: isActive,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.from('categories').delete().eq('id', id)
  revalidatePath('/admin/categories')
}

// --- BANNERS (Admin) ---

export async function createBanner(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const linkUrl = formData.get('link_url') as string
  const sortOrder = parseInt(formData.get('sort_order') as string || '0')
  const imageUrl = formData.get('image_url') as string

  const { error } = await supabase.from('banners').insert({
    title, subtitle, link_url: linkUrl, sort_order: sortOrder, image_url: imageUrl,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  return { success: true }
}

export async function updateBanner(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const linkUrl = formData.get('link_url') as string
  const sortOrder = parseInt(formData.get('sort_order') as string || '0')
  const isActive = formData.get('is_active') === 'on'

  const { error } = await supabase.from('banners').update({
    title, subtitle, link_url: linkUrl, sort_order: sortOrder, is_active: isActive,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/banners')
  return { success: true }
}

export async function deleteBanner(id: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.from('banners').delete().eq('id', id)
  revalidatePath('/admin/banners')
}

// --- ORDERS (Admin) ---

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const updates: Record<string, any> = { status }

  if (status === 'shipped') updates.shipped_at = new Date().toISOString()
  if (status === 'delivered') updates.delivered_at = new Date().toISOString()
  if (status === 'cancelled') updates.cancelled_at = new Date().toISOString()

  await supabase.from('orders').update(updates).eq('id', orderId)
  revalidatePath('/admin/orders')
}

export async function updateShippingTracking(orderId: string, courier: string, service: string, trackingNumber: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  await supabase.from('orders').update({
    shipping_courier: courier,
    shipping_service: service,
    shipping_tracking_number: trackingNumber,
    status: 'shipped',
    shipped_at: new Date().toISOString(),
  }).eq('id', orderId)

  revalidatePath('/admin/orders')
}

// --- WISHLIST ---

export async function toggleWishlist(productId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login terlebih dahulu' }

  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  if (existing) {
    await supabase.from('wishlists').delete().eq('id', existing.id)
    return { wishlisted: false }
  }

  await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId })
  return { wishlisted: true }
}

export async function getWishlist() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('wishlists')
    .select('*, product:products(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (data || []) as Wishlist[]
}

export async function isWishlisted(productId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  return !!data
}

export async function getWishlistIds() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', user.id)

  return (data || []).map(w => w.product_id)
}

// --- REVIEWS ---

export async function createReview(productId: string, rating: number, comment: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login terlebih dahulu' }

  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    comment: comment || null,
  })

  if (error) return { error: error.message }
  revalidatePath(`/produk/${productId}`)
  return { success: true }
}

export async function getProductReviews(productId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('reviews')
    .select('*, profile:profiles(full_name, avatar_url)')
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (data || []) as (Review & { profile: Pick<Profile, 'full_name' | 'avatar_url'> })[]
}

export async function deleteReview(reviewId: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('reviews').delete().eq('id', reviewId)
  revalidatePath('/')
}

// --- FAQ ---

export async function createFAQ(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string
  const sortOrder = parseInt(formData.get('sort_order') as string || '0')

  const { error } = await supabase.from('faqs').insert({ question, answer, sort_order: sortOrder })
  if (error) return { error: error.message }
  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { success: true }
}

export async function updateFAQ(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string
  const sortOrder = parseInt(formData.get('sort_order') as string || '0')
  const isActive = formData.get('is_active') === 'on'

  const { error } = await supabase.from('faqs').update({ question, answer, sort_order: sortOrder, is_active: isActive }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/faq')
  revalidatePath('/faq')
  return { success: true }
}

export async function deleteFAQ(id: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('faqs').delete().eq('id', id)
  revalidatePath('/admin/faq')
  revalidatePath('/faq')
}

export async function getFAQs(activeOnly = false) {
  const supabase = await createServerSupabaseClient()
  let query = supabase.from('faqs').select('*').order('sort_order')
  if (activeOnly) query = query.eq('is_active', true)
  const { data } = await query
  return (data || []) as FAQ[]
}

// --- SETTINGS ---

export async function saveSetting(key: string, value: any) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('site_settings').upsert({ key, value: JSON.stringify(value) })
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true }
}

export async function getSetting(key: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('site_settings').select('value').eq('key', key).single()
  if (!data) return null
  return data.value
}

export async function getSettings() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('site_settings').select('*')
  const settings: Record<string, any> = {}
  for (const row of (data || [])) {
    settings[row.key] = row.value
  }
  return settings
}

export async function saveLandingSettings(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const template = formData.get('landing_template') as string
  const heroTitle = formData.get('landing_hero_title') as string
  const heroSubtitle = formData.get('landing_hero_subtitle') as string
  const singleProductId = formData.get('landing_single_product_id') as string

  await supabase.from('site_settings').upsert({ key: 'landing_template', value: JSON.stringify(template) })
  await supabase.from('site_settings').upsert({ key: 'landing_hero_title', value: JSON.stringify(heroTitle) })
  await supabase.from('site_settings').upsert({ key: 'landing_hero_subtitle', value: JSON.stringify(heroSubtitle) })
  await supabase.from('site_settings').upsert({ key: 'landing_single_product_id', value: JSON.stringify(singleProductId || null) })

  revalidatePath('/')
  revalidatePath('/admin/settings')
  return { success: true }
}

// --- CHECKOUT ---

export async function createOrder(items: { product_id: string; quantity: number; name: string; image: string; price: number }[], addressId: string, paymentMethod: string, notes: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login terlebih dahulu' }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxAmount = 0
  const shippingCost = 0
  const totalAmount = subtotal + shippingCost + taxAmount
  const orderNumber = generateOrderNumber()

  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id: user.id,
    order_number: orderNumber,
    status: 'pending',
    payment_method: paymentMethod,
    payment_status: paymentMethod === 'cod' ? 'unpaid' : 'unpaid',
    subtotal,
    shipping_cost: shippingCost,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    shipping_address_id: addressId,
    notes: notes || null,
  }).select().single()

  if (orderError) return { error: orderError.message }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.name,
    product_image: item.image,
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return { error: itemsError.message }

  await supabase.from('cart_items').delete().in('product_id', items.map(i => i.product_id))

  revalidatePath('/order/' + order.id)
  revalidatePath('/cart')

  return { success: true, orderId: order.id, orderNumber }
}
