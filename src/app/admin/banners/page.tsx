import { createServerSupabaseClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import BannerForm from "@/components/admin/BannerForm"
import { deleteBanner } from "@/lib/actions"
import { getImageUrl } from "@/lib/utils"
import type { Banner } from "@/types/database"

export const metadata = { title: "Banner - Admin" }

export default async function AdminBannersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: banners } = await supabase.from("banners").select("*").order("sort_order")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Banner</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold mb-4">Tambah Banner Baru</h2>
            <BannerForm />
          </div>
        </div>

        <div className="space-y-4">
          {banners && (banners as Banner[]).map(banner => (
            <div key={banner.id} className="rounded-xl border bg-white overflow-hidden flex">
              <div className="relative w-32 shrink-0 bg-gray-100">
                <Image src={getImageUrl(banner.image_url)} alt={banner.title || ""} fill className="object-cover" sizes="128px" />
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-medium text-sm">{banner.title || "Tanpa Judul"}</h3>
                {banner.subtitle && <p className="text-xs text-gray-500 mt-1">{banner.subtitle}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${banner.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {banner.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                  <span className="text-xs text-gray-400">Urutan: {banner.sort_order}</span>
                </div>
              </div>
              <div className="flex flex-col p-2 gap-1">
                <form action={deleteBanner.bind(null, banner.id)}>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
          {(!banners || banners.length === 0) && (
            <p className="text-center text-gray-400 py-8">Belum ada banner</p>
          )}
        </div>
      </div>
    </div>
  )
}
