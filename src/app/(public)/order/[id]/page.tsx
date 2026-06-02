import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import OrderDetailClient from "./order-detail-client"

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: "Detail Pesanan",
}

export default async function OrderDetailPage({ params }: Props) {
  const supabase = await createServerSupabaseClient()
  const { id } = await params

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*), shipping_address:addresses(*)")
    .eq("id", id)
    .single()

  if (!order) notFound()

  return <OrderDetailClient order={order as any} />
}
