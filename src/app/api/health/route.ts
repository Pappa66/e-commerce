import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    // Anon key (respects RLS)
    const { count: anonProducts, error: pErr } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const { count: anonCategories, error: cErr } = await supabase.from('categories').select('*', { count: 'exact', head: true })
    const { count: anonBanners, error: bErr } = await supabase.from('banners').select('*', { count: 'exact', head: true })

    // Service role (bypasses RLS - to confirm data exists)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    const { count: actualProducts } = await adminClient.from('products').select('*', { count: 'exact', head: true })
    const { count: actualCategories } = await adminClient.from('categories').select('*', { count: 'exact', head: true })
    const { count: actualBanners } = await adminClient.from('banners').select('*', { count: 'exact', head: true })

    const { data: { user } } = await supabase.auth.getUser()

    return NextResponse.json({
      status: 'ok',
      env: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      database: {
        anon: { products: anonProducts ?? 0, categories: anonCategories ?? 0, banners: anonBanners ?? 0 },
        actual: { products: actualProducts ?? 'err', categories: actualCategories ?? 'err', banners: actualBanners ?? 'err' },
      },
      errors: {
        products: pErr?.message || null,
        categories: cErr?.message || null,
        banners: bErr?.message || null,
      },
      auth: { loggedIn: !!user },
    }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ status: 'error', message: String(err) }, { status: 500 })
  }
}
