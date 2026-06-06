import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ChevronDown } from "lucide-react"
import type { FAQ } from "@/types/database"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ - Pertanyaan yang Sering Diajukan",
  description: "Pertanyaan yang sering diajukan tentang produk dan belanja",
}

export default async function FAQPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const faqs = (data || []) as FAQ[]

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">FAQ</h1>
      <p className="text-gray-500 mb-8">Pertanyaan yang sering diajukan</p>

      {faqs.length === 0 ? (
        <p className="text-gray-400">Belum ada FAQ.</p>
      ) : (
        <div className="space-y-3">
          {faqs.map(faq => (
            <details key={faq.id} className="group border rounded-lg overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors list-none">
                <span className="font-medium text-sm">{faq.question}</span>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180 shrink-0" />
              </summary>
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t pt-3">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
