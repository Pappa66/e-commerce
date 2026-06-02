import Link from 'next/link'
import { getCachedProducts } from "@/lib/cache"
import { getCachedCategories } from "@/lib/cache"
import ProductCard from "@/components/public/ProductCard"
import Pagination from "@/components/ui/pagination"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import type { Product, Category } from "@/types/database"

interface Props {
  searchParams: Promise<{ q?: string; sort?: string; category?: string; page?: string }>
}

export const metadata = {
  title: "Katalog Produk",
  description: "Semua produk fashion muslim terbaru",
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, sort, category, page } = await searchParams
  const currentPage = parseInt(page || '1', 10)

  const categories = await getCachedCategories()

  const { products, total, totalPages } = await getCachedProducts({
    searchQuery: q,
    categoryId: category,
    sort,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          {q ? `Hasil pencarian "${q}"` : "Semua Produk"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{total} produk ditemukan</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/search"
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              !category ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Semua
          </Link>
          {(categories as Category[]).map(cat => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.id}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                category === cat.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="ml-auto">
          <form>
            {q && <input type="hidden" name="q" value={q} />}
            {category && <input type="hidden" name="category" value={category} />}
            <select
              name="sort"
              defaultValue={sort || ''}
              onChange={e => e.target.form?.submit()}
              className="text-sm border rounded-lg px-3 py-2 bg-white"
            >
              <option value="">Terbaru</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
            </select>
          </form>
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(products as Product[]).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/search"
            searchParams={Object.fromEntries(
              Object.entries({ q, sort, category }).filter(([_, v]) => v)
            ) as Record<string, string>}
          />
        </>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Produk tidak ditemukan</p>
          <p className="text-sm mt-1">Coba kata kunci lain atau jelajahi kategori</p>
        </div>
      )}
    </div>
  )
}
