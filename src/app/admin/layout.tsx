import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminNavbar from "@/components/admin/AdminNavbar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") redirect("/")

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
