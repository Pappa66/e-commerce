import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export const metadata = { title: "Pengaturan - Admin" }

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pengaturan Toko</h1>

      <div className="max-w-xl space-y-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Informasi Toko</h2>
          <div className="space-y-4">
            <div>
              <Label>Nama Toko</Label>
              <Input defaultValue="D2C Pro Store" />
            </div>
            <div>
              <Label>Deskripsi Toko</Label>
              <Input defaultValue="Toko fashion muslim terpercaya" />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input defaultValue="081234567890" placeholder="Nomor WhatsApp" />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue="hello@d2cpro.com" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold mb-4">Pengaturan Pajak</h2>
          <div className="space-y-4">
            <div>
              <Label>PPN (%)</Label>
              <Input defaultValue="11" type="number" />
              <p className="text-xs text-gray-400 mt-1">Pajak Pertambahan Nilai standar Indonesia</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button className="bg-emerald-600 hover:bg-emerald-700">Simpan Pengaturan</Button>
        </div>
      </div>
    </div>
  )
}
