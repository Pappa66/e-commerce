import { Card } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import SettingsForm from "./settings-form"

export const metadata = { title: "Pengaturan - Admin" }

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('site_settings').select('*')
  const settings: Record<string, any> = {}
  for (const row of (data || [])) {
    settings[row.key] = row.value
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pengaturan Toko</h1>
      <SettingsForm settings={settings} />
    </div>
  )
}
