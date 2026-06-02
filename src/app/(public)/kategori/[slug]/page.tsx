import { notFound } from "next/navigation"
import { getCachedProducts, getCachedCategories } from "@/lib/cache"
import { productSlugLoader } from "@/lib/dataloader"
import ProductCard from "@/components/public/ProductCard"
import Pagination from "@/components/ui/pagination"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import type { Product, Category } from "@/types/database"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  const category = (await getCachedCategories()).find(c => c.slug === slug) as Category | undefined

  if (!category) return { title: "Kategori Tidak Ditemukan" }

  return {
    title: `Kategori ${category.name}`,
    description: category.description || `Produk ${category.name} terbaik`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const slug = (await params).slug
  const page = parseInt((await searchParams).page || '1', 10)

  const categories = await getCachedCategories()
  const category = categories.find(c => c.slug === slug) as Category | undefined
  if (!category) notFound()

  const { products, total, totalPages } = await getCachedProducts({
    categoryId: category.id,
    page,
    limit: ITEMS_PER_PAGE,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">{total} produk</p>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(products as Product[]).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/kategori/${slug}`}
          />
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>Belum ada produk di kategori ini</p>
        </div>
      )}
    </div>
  )
}
