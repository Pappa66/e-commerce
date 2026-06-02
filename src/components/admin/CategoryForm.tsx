"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createCategory } from "@/lib/actions"
import { toast } from "sonner"

export default function CategoryForm() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await createCategory(formData)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Kategori berhasil ditambahkan")
    router.refresh()
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nama Kategori</Label>
        <Input id="name" name="name" required placeholder="e.g., Hijab" />
      </div>
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" name="description" rows={2} placeholder="Deskripsi kategori..." />
      </div>
      <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Simpan</Button>
    </form>
  )
}
