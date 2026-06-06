'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createFAQ } from '@/lib/actions'

export default function FAQForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createFAQ(formData)
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success('FAQ berhasil ditambahkan')
    router.refresh()
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question">Pertanyaan</Label>
        <Input id="question" name="question" required placeholder="Apa yang sering ditanyakan?" />
      </div>
      <div>
        <Label htmlFor="answer">Jawaban</Label>
        <Textarea id="answer" name="answer" required placeholder="Jawaban lengkap..." rows={3} />
      </div>
      <div>
        <Label htmlFor="sort_order">Urutan</Label>
        <Input id="sort_order" name="sort_order" type="number" defaultValue={0} className="w-24" />
      </div>
      <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
        {loading ? 'Menyimpan...' : 'Tambah FAQ'}
      </Button>
    </form>
  )
}
