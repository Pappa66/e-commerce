import Navbar from "@/components/public/Navbar"
import Footer from "@/components/public/Footer"
import BannerSlider from "@/components/public/BannerSlider"
import ProductCard from "@/components/public/ProductCard"
import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCachedProducts, getCachedCategories, getCachedBanners } from "@/lib/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  const [banners, categories, { products: featuredProducts }, settingsData] = await Promise.all([
    getCachedBanners(),
    getCachedCategories(),
    getCachedProducts({ isFeatured: true, limit: 8 }),
    supabase.from('site_settings').select('*'),
  ])

  const settings: Record<string, any> = {}
  for (const row of (settingsData.data || [])) {
    settings[row.key] = row.value
  }

  const template = settings.landing_template || 'default'
  const heroTitle = settings.landing_hero_title || 'Temukan Fashion Muslim Terbaik'
  const heroSubtitle = settings.landing_hero_subtitle || 'Koleksi terbaru dengan kualitas premium.'
  const singleProductId = settings.landing_single_product_id

  // Template: Single Product
  if (template === 'single-product' && singleProductId) {
    const { data: product } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', singleProductId)
      .single()

    if (product) {
      return (
        <>
          <Navbar />
          <main className="flex-1">
            <section className="bg-gradient-to-b from-emerald-50 to-white py-16 md:py-24">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
                  <p className="text-gray-600 text-lg mb-8">{heroSubtitle}</p>
                  <Link href={`/produk/${product.slug}`}>
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Beli {product.name}
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
                    <p className="text-3xl font-bold text-emerald-600 mb-4">
                      {formatPrice(product.final_price)}
                    </p>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    <Link href={`/produk/${product.slug}`}>
                      <Button size="lg" className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                        Lihat Detail Produk
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </>
      )
    }
  }

  // Template: Catalog (no banner, just products)
  if (template === 'catalog') {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <section className="bg-emerald-600 py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{heroTitle}</h1>
              <p className="text-emerald-100 max-w-xl mx-auto">{heroSubtitle}</p>
            </div>
          </section>
          <div className="container mx-auto px-4 py-8">
            {featuredProducts.length > 0 && (
              <>
                <h2 className="text-xl font-bold mb-4">Produk Unggulan</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {featuredProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Default template
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <BannerSlider banners={banners as any} />

          {categories.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold mb-4">Kategori</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/kategori/${cat.slug}`}
                    className="px-4 py-2 rounded-full border bg-white text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Produk Unggulan</h2>
              <Link href="/search">
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  Lihat Semua <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Belum ada produk unggulan</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
