import BannerSlider from "@/components/public/BannerSlider"
import ProductCard from "@/components/public/ProductCard"
import { getCachedBanners, getCachedProducts, getCachedCategories } from "@/lib/cache"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Banner, Product, Category } from "@/types/database"

export const dynamic = 'force-static'
export const revalidate = 60

export default async function HomePage() {
  const [banners, featuredData, categories] = await Promise.all([
    getCachedBanners(),
    getCachedProducts({ isFeatured: true, limit: 8 }),
    getCachedCategories(),
  ])

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <BannerSlider banners={banners as Banner[]} />

        {categories.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">Kategori</h2>
            <div className="flex flex-wrap gap-3">
              {(categories as Category[]).map((cat) => (
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
          {featuredData.products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredData.products.map((product: Product) => (
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
    </div>
  )
}
