import CouponForm from "@/components/admin/CouponForm"

export const metadata = { title: "Tambah Kupon - Admin" }

export default function NewCouponPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tambah Kupon Baru</h1>
      <CouponForm />
    </div>
  )
}
