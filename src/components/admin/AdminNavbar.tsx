'use client'

import { Menu, LogOut, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from './AdminSidebar'

export default function AdminNavbar() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <Link
        href="/admin/guide"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
        title="Petunjuk Penggunaan"
      >
        <HelpCircle className="h-4 w-4" />
      </Link>

      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut className="h-5 w-5" />
      </Button>
    </header>
  )
}
