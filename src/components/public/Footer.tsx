import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <span className="text-emerald-600">D2C</span>
              <span>Pro</span>
            </Link>
            <p className="text-sm text-gray-600">
              Platform e-commerce D2C untuk brand mandiri. Bebas dari biaya marketplace yang melambung.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Belanja</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/search" className="hover:text-emerald-600">Semua Produk</Link></li>
              <li><Link href="/search?sort=newest" className="hover:text-emerald-600">Produk Terbaru</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Bantuan</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/cart" className="hover:text-emerald-600">Keranjang</Link></li>
              <li><span className="text-gray-400">Cara Belanja</span></li>
              <li><span className="text-gray-400">Syarat & Ketentuan</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Kontak</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: hello@d2cpro.com</li>
              <li>WhatsApp: 0812-3456-7890</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
