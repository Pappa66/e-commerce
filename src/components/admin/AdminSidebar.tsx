'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Tags, Image as ImageIcon, ShoppingCart, Settings, ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/banners', label: 'Banner', icon: ImageIcon },
  { href: '/admin/orders', label: 'Pesanan', icon: ShoppingCart },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-white min-h-screen">
      <div className="p-4 border-b">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-emerald-600">D2C</span>
          <span>Pro</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map(link => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Ke Toko
        </Link>
      </div>
    </aside>
  )
}
