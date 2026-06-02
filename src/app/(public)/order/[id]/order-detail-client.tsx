'use client'

import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Clock, Package, Truck, MapPin, CreditCard, AlertCircle } from "lucide-react"
import { formatPrice, getImageUrl } from "@/lib/utils"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_METHOD_LABELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import type { Order } from "@/types/database"

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: AlertCircle,
}

const statusSteps = ["pending", "confirmed", "processing", "shipped", "delivered"]

export default function OrderDetailClient({ order }: { order: Order }) {
  const currentStepIndex = statusSteps.indexOf(order.status)
  const StatusIcon = statusIcons[order.status] || Clock

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/" className="text-sm text-emerald-600 hover:underline">&larr; Kembali ke Toko</Link>
      </div>

      <div className="rounded-xl border p-6 bg-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Pesanan #{order.order_number}</h1>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString("id-ID", {
                year: "numeric", month: "long", day: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
            <span className="flex items-center gap-1">
              <StatusIcon className="h-4 w-4" />
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </span>
        </div>

        {/* Status Tracker */}
        {order.status !== "cancelled" && (
          <div className="flex items-center gap-1 my-6">
            {statusSteps.map((step, i) => {
              const isComplete = i <= currentStepIndex
              const isCurrent = i === currentStepIndex
              return (
                <div key={step} className="flex-1 flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${isComplete ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                    {i + 1}
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`flex-1 h-1 ${isComplete && i < currentStepIndex ? "bg-emerald-600" : "bg-gray-200"}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {order.shipping_tracking_number && (
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 flex items-center gap-2 mb-4">
            <Truck className="h-4 w-4" />
            <span>
              Tracking: <strong>{order.shipping_tracking_number}</strong> ({order.shipping_courier} - {order.shipping_service})
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold">Alamat Pengiriman</h3>
          </div>
          {order.shipping_address && (
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-800">{order.shipping_address.recipient_name || "Penerima"}</p>
              <p>{order.shipping_address.street_address}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.province}</p>
              {order.shipping_address.phone && <p>Telp: {order.shipping_address.phone}</p>}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold">Pembayaran</h3>
          </div>
          <div className="text-sm text-gray-600">
            <p>Metode: {PAYMENT_METHOD_LABELS[order.payment_method] || order.payment_method}</p>
            <p>Status: <span className={`font-medium ${order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}`}>{order.payment_status === "paid" ? "Lunas" : order.payment_status === "unpaid" ? "Belum Dibayar" : order.payment_status}</span></p>
            {order.paid_at && <p>Dibayar: {new Date(order.paid_at).toLocaleDateString("id-ID")}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-6 bg-white">
        <h3 className="font-semibold mb-4">Produk Dipesan</h3>
        <div className="space-y-4">
          {order.items?.map(item => (
            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image src={getImageUrl(item.product_image)} alt={item.product_name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.product_name}</p>
                <p className="text-xs text-gray-500">{item.quantity}x {formatPrice(item.unit_price)}</p>
              </div>
              <p className="font-medium text-sm">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Ongkos Kirim</span><span>{formatPrice(order.shipping_cost)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Pajak</span><span>{formatPrice(order.tax_amount)}</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-emerald-600">{formatPrice(order.total_amount)}</span></div>
        </div>

        {order.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <span className="font-medium">Catatan:</span> {order.notes}
          </div>
        )}
      </div>

      {order.status === "delivered" && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-green-800">Pesanan Selesai</h3>
          <p className="text-sm text-green-600 mt-1">Terima kasih telah berbelanja!</p>
        </div>
      )}
    </div>
  )
}
