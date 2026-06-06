import Navbar from "@/components/public/Navbar"
import Footer from "@/components/public/Footer"
import BannerSlider from "@/components/public/BannerSlider"
import ProductCard from "@/components/public/ProductCard"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCachedProducts, getCachedCategories, getCachedBanners } from "@/lib/cache"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [banners, categories, { products: featuredProducts }] = await Promise.all([
    getCachedBanners(),
    getCachedCategories(),
    getCachedProducts({ isFeatured: true, limit: 8 }),
  ])

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
