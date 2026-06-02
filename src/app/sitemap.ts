import type { MetadataRoute } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("slug,updated_at").eq("is_active", true),
    supabase.from("categories").select("slug,updated_at").eq("is_active", true),
  ])

  const baseUrl = "https://d2cpro.com"

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ]

  const productPages: MetadataRoute.Sitemap = (products || []).map(product => ({
    url: `${baseUrl}/produk/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map(cat => ({
    url: `${baseUrl}/kategori/${cat.slug}`,
    lastModified: new Date(cat.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}
