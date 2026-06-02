"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBanner } from "@/lib/actions"
import { toast } from "sonner"

export default function BannerForm() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await createBanner(formData)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Banner berhasil ditambahkan")
    router.refresh()
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Judul</Label>
        <Input id="title" name="title" placeholder="Judul banner" />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Textarea id="subtitle" name="subtitle" rows={2} placeholder="Subtitle banner..." />
      </div>
      <div>
        <Label htmlFor="image_url">URL Gambar *</Label>
        <Input id="image_url" name="image_url" required placeholder="https://... atau path storage" />
        <p className="text-xs text-gray-400 mt-1">Gunakan URL gambar dari Supabase Storage atau URL eksternal</p>
      </div>
      <div>
        <Label htmlFor="link_url">Link Tujuan (opsional)</Label>
        <Input id="link_url" name="link_url" placeholder="/produk/nama-produk" />
      </div>
      <div>
        <Label htmlFor="sort_order">Urutan</Label>
        <Input id="sort_order" name="sort_order" type="number" defaultValue={0} min="0" />
      </div>
      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Simpan</Button>
    </form>
  )
}
