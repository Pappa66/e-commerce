'use server'

import { createServerSupabaseClient } from './supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify, calculateFinalPrice, generateOrderNumber } from './utils'
import type { Address, Wishlist, Review, Profile, FAQ, Coupon } from '@/types/database'

// --- PROFILE ---

export async function updateProfile(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login' }

  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string
  const avatarUrl = formData.get('avatar_url') as string
  const gender = formData.get('gender') as string
  const birthDate = formData.get('birth_date') as string

  const { error } = await supabase.from('profiles').update({
    full_name: fullName || null,
    phone: phone || null,
    avatar_url: avatarUrl || null,
    gender: gender || null,
    birth_date: birthDate || null,
  }).eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { success: true }
}

export async function saveAddress(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login' }

  const addressId = formData.get('id') as string
  const label = formData.get('label') as string
  const recipientName = formData.get('recipient_name') as string
  const phone = formData.get('phone') as string
  const streetAddress = formData.get('street_address') as string
  const city = formData.get('city') as string
  const district = formData.get('district') as string
  const province = formData.get('province') as string
  const postalCode = formData.get('postal_code') as string
  const isDefault = formData.get('is_default') === 'on'

  const addressData: any = {
    user_id: user.id,
    label: label || null,
    recipient_name: recipientName || null,
    phone: phone || null,
    street_address: streetAddress,
    city,
    district: district || null,
    province,
    postal_code: postalCode || null,
    is_default: isDefault,
  }

  if (isDefault) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
  }

  if (addressId) {
    const { error } = await supabase.from('addresses').update(addressData).eq('id', addressId).eq('user_id', user.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase.from('addresses').insert(addressData)
    if (error) return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function deleteAddress(addressId: string): Promise<void> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('addresses').delete().eq('id', addressId).eq('user_id', user.id)
  revalidatePath('/profile')
}

export async function setDefaultAddress(addressId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login' }

  await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)
  await supabase.from('addresses').update({ is_default: true }).eq('id', addressId).eq('user_id', user.id)
  revalidatePath('/profile')
  revalidatePath('/checkout')
}

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

  const { data: newProduct, error } = await supabase.from('products').insert({
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
  }).select('id').single()

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  return { success: true, productId: newProduct?.id }
}

