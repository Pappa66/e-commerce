'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { updateProfile, saveAddress, deleteAddress, setDefaultAddress } from "@/lib/actions"
import { INDONESIAN_PROVINCES } from "@/lib/constants"
import { Pencil, Trash2, Plus, Star, MapPin, User, Package, Heart, LogOut } from "lucide-react"
import Link from "next/link"
import { logout } from "@/lib/actions"
import type { Profile, Address } from "@/types/database"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [tab, setTab] = useState<"profile" | "addresses">("profile")
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return }
      setUser(data.user)
      supabase.from("profiles").select("*").eq("id", data.user.id).single().then(({ data: p }) => {
        if (p) setProfile(p as Profile)
      })
      supabase.from("addresses").select("*").eq("user_id", data.user.id).order("is_default", { ascending: false }).then(({ data: a }) => {
        if (a) setAddresses(a as Address[])
      })
    })
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    if (result.error) { toast.error(result.error); return }
    toast.success("Profil berhasil diperbarui")
  }

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await saveAddress(formData)
    if (result.error) { toast.error(result.error); return }
    toast.success(editingAddress ? "Alamat berhasil diperbarui" : "Alamat berhasil ditambahkan")
    setShowAddressForm(false)
    setEditingAddress(null)
    const supabase = createClient()
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false })
    if (data) setAddresses(data as Address[])
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-emerald-600">
                {(profile?.full_name || user.email)?.[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile?.full_name || user.email}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b pb-2">
          <button onClick={() => setTab("profile")} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${tab === "profile" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}>
            <User className="h-4 w-4 inline mr-1" /> Profil
          </button>
          <button onClick={() => setTab("addresses")} className={`px-4 py-2 text-sm font-medium rounded-t-lg ${tab === "addresses" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}>
            <MapPin className="h-4 w-4 inline mr-1" /> Alamat ({addresses.length})
          </button>
          <Link href="/order" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-t-lg">
            <Package className="h-4 w-4 inline mr-1" /> Pesanan
          </Link>
          <Link href="/wishlist" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-t-lg">
            <Heart className="h-4 w-4 inline mr-1" /> Wishlist
          </Link>
        </div>

        {tab === "profile" && (
          <div className="rounded-xl border bg-white p-6">
            <h2 className="font-semibold text-lg mb-4">Informasi Akun</h2>
            <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
              <div>
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ""} placeholder="Nama Anda" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label htmlFor="phone">No. Telepon</Label>
                <Input id="phone" name="phone" defaultValue={profile?.phone || ""} placeholder="0812..." />
              </div>
              <div>
                <Label htmlFor="avatar_file">Foto Profil</Label>
                <Input id="avatar_file" name="avatar_file" type="file" accept="image/*" className="text-sm" />
                {profile?.avatar_url && <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ingin ganti foto</p>}
              </div>
              <div>
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select name="gender" defaultValue={profile?.gender || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="birth_date">Tanggal Lahir</Label>
                <Input id="birth_date" name="birth_date" type="date" defaultValue={profile?.birth_date || ""} />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Simpan Profil</Button>
            </form>
          </div>
        )}

        {tab === "addresses" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Alamat Saya</h2>
              {!showAddressForm && (
                <Button variant="outline" size="sm" onClick={() => { setEditingAddress(null); setShowAddressForm(true) }}>
                  <Plus className="h-4 w-4 mr-1" /> Tambah Alamat
                </Button>
              )}
            </div>

            {showAddressForm && (
              <div className="rounded-xl border bg-white p-6 mb-4">
                <h3 className="font-semibold mb-4">{editingAddress ? "Edit Alamat" : "Alamat Baru"}</h3>
                <form onSubmit={handleSaveAddress} className="space-y-3 max-w-lg">
                  {editingAddress && <input type="hidden" name="id" value={editingAddress.id} />}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Label</Label>
                      <Select name="label" defaultValue={editingAddress?.label || ""}>
                        <SelectTrigger><SelectValue placeholder="Pilih label" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Utama">🏠 Utama</SelectItem>
                          <SelectItem value="Rumah">🏡 Rumah</SelectItem>
                          <SelectItem value="Kantor">🏢 Kantor</SelectItem>
                          <SelectItem value="Kost">🛏️ Kost</SelectItem>
                          <SelectItem value="Lainnya">📍 Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Nama Penerima</Label>
                      <Input name="recipient_name" defaultValue={editingAddress?.recipient_name || ""} placeholder="Nama" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">No. Telepon</Label>
                      <Input name="phone" defaultValue={editingAddress?.phone || ""} placeholder="0812..." />
                    </div>
                    <div>
                      <Label className="text-xs">Provinsi</Label>
                      <Select name="province" defaultValue={editingAddress?.province || ""}>
                        <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                        <SelectContent>
                          {INDONESIAN_PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Kota</Label>
                      <Input name="city" defaultValue={editingAddress?.city || ""} placeholder="Kota" required />
                    </div>
                    <div>
                      <Label className="text-xs">Kecamatan</Label>
                      <Input name="district" defaultValue={editingAddress?.district || ""} placeholder="Kecamatan" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Alamat Lengkap</Label>
                    <Input name="street_address" defaultValue={editingAddress?.street_address || ""} placeholder="Jl. ... No. ..." required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Kode Pos</Label>
                      <Input name="postal_code" defaultValue={editingAddress?.postal_code || ""} placeholder="12345" />
                    </div>
                    <label className="flex items-center gap-2 pt-6 cursor-pointer">
                      <input type="checkbox" name="is_default" defaultChecked={editingAddress?.is_default} className="rounded" />
                      <span className="text-sm">Jadikan alamat utama</span>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                      {editingAddress ? "Simpan" : "Tambah"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowAddressForm(false); setEditingAddress(null) }}>Batal</Button>
                  </div>
                </form>
              </div>
            )}

            {addresses.length === 0 && !showAddressForm && (
              <p className="text-gray-400 text-center py-8">Belum ada alamat tersimpan</p>
            )}

            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className={`rounded-xl border p-4 bg-white ${addr.is_default ? "border-emerald-400" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <MapPin className={`h-5 w-5 mt-0.5 ${addr.is_default ? "text-emerald-600" : "text-gray-400"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{addr.label || "Alamat"}</span>
                          {addr.is_default && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Utama</span>}
                        </div>
                        {addr.recipient_name && <p className="text-sm text-gray-600">{addr.recipient_name}</p>}
                        <p className="text-sm text-gray-500">{addr.street_address}, {addr.city}</p>
                        <p className="text-sm text-gray-500">{addr.province} {addr.postal_code}</p>
                        {addr.phone && <p className="text-xs text-gray-400">Telp: {addr.phone}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!addr.is_default && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={async () => { await setDefaultAddress(addr.id); router.refresh() }}>
                          <Star className="h-4 w-4 text-gray-400" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingAddress(addr); setShowAddressForm(true) }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <form action={deleteAddress.bind(null, addr.id)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
