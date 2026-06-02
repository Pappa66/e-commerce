import ProductForm from "@/components/admin/ProductForm"

export const metadata = { title: "Tambah Produk - Admin" }

export default async function NewProductPage() {
  const { createServerSupabaseClient } = await import("@/lib/supabase/server")
  const supabase = await createServerSupabaseClient()
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("name")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>
      <ProductForm categories={categories || []} />
    </div>
  )
}
