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
import { createOrder, validateCoupon, createMidtransTransaction } from "@/lib/actions"
import { toast } from "sonner"
import { ArrowLeft, MapPin, CreditCard, Truck, Shield, Tag, X, Gift } from "lucide-react"
import Link from "next/link"
import type { Address, Coupon } from "@/types/database"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, getItemCount } = useCart()
  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Ship to different person
  const [shipToOther, setShipToOther] = useState(false)
  const [otherName, setOtherName] = useState("")
  const [otherPhone, setOtherPhone] = useState("")

  // Coupon
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)

  const subtotal = getTotal()
  const total = Math.max(0, subtotal - discountAmount)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return }
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error("Masukkan kode kupon"); return }
    setCouponLoading(true)
    const result = await validateCoupon(couponCode, subtotal)
    setCouponLoading(false)

    if (result.error) { toast.error(result.error); return }
    if (result.coupon) {
      setAppliedCoupon(result.coupon)
      setDiscountAmount(result.discountAmount || 0)
      toast.success(`Kupon ${result.coupon.code} berhasil diterapkan!`)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setCouponCode("")
  }

  const handleSubmit = async () => {
    if (!selectedAddress) { toast.error("Pilih alamat pengiriman"); return }
    if (items.length === 0) { toast.error("Keranjang belanja kosong"); return }

    setSubmitting(true)
    const cartItems = items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      name: item.product?.name || "",
      image: item.product?.images?.[0] || "",
      price: item.product?.final_price || 0,
      variant_name: (item as any).variant?.name || undefined,
    }))

    const result = await createOrder(cartItems, selectedAddress, paymentMethod, notes, appliedCoupon?.code)
    setSubmitting(false)

    if (result.error) { toast.error(result.error); return }
    toast.success("Pesanan berhasil dibuat!")

    if (paymentMethod === "midtrans") {
      const midtransResult = await createMidtransTransaction(result.orderId!)
      if (midtransResult.error) {
        toast.error(midtransResult.error)
        router.push(`/order/${result.orderId}`)
      } else if (midtransResult.redirect_url) {
        window.location.href = midtransResult.redirect_url
        return
      }
    } else {
      router.push(`/order/${result.orderId}`)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">Keranjang belanja kosong</p>
        <Link href="/search"><Button>Mulai Belanja</Button></Link>
      </div>
    )
  }

  const selectedAddr = addresses.find(a => a.id === selectedAddress)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className="text-gray-500 hover:text-gray-700"><ArrowLeft className="h-5 w-5" /></Link>
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

            {addresses.length > 0 ? (
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
                <Link href="/profile" className="text-xs text-emerald-600 hover:underline block text-right">
                  Kelola alamat di profil →
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 mb-2">Belum ada alamat tersimpan</p>
                <Link href="/profile">
                  <Button variant="outline" size="sm">Tambah Alamat di Profil</Button>
                </Link>
              </div>
            )}

            {/* Ship to different person */}
            {selectedAddr && (
              <div className="mt-4 pt-4 border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={shipToOther} onChange={e => setShipToOther(e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium">Kirim ke orang lain</span>
                </label>
                {shipToOther && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div><Label className="text-xs">Nama Penerima</Label><Input value={otherName} onChange={e => setOtherName(e.target.value)} placeholder="Nama penerima" /></div>
                    <div><Label className="text-xs">No. Telepon</Label><Input value={otherPhone} onChange={e => setOtherPhone(e.target.value)} placeholder="0812..." /></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="rounded-xl border p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-emerald-600" />
              <h2 className="font-semibold text-lg">Kupon / Voucher</h2>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700">{appliedCoupon.code}</p>
                    <p className="text-xs text-emerald-600">
                      Diskon {discountAmount > 0 ? formatPrice(discountAmount) : "Ongkos Kirim"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemoveCoupon}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Masukkan kode kupon" className="uppercase" />
                <Button variant="outline" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}>
                  {couponLoading ? "..." : "Pakai"}
                </Button>
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
                    <p className="font-medium text-sm">Midtrans (Semua Pembayaran)</p>
                    <p className="text-xs text-gray-400">Virtual Account, Kartu Kredit, GoPay, QRIS, Indomaret, Alfamart, dll</p>
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
                    {(item as any).variant?.name && <p className="text-xs text-gray-400">{(item as any).variant.name}</p>}
                    <p className="text-xs text-gray-500">{item.quantity}x {formatPrice(item.product?.final_price || 0)}</p>
                  </div>
                </div>
              ))}
            </div>

            {shipToOther && otherName && (
              <div className="text-xs text-gray-500 mb-3 pb-3 border-b">
                Dikirim ke: <span className="font-medium">{otherName}</span> {otherPhone && `(${otherPhone})`}
              </div>
            )}

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon Kupon</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-gray-600">Ongkos Kirim</span><span className="text-gray-400">Dihitung nanti</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-emerald-600">{formatPrice(Math.max(0, total))}</span>
              </div>
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
