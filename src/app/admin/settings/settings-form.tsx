'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { saveLandingSettings, saveSetting } from "@/lib/actions"

const TEMPLATES = [
  { value: 'default', label: 'Default (Toko Online)', desc: 'Banner + Kategori + Produk Unggulan — cocok untuk toko dengan banyak produk' },
  { value: 'single-product', label: 'Single Product', desc: 'Fokus pada satu produk — cocok untuk landing produk tertentu' },
  { value: 'catalog', label: 'Katalog', desc: 'Grid produk sederhana tanpa banner — cocok untuk katalog' },
]

export default function SettingsForm({ settings }: { settings: Record<string, any> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLandingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await saveLandingSettings(formData)
    setLoading(false)
    toast.success('Template landing page diperbarui')
    router.refresh()
  }

  const handleStoreSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    await saveSetting('store_name', form.get('store_name'))
    await saveSetting('store_description', form.get('store_description'))
    await saveSetting('store_whatsapp', form.get('store_whatsapp'))
    await saveSetting('store_email', form.get('store_email'))
    setLoading(false)
    toast.success('Pengaturan toko disimpan')
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Template Landing Page</h2>
        <form onSubmit={handleLandingSubmit} className="space-y-4">
          <div className="grid gap-3">
            {TEMPLATES.map(t => (
              <label
                key={t.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  settings.landing_template === t.value ? 'border-emerald-500 bg-emerald-50' : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="landing_template"
                  value={t.value}
                  defaultChecked={settings.landing_template === t.value}
                  className="mt-1"
                />
                <div>
                  <span className="font-medium text-sm">{t.label}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-medium text-sm">Konten Hero</h3>
            <div>
              <Label>Judul Hero</Label>
              <Input name="landing_hero_title" defaultValue={settings.landing_hero_title || ''} />
            </div>
            <div>
              <Label>Subtitle Hero</Label>
              <Input name="landing_hero_subtitle" defaultValue={settings.landing_hero_subtitle || ''} />
            </div>
            <div>
              <Label>ID Produk (khusus template Single Product)</Label>
              <Input name="landing_single_product_id" defaultValue={settings.landing_single_product_id || ''} placeholder="UUID produk yang ingin ditampilkan" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? 'Menyimpan...' : 'Simpan Template'}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Informasi Toko</h2>
        <form onSubmit={handleStoreSubmit} className="space-y-4">
          <div>
            <Label>Nama Toko</Label>
            <Input name="store_name" defaultValue={settings.store_name || 'Toko Saya'} />
          </div>
          <div>
            <Label>Deskripsi Toko</Label>
            <Textarea name="store_description" defaultValue={settings.store_description || ''} rows={2} />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input name="store_whatsapp" defaultValue={settings.store_whatsapp || ''} placeholder="Nomor WhatsApp" />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="store_email" defaultValue={settings.store_email || ''} />
          </div>
          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