export async function saveProductVariants(productId: string, variants: { name: string; size: string; color: string; price_adjustment: number; stock: number }[]) {
  const supabase = await createServerSupabaseClient()

  await supabase.from('product_variants').delete().eq('product_id', productId)

  if (variants.length === 0) return { success: true }

  const { error } = await supabase.from('product_variants').insert(
    variants.map(v => ({ ...v, product_id: productId }))
  )

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath(`/produk/*`)
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

// --- COUPONS ---

export async function validateCoupon(code: string, subtotal: number) {
  const supabase = await createServerSupabaseClient()

  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (!coupon) return { error: 'Kode kupon tidak valid' }

  const c = coupon as Coupon

  if (c.expires_at && new Date(c.expires_at) < new Date()) return { error: 'Kupon sudah kadaluarsa' }
  if (c.starts_at && new Date(c.starts_at) > new Date()) return { error: 'Kupon belum berlaku' }
  if (c.usage_limit > 0 && c.used_count >= c.usage_limit) return { error: 'Kuota kupon sudah habis' }
  if (subtotal < c.min_purchase) return { error: `Min. belanja Rp${c.min_purchase.toLocaleString('id-ID')} untuk kupon ini` }

  let discountAmount = 0
  if (c.type === 'percentage') {
    discountAmount = Math.round(subtotal * c.value / 100)
    if (c.max_discount) discountAmount = Math.min(discountAmount, c.max_discount)
  } else if (c.type === 'fixed') {
    discountAmount = c.value
  } else if (c.type === 'free_shipping') {
    discountAmount = 0
  }

  return { coupon: c, discountAmount: discountAmount || 0 }
}

export async function createCoupon(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const code = (formData.get('code') as string).toUpperCase()
  const type = formData.get('type') as string
  const value = parseFloat(formData.get('value') as string || '0')
  const minPurchase = parseFloat(formData.get('min_purchase') as string || '0')
  const maxDiscount = formData.get('max_discount') ? parseFloat(formData.get('max_discount') as string) : null
  const usageLimit = parseInt(formData.get('usage_limit') as string || '0')
  const expiresAt = formData.get('expires_at') as string

  const { error } = await supabase.from('coupons').insert({
    code, type, value, min_purchase: minPurchase, max_discount: maxDiscount,
    usage_limit: usageLimit, expires_at: expiresAt || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function updateCoupon(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const code = (formData.get('code') as string).toUpperCase()
  const type = formData.get('type') as string
  const value = parseFloat(formData.get('value') as string || '0')
  const minPurchase = parseFloat(formData.get('min_purchase') as string || '0')
  const maxDiscount = formData.get('max_discount') ? parseFloat(formData.get('max_discount') as string) : null
  const usageLimit = parseInt(formData.get('usage_limit') as string || '0')
  const isActive = formData.get('is_active') === 'on'
  const expiresAt = formData.get('expires_at') as string

  const { error } = await supabase.from('coupons').update({
    code, type, value, min_purchase: minPurchase, max_discount: maxDiscount,
    usage_limit: usageLimit, is_active: isActive, expires_at: expiresAt || null,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/coupons')
  return { success: true }
}

export async function deleteCoupon(id: string) {
  const supabase = await createServerSupabaseClient()
  await supabase.from('coupons').delete().eq('id', id)
  revalidatePath('/admin/coupons')
}

// --- CHECKOUT ---

export async function createOrder(items: { product_id: string; quantity: number; name: string; image: string; price: number; variant_name?: string }[], addressId: string, paymentMethod: string, notes: string, couponCode?: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login terlebih dahulu' }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxAmount = 0
  const shippingCost = 0

  let discountAmount = 0
  let couponId: string | null = null
  if (couponCode) {
    const result = await validateCoupon(couponCode, subtotal)
    if (result.coupon) {
      discountAmount = result.discountAmount
      couponId = result.coupon.id
    }
  }

  const totalAmount = subtotal + shippingCost + taxAmount - discountAmount
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
    discount_amount: discountAmount,
    coupon_id: couponId,
    total_amount: totalAmount,
    shipping_address_id: addressId,
    notes: notes || null,
  }).select().single()

  if (orderError) return { error: orderError.message }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.name,
    variant_name: item.variant_name || null,
    product_image: item.image,
    quantity: item.quantity,
    unit_price: item.price,
    subtotal: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return { error: itemsError.message }

  if (couponId) {
    const { data: couponData } = await supabase.from('coupons').select('used_count').eq('id', couponId).single()
    if (couponData) {
      await supabase.from('coupons').update({ used_count: (couponData as any).used_count + 1 }).eq('id', couponId)
    }
  }

  const { data: userCart } = await supabase.from('carts').select('id').eq('user_id', user.id).maybeSingle()
  if (userCart) {
    await supabase.from('cart_items').delete().eq('cart_id', userCart.id)
  }

  revalidatePath('/order/' + order.id)
  revalidatePath('/cart')

  return { success: true, orderId: order.id, orderNumber }
}

// --- MIDTRANS ---

export async function createMidtransTransaction(orderId: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Silakan login terlebih dahulu' }

  const { data: order } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) return { error: 'Pesanan tidak ditemukan' }

  const Midtrans = require('midtrans-client')
  const snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  })

  const itemDetails = (order as any).items.map((item: any) => ({
    id: item.product_id,
    name: item.product_name,
    price: Math.round(item.unit_price),
    quantity: item.quantity,
  }))

  const parameter = {
    transaction_details: {
      order_id: (order as any).order_number,
      gross_amount: Math.round((order as any).total_amount),
    },
    item_details: itemDetails,
    customer_details: {
      first_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
      email: user.email,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL || ''}/order/${orderId}`,
      error: `${process.env.NEXT_PUBLIC_APP_URL || ''}/order/${orderId}`,
    },
  }

  try {
    const transaction = await snap.createTransaction(parameter)
    return { token: transaction.token, redirect_url: transaction.redirect_url }
  } catch (err: any) {
    return { error: err.message || 'Gagal membuat transaksi pembayaran' }
  }
}
