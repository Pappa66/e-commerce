import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoryForm from "@/components/admin/CategoryForm"
import { deleteCategory } from "@/lib/actions"
import type { Category } from "@/types/database"

export const metadata = { title: "Kategori - Admin" }

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kategori</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-4">Tambah Kategori Baru</h2>
            <CategoryForm />
          </div>
        </div>

        <div>
          <div className="rounded-xl border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="p-4 font-medium">Nama</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories && (categories as Category[]).map(cat => (
                  <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-gray-500">{cat.slug}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cat.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {cat.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="p-4">
                      <form action={deleteCategory.bind(null, cat.id)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
                {(!categories || categories.length === 0) && (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-400">Belum ada kategori</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
