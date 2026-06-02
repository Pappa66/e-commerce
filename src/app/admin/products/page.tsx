import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { deleteProduct } from "@/lib/actions"
import Pagination from "@/components/ui/pagination"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import type { Product } from "@/types/database"

export const metadata = { title: "Produk - Admin" }

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const supabase = await createServerSupabaseClient()
  const page = parseInt((await searchParams).page || '1', 10)
  const from = (page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data: products, count } = await supabase
    .from("products")
    .select("*, category:categories(*)  ", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produk ({count || 0})</h1>
        <Link href="/admin/products/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" /> Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="p-4 font-medium">Nama</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Stok</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products && (products as Product[]).map(product => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium max-w-[200px] truncate">{product.name}</td>
                  <td className="p-4 text-gray-500">{(product as any).category?.name || "-"}</td>
                  <td className="p-4">{formatPrice(product.final_price)}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {product.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">Belum ada produk</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/admin/products"
      />
    </div>
  )
}
