# D2C Pro - E-Commerce Platform

Platform e-commerce D2C (Direct-to-Consumer) berbasis Next.js + Supabase untuk brand mandiri yang ingin menghindari biaya marketplace.

## Fitur Utama

- **Manajemen Konten Dinamis**: Banner slider, katalog produk dengan kategori
- **SEO Mandiri**: Meta title/description/keywords per produk, custom slug, sitemap.xml otomatis
- **Transaksi & Logistik**: Checkout sederhana, COD (Cash on Delivery), tracking pesanan
- **Admin Dashboard**: Manajemen produk, kategori, banner, dan pesanan

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: Zustand
- **Payment Gateway**: Midtrans (opsional)

## Prasyarat

- Node.js 18+
- Akun Supabase (gratis di https://supabase.com)

## Setup & Instalasi

### 1. Clone & Install Dependencies

```bash
git clone <repo-url> d2c-pro
cd d2c-pro
npm install
```

### 2. Setup Supabase

1. Buat project baru di https://supabase.com
2. Buka SQL Editor, jalankan `supabase/migrations/00001_schema.sql`
3. Buka SQL Editor, jalankan `supabase/seed.sql` (untuk data demo)
4. Buat user admin:
   - Buka **Authentication > Users > Add User**
   - Email: `admin@d2cpro.com`, Password: `admin123456`
   - Setelah user dibuat, jalankan query:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@d2cpro.com';
   ```

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Isi `.env.local` dengan credentials dari Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Jalankan Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 5. Akses Admin

Buka `/admin` dan login dengan akun admin.

## Struktur Proyek

```
src/
├── app/
│   ├── (public)/          # Halaman publik (home, produk, cart, checkout)
│   │   ├── (auth)/        # Login & Register
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── kategori/[slug]/
│   │   ├── order/[id]/
│   │   ├── produk/[slug]/
│   │   └── search/
│   ├── admin/             # Admin dashboard
│   │   ├── products/
│   │   ├── categories/
│   │   ├── banners/
│   │   └── orders/
│   ├── api/               # API routes
│   ├── sitemap.ts         # Sitemap generator
│   └── robots.ts          # Robots.txt
├── components/
│   ├── admin/             # Admin components
│   ├── public/            # Public components
│   └── ui/                # Shadcn components
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── actions.ts         # Server Actions
│   ├── constants.ts       # App constants
│   ├── hooks/             # Zustand stores
│   └── utils.ts           # Utility functions
├── types/
│   └── database.ts        # TypeScript types
└── supabase/
    ├── migrations/        # SQL schema
    └── seed.sql           # Demo data
```

## Fitur Detail

### Harga Produk dengan PPN 11%
- `final_price = base_price * (1 + profit_margin / 100) * (1 + tax_rate / 100)`
- Admin bisa atur margin profit per produk
- PPN default 11% (sesuai ketentuan Indonesia)

### SEO
- Meta Title & Description per produk
- Custom slug otomatis dari nama produk
- Sitemap.xml dinamis untuk semua produk & kategori
- Schema markup untuk Google Search Console

### COD (Cash on Delivery)
- Metode pembayaran utama untuk konversi tinggi
- Pelanggan bayar saat barang diterima
- Tracking status pesanan real-time

## Lisensi

Private - All rights reserved
