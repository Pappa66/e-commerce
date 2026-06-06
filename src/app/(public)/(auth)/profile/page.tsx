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
import { Pencil, Trash2, Plus, Star, MapPin, User, Package, Heart, LogOut, Camera, Mail, Phone, Cake, ChevronRight } from "lucide-react"
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
    const supabase = createClient()
    const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    if (p) setProfile(p as Profile)
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
    <div className="min-h-[80vh] bg-gradient-to-b from-emerald-50/50 to-white">
      {/* Header Banner */}
      <div className="bg-brand-gradient text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 rounded-full border-4 border-white/30 overflow-hidden bg-white/20 flex items-center justify-center shadow-lg">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {(profile?.full_name || user.email)?.[0]?.toUpperCase() || "U"}
                </span>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 cursor-pointer transition-opacity rounded-full">
                <Camera className="h-6 w-6 text-white" />
                <input type="file" accept="image/*" className="hidden" form="profile-form" name="avatar_file" />
              </label>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{profile?.full_name || "Pengguna"}</h1>
              <p className="text-emerald-100 text-sm flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
              {profile?.phone && (
                <p className="text-emerald-100 text-sm flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5" /> {profile.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link href="/order" className="bg-white rounded-xl p-4 elevated-shadow text-center hover:shadow-lg transition-shadow">
            <Package className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Pesanan</p>
          </Link>
          <Link href="/wishlist" className="bg-white rounded-xl p-4 elevated-shadow text-center hover:shadow-lg transition-shadow">
            <Heart className="h-5 w-5 text-rose-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Favorit</p>
          </Link>
          <div className="bg-white rounded-xl p-4 elevated-shadow text-center">
            <MapPin className="h-5 w-5 text-amber-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">{addresses.length} Alamat</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 elevated-shadow">
          <button onClick={() => setTab("profile")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${tab === "profile" ? "bg-brand-gradient text-white shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>
            <User className="h-4 w-4 inline mr-1.5" /> Profil
          </button>
          <button onClick={() => setTab("addresses")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${tab === "addresses" ? "bg-brand-gradient text-white shadow-sm" : "text-gray-600 hover:text-gray-800"}`}>
            <MapPin className="h-4 w-4 inline mr-1.5" /> Alamat
          </button>
        </div>

        {tab === "profile" && (
          <div className="bg-white rounded-2xl p-6 elevated-shadow mb-8">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Informasi Akun
            </h2>
            <form id="profile-form" onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
              <div>
                <Label htmlFor="full_name" className="text-sm font-medium">Nama Lengkap</Label>
                <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ""} placeholder="Nama Anda" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input id="email" value={user.email} disabled className="mt-1.5 bg-gray-50 text-gray-500" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">No. Telepon</Label>
                <Input id="phone" name="phone" defaultValue={profile?.phone || ""} placeholder="0812..." className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="avatar_file" className="text-sm font-medium">Foto Profil</Label>
                <Input id="avatar_file" name="avatar_file" type="file" accept="image/*" className="mt-1.5 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender" className="text-sm font-medium">Jenis Kelamin</Label>
                  <Select name="gender" defaultValue={profile?.gender || ""}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="birth_date" className="text-sm font-medium">Tanggal Lahir</Label>
                  <Input id="birth_date" name="birth_date" type="date" defaultValue={profile?.birth_date || ""} className="mt-1.5" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-brand-gradient hover:opacity-90 text-white shadow-sm mt-2">
                Simpan Perubahan
              </Button>
            </form>
          </div>
        )}

        {tab === "addresses" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Alamat Saya
              </h2>
              {!showAddressForm && (
                <Button onClick={() => { setEditingAddress(null); setShowAddressForm(true) }} className="bg-brand-gradient hover:opacity-90 text-white shadow-sm text-sm h-9">
                  <Plus className="h-4 w-4 mr-1.5" /> Tambah
                </Button>
              )}
            </div>

            {showAddressForm && (
              <div className="bg-white rounded-2xl p-6 elevated-shadow mb-4">
                <h3 className="font-semibold mb-5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {editingAddress ? "Edit Alamat" : "Alamat Baru"}
                </h3>
                <form onSubmit={handleSaveAddress} className="space-y-3 max-w-lg">
                  {editingAddress && <input type="hidden" name="id" value={editingAddress.id} />}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium">Label</Label>
                      <Select name="label" defaultValue={editingAddress?.label || ""}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih label" /></SelectTrigger>
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
                      <Label className="text-xs font-medium">Nama Penerima</Label>
                      <Input name="recipient_name" defaultValue={editingAddress?.recipient_name || ""} placeholder="Nama" className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium">No. Telepon</Label>
                      <Input name="phone" defaultValue={editingAddress?.phone || ""} placeholder="0812..." className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Provinsi</Label>
                      <Select name="province" defaultValue={editingAddress?.province || ""}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih" /></SelectTrigger>
                        <SelectContent>
                          {INDONESIAN_PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium">Kota</Label>
                      <Input name="city" defaultValue={editingAddress?.city || ""} placeholder="Kota" required className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">Kecamatan</Label>
                      <Input name="district" defaultValue={editingAddress?.district || ""} placeholder="Kecamatan" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium">Alamat Lengkap</Label>
                    <Input name="street_address" defaultValue={editingAddress?.street_address || ""} placeholder="Jl. ... No. ..." required className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium">Kode Pos</Label>
                      <Input name="postal_code" defaultValue={editingAddress?.postal_code || ""} placeholder="12345" className="mt-1" />
                    </div>
                    <label className="flex items-center gap-2 pt-5 cursor-pointer">
                      <input type="checkbox" name="is_default" defaultChecked={editingAddress?.is_default} className="rounded text-emerald-600" />
                      <span className="text-sm text-gray-600">Jadikan alamat utama</span>
                    </label>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button type="submit" className="bg-brand-gradient hover:opacity-90 text-white shadow-sm">
                      {editingAddress ? "Simpan" : "Tambah"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowAddressForm(false); setEditingAddress(null) }}>Batal</Button>
                  </div>
                </form>
              </div>
            )}

            {addresses.length === 0 && !showAddressForm && (
              <div className="bg-white rounded-2xl p-10 elevated-shadow text-center">
                <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada alamat tersimpan</p>
                <Button onClick={() => { setEditingAddress(null); setShowAddressForm(true) }} className="mt-4 bg-brand-gradient hover:opacity-90 text-white shadow-sm">
                  <Plus className="h-4 w-4 mr-1.5" /> Tambah Alamat
                </Button>
              </div>
            )}

            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className={`bg-white rounded-2xl p-5 elevated-shadow card-hover ${addr.is_default ? "ring-2 ring-emerald-500/30" : ""}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${addr.is_default ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{addr.label || "Alamat"}</span>
                          {addr.is_default && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Utama</span>}
                        </div>
                        {addr.recipient_name && <p className="text-sm text-gray-600 mt-0.5">{addr.recipient_name}</p>}
                        <p className="text-sm text-gray-500 mt-0.5">{addr.street_address}</p>
                        <p className="text-sm text-gray-500">{addr.city}, {addr.province} {addr.postal_code}</p>
                        {addr.phone && <p className="text-xs text-gray-400 mt-0.5">📞 {addr.phone}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4 shrink-0">
                      {!addr.is_default && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-amber-500" onClick={async () => { await setDefaultAddress(addr.id); router.refresh() }}>
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-600" onClick={() => { setEditingAddress(addr); setShowAddressForm(true) }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <form action={deleteAddress.bind(null, addr.id)}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
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
