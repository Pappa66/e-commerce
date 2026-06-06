import Link from 'next/link'
import { Store } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
              <div className="h-8 w-8 rounded-xl bg-brand-gradient flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-gradient">D2C Pro</span>
            </Link>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              Platform e-commerce D2C untuk brand mandiri. Bebas dari biaya marketplace yang melambung.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Belanja</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search" className="text-gray-500 hover:text-emerald-600 transition-colors">Semua Produk</Link></li>
              <li><Link href="/search?sort=newest" className="text-gray-500 hover:text-emerald-600 transition-colors">Produk Terbaru</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Bantuan</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/faq" className="text-gray-500 hover:text-emerald-600 transition-colors">FAQ</Link></li>
              <li><Link href="/cart" className="text-gray-500 hover:text-emerald-600 transition-colors">Keranjang</Link></li>
              <li><span className="text-gray-300">Syarat & Ketentuan</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <span className="inline-block h-6 w-6 rounded-lg bg-emerald-50 flex items-center justify-center text-xs">📧</span>
                hello@d2cpro.com
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-6 w-6 rounded-lg bg-emerald-50 flex items-center justify-center text-xs">💬</span>
                0812-3456-7890
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-50 mt-10 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} D2C Pro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
