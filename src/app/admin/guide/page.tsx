import { Card } from "@/components/ui/card"

export const metadata = { title: "Petunjuk Penggunaan - Admin" }

export default function AdminGuidePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Petunjuk Penggunaan</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-3">Dashboard</h2>
          <p className="text-sm text-gray-600 mb-3">
            Halaman ini menampilkan ringkasan toko: total produk, pesanan terbaru, dan statistik.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-3">Produk</h2>
          <p className="text-sm text-gray-600 mb-3">
            Kelola semua produk di sini. Klik &ldquo;Tambah Produk&rdquo; untuk menambahkan produk baru.
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Nama Produk</strong> &mdash; Nama yang akan muncul di toko</li>
            <li><strong>Harga Dasar</strong> &mdash; Harga sebelum markup dan pajak</li>
            <li><strong>Margin Keuntungan</strong> &mdash; Persen keuntungan yang ditambahkan</li>
            <li><strong>Pajak (PPN)</strong> &mdash; Persen pajak yang diterapkan</li>
            <li><strong>Harga Final</strong> &mdash; Dihitung otomatis dari harga dasar + margin + pajak</li>
            <li><strong>Stok</strong> &mdash; Jumlah barang tersedia</li>
            <li><strong>Gambar</strong> &mdash; URL gambar produk (bisa dari internet atau upload)</li>
            <li><strong>Unggulan</strong> &mdash; Centang untuk tampil di halaman utama</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-3">Kategori</h2>
          <p className="text-sm text-gray-600 mb-3">
            Atur kategori untuk mengelompokkan produk. Produk bisa dilihat berdasarkan kategori di halaman toko.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-3">Banner</h2>
          <p className="text-sm text-gray-600 mb-3">
            Banner muncul di halaman utama. Setiap banner bisa memiliki:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Judul & Subtitle</strong> &mdash; Teks yang tampil di banner</li>
            <li><strong>URL Gambar</strong> &mdash; Gambar banner (rekomendasi ukuran 1200x450px)</li>
            <li><strong>Link URL</strong> &mdash; Halaman tujuan saat banner diklik</li>
            <li><strong>Urutan</strong> &mdash; Nomor urut tampilan banner</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-3">Pesanan</h2>
          <p className="text-sm text-gray-600 mb-3">
            Lihat dan kelola semua pesanan masuk. Status pesanan:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Menunggu Konfirmasi</strong> &mdash; Pesanan baru dari pelanggan</li>
            <li><strong>Dikonfirmasi</strong> &mdash; Pesanan sudah dikonfirmasi</li>
            <li><strong>Diproses</strong> &mdash; Pesanan sedang diproses</li>
            <li><strong>Dikirim</strong> &mdash; Pesanan sudah dikirim (input nomor resi)</li>
            <li><strong>Selesai</strong> &mdash; Pesanan sudah diterima</li>
            <li><strong>Dibatalkan</strong> &mdash; Pesanan dibatalkan</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-3">Landing Page</h2>
          <p className="text-sm text-gray-600 mb-3">
            Pilih template untuk halaman utama toko Anda:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>Default (Toko Online)</strong> &mdash; Tampilan toko dengan banner, kategori, dan produk unggulan</li>
            <li><strong>Single Product</strong> &mdash; Fokus pada satu produk tertentu, cocok untuk landing produk</li>
            <li><strong>Katalog</strong> &mdash; Tampilan katalog sederhana tanpa banner</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-lg mb-3">FAQ</h2>
          <p className="text-sm text-gray-600">
            Kelola pertanyaan yang sering diajukan pelanggan. FAQ akan tampil di halaman /faq untuk publik.
          </p>
        </Card>
      </div>
    </div>
  )
}
