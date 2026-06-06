'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Menu, X, User, LogOut, Package, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/hooks/use-cart'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/search', label: 'Katalog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = useCart(s => s.getItemCount())
  const fetchCart = useCart(s => s.fetchCart)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles').select('role').eq('id', data.user.id).single().then(({ data: profile }) => {
          setIsAdmin(profile?.role === 'admin')
        })
      }
    })
    fetchCart()
  }, [fetchCart])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    router.push('/')
    router.refresh()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-emerald-600">D2C</span>
          <span>Pro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-emerald-600',
                pathname === link.href ? 'text-emerald-600' : 'text-gray-700'
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-emerald-600">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-[200px] pl-9 h-9 text-sm"
              />
            </div>
          </form>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <Package className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block">
              <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Masuk
              </Button>
            </Link>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-6">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9"
                    />
                  </div>
                </form>
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'text-sm font-medium py-2',
                      pathname === link.href ? 'text-emerald-600' : 'text-gray-700'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2">
                    Dashboard Admin
                  </Link>
                )}
                <hr />
                {user ? (
                  <>
                    <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2">
                      Favorit
                    </Link>
                    <Button variant="outline" onClick={() => { handleLogout(); setMobileMenuOpen(false) }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Masuk</Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
