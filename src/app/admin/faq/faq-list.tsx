'use client'

import { useRouter } from 'next/navigation'
import { Pencil, Trash2, EyeOff, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { deleteFAQ, updateFAQ } from '@/lib/actions'
import type { FAQ } from '@/types/database'

export default function FAQList({ faqs }: { faqs: FAQ[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus FAQ ini?')) return
    await deleteFAQ(id)
    toast.success('FAQ dihapus')
    router.refresh()
  }

  const handleToggleActive = async (faq: FAQ) => {
    const form = new FormData()
    form.set('question', faq.question)
    form.set('answer', faq.answer)
    form.set('sort_order', String(faq.sort_order))
    form.set('is_active', faq.is_active ? '' : 'on')
    await updateFAQ(faq.id, form)
    toast.success(faq.is_active ? 'FAQ dinonaktifkan' : 'FAQ diaktifkan')
    router.refresh()
  }

  if (!faqs.length) {
    return <p className="text-sm text-gray-400">Belum ada FAQ. Tambahkan FAQ baru di atas.</p>
  }

  return (
    <div className="space-y-3">
      {faqs.map(faq => (
        <div key={faq.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{faq.question}</h3>
                {!faq.is_active && <Badge variant="secondary" className="text-xs">Nonaktif</Badge>}
              </div>
              <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
              <span className="text-xs text-gray-400 mt-1 block">Urutan: {faq.sort_order}</span>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(faq)}>
                {faq.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(faq.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
