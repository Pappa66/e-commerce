import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ProductForm from "@/components/admin/ProductForm"

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Edit Produk - Admin" }

export default async function EditProductPage({ params }: Props) {
  const supabase = await createServerSupabaseClient()
  const { id } = await params

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").eq("is_active", true).order("name"),
  ])

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Produk</h1>
      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}
