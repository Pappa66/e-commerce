export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  base_price: number
  profit_margin: number
  tax_rate: number
  final_price: number
  stock: number
  weight_grams: number
  is_active: boolean
  is_featured: boolean
  images: string[]
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export interface Banner {
  id: string
  title: string | null
  subtitle: string | null
  image_url: string
  link_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string | null
  recipient_name: string | null
  phone: string | null
  street_address: string
  city: string
  district: string | null
  province: string
  postal_code: string | null
  is_default: boolean
  created_at: string
}

export interface Cart {
  id: string
  user_id: string | null
  session_id: string | null
  created_at: string
  updated_at: string
  items?: CartItem[]
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string | null
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  payment_method: 'cod' | 'midtrans' | 'transfer'
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded'
  midtrans_transaction_id: string | null
  subtotal: number
  shipping_cost: number
  tax_amount: number
  total_amount: number
  shipping_address_id: string | null
  shipping_courier: string | null
  shipping_service: string | null
  shipping_tracking_number: string | null
  notes: string | null
  paid_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
  shipping_address?: Address
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string | null
  quantity: number
  unit_price: number
  subtotal: number
  created_at: string
}
