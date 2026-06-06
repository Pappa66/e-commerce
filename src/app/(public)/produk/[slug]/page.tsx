import { notFound } from "next/navigation"
import Image from "next/image"
import { Check, Truck, Shield } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { formatPrice, getImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "./add-to-cart"
import WishlistButton from "./wishlist-button"
import ReviewsSection from "./reviews-section"
import type { Metadata } from "next"
import type { Product } from "@/types/database"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createServerSupabaseClient()
  const slug = (await params).slug
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single()

  if (!product) return { title: "Produk Tidak Ditemukan" }

  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.description?.slice(0, 160),
    keywords: product.meta_keywords,
    openGraph: {
      title: product.meta_title || product.name,
      description: product.meta_description || undefined,
      images: product.images?.[0] ? [{ url: getImageUrl(product.images[0]) }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const supabase = await createServerSupabaseClient()
  const slug = (await params).slug

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single()

  if (!product) notFound()

  const p = product as Product

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={getImageUrl(p.images?.[0] || null)}
            alt={p.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col">
          {p.category && (
            <Badge variant="secondary" className="w-fit mb-2">
              {p.category.name}
            </Badge>
          )}

          <h1 className="text-2xl md:text-3xl font-bold">{p.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-emerald-600">
              {formatPrice(p.final_price)}
            </span>
            {p.base_price > 0 && p.final_price > p.base_price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(p.base_price)}
              </span>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Stok:</span>{" "}
            {p.stock > 0 ? `${p.stock} tersedia` : "Habis"}
          </div>

          {p.description && (
            <p className="mt-6 text-gray-600 leading-relaxed whitespace-pre-line">
              {p.description}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" /> Bayar di Tempat (COD)
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-600" /> Pengiriman ke seluruh Indonesia
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" /> Produk Original 100%
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <AddToCartButton product={p} />
            <WishlistButton productId={p.id} />
          </div>
        </div>
      </div>

      <ReviewsSection productId={p.id} />
    </div>
  )
}
