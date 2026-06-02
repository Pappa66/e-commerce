import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: products, error: pErr } = await supabase.from('products').select('count', { count: 'exact', head: true })
    const { data: categories, error: cErr } = await supabase.from('categories').select('count', { count: 'exact', head: true })
    const { data: banners, error: bErr } = await supabase.from('banners').select('count', { count: 'exact', head: true })
    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({
      status: 'ok',
      env: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      database: {
        products: products?.count ?? 0,
        categories: categories?.count ?? 0,
        banners: banners?.count ?? 0,
        errors: { products: pErr?.message, categories: cErr?.message, banners: bErr?.message },
      },
      auth: { loggedIn: !!user },
    }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 })
  }
}
