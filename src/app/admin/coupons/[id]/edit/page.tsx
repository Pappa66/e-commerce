import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import CouponForm from "@/components/admin/CouponForm"

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Edit Kupon - Admin" }

export default async function EditCouponPage({ params }: Props) {
  const supabase = await createServerSupabaseClient()
  const { id } = await params

  const { data: coupon } = await supabase.from("coupons").select("*").eq("id", id).single()
  if (!coupon) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Kupon</h1>
      <CouponForm coupon={coupon as any} />
    </div>
  )
}
