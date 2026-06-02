'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/lib/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatPrice, getImageUrl } from "@/lib/utils"
import { PAYMENT_METHOD_LABELS, INDONESIAN_PROVINCES } from "@/lib/constants"
import { createOrder } from "@/lib/actions"
import { toast } from "sonner"
import { ArrowLeft, MapPin, CreditCard, Truck, Shield } from "lucide-react"
import Link from "next/link"
import type { Address } from "@/types/database"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, getItemCount } = useCart()
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // New address form
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    label: "",
    recipient_name: "",
    phone: "",
    street_address: "",
    city: "",
    district: "",
    province: "",
    postal_code: "",
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login")
        return
      }
      setUser(data.user)
      supabase.from("addresses").select("*").eq("user_id", data.user.id).then(({ data: addrs }) => {
        if (addrs) {
          setAddresses(addrs as Address[])
          const defaultAddr = addrs.find(a => a.is_default) || addrs[0]
          if (defaultAddr) setSelectedAddress(defaultAddr.id)
        }
      })
    })
  }, [router])

  const handleSaveAddress = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      ...newAddress,
    }).select().single()

    if (error) {
      toast.error("Gagal menyimpan alamat")
      return
    }

    toast.success("Alamat berhasil disimpan")
    setShowNewAddress(false)
    setNewAddress({ label: "", recipient_name: "", phone: "", street_address: "", city: "", district: "", province: "", postal_code: "" })
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id)
    if (data) setAddresses(data as Address[])
  }

  const handleSubmit = async () => {
    if (!selectedAddress) {
      toast.error("Pilih alamat pengiriman")
      return
    }
    if (items.length === 0) {
      toast.error("Keranjang belanja kosong")
      return
    }

    setSubmitting(true)
    const cartItems = items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.product?.name || "",
      image: item.product?.images?.[0] || "",
      price: item.product?.final_price || 0,
    }))

    const result = await createOrder(cartItems, selectedAddress, paymentMethod, notes)
    setSubmitting(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success("Pesanan berhasil dibuat!")
    router.push(`/order/${result.orderId}`)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">Keranjang belanja kosong</p>
        <Link href="/search"><Button>Mulai Belanja</Button></Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <div className="rounded-xl border p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <h2 className="font-semibold text-lg">Alamat Pengiriman</h2>
            </div>

            {addresses.length > 0 && !showNewAddress ? (
              <div className="space-y-3">
                {addresses.map(addr => (
                  <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedAddress === addr.id ? "border-emerald-500 bg-emerald-50" : "hover:bg-gray-50"}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={e => setSelectedAddress(e.target.value)} className="mt-1" />
                    <div>
                      <p className="font-medium text-sm">{addr.label || "Alamat"}</p>
                      <p className="text-sm text-gray-600">{addr.street_address}, {addr.city}, {addr.province} {addr.postal_code}</p>
                      {addr.phone && <p className="text-xs text-gray-400">Telp: {addr.phone}</p>}
                    </div>
                  </label>
                ))}
                <Button variant="outline" size="sm" onClick={() => setShowNewAddress(true)}>+ Tambah Alamat Baru</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Label (Rumah/Kantor)</Label>
                    <Input value={newAddress.label} onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))} placeholder="Rumah" />
                  </div>
                  <div>
                    <Label>Nama Penerima</Label>
                    <Input value={newAddress.recipient_name} onChange={e => setNewAddress(p => ({ ...p, recipient_name: e.target.value }))} placeholder="Nama" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>No. Telepon</Label>
                    <Input value={newAddress.phone} onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))} placeholder="0812..." />
                  </div>
                  <div>
                    <Label>Provinsi</Label>
                    <select value={newAddress.province} onChange={e => setNewAddress(p => ({ ...p, province: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                      <option value="">Pilih Provinsi</option>
                      {INDONESIAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Kota</Label>
                    <Input value={newAddress.city} onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))} placeholder="Kota" />
                  </div>
                  <div>
                    <Label>Kecamatan</Label>
                    <Input value={newAddress.district} onChange={e => setNewAddress(p => ({ ...p, district: e.target.value }))} placeholder="Kecamatan" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Alamat Lengkap</Label>
                    <Input value={newAddress.street_address} onChange={e => setNewAddress(p => ({ ...p, street_address: e.target.value }))} placeholder="Jl. ..." />
                  </div>
                  <div>
                    <Label>Kode Pos</Label>
                    <Input value={newAddress.postal_code} onChange={e => setNewAddress(p => ({ ...p, postal_code: e.target.value }))} placeholder="12345" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveAddress} className="bg-emerald-600 hover:bg-emerald-700">Simpan Alamat</Button>
                  {addresses.length > 0 && <Button variant="outline" onClick={() => setShowNewAddress(false)}>Batal</Button>}
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-xl border p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              <h2 className="font-semibold text-lg">Metode Pembayaran</h2>
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${paymentMethod === "cod" ? "border-emerald-500 bg-emerald-50" : "hover:bg-gray-50"}`}>
                <RadioGroupItem value="cod" id="cod" />
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-sm">Cash on Delivery (COD)</p>
                    <p className="text-xs text-gray-400">Bayar saat barang diterima</p>
                  </div>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${paymentMethod === "midtrans" ? "border-emerald-500 bg-emerald-50" : "hover:bg-gray-50"}`}>
                <RadioGroupItem value="midtrans" id="midtrans" />
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Kartu / Virtual Account (Midtrans)</p>
                    <p className="text-xs text-gray-400">Pembayaran instan via Midtrans</p>
                  </div>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="rounded-xl border p-6 bg-white">
            <Label>Catatan Pesanan (opsional)</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Catatan untuk penjual..." className="mt-2" rows={3} />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border p-6 bg-white sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Ringkasan Belanja ({getItemCount()} item)</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <Image src={getImageUrl(item.product?.images?.[0] || null)} alt={item.product?.name || ""} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-2">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity}x {formatPrice(item.product?.final_price || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(getTotal())}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Ongkos Kirim</span><span className="text-gray-400">Dihitung nanti</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-emerald-600">{formatPrice(getTotal())}</span></div>
            </div>
            <Button
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
              size="lg"
              disabled={submitting || !selectedAddress}
              onClick={handleSubmit}
            >
              {submitting ? "Memproses..." : "Buat Pesanan"}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">Dengan membuat pesanan, Anda menyetujui syarat & ketentuan kami</p>
          </div>
        </div>
      </div>
    </div>
  )
}
