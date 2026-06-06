import { Card } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import FAQList from "./faq-list"
import FAQForm from "./faq-form"
import type { FAQ } from "@/types/database"

export const metadata = { title: "FAQ - Admin" }

export default async function AdminFAQPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('faqs').select('*').order('sort_order')
  const faqs = (data || []) as FAQ[]

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">FAQ</h1>

      <Card className="p-6 mb-6">
        <h2 className="font-semibold mb-4">Tambah FAQ Baru</h2>
        <FAQForm />
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Daftar FAQ ({faqs.length})</h2>
        <FAQList faqs={faqs} />
      </Card>
    </div>
  )
}
