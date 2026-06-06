-- ============================================================
-- SEED DATA - D2C Pro E-Commerce
-- Jalankan SETELAH schema migration sukses
-- ============================================================

-- 0. Hapus user admin lama (kalau ada)
DELETE FROM auth.users WHERE email = 'admin@d2cpro.com';

-- 1. Buat Admin User
-- Password di-hash pakai bcrypt via pgcrypto
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@d2cpro.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  jsonb_build_object('full_name', 'Admin Toko', 'role', 'admin'),
  now(),
  now()
);

-- Trigger on_auth_user_created otomatis bikin profile
-- Tinggal update role-nya jadi admin
UPDATE profiles SET role = 'admin' WHERE email = 'admin@d2cpro.com';

-- 2. Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Hijab', 'hijab', 'Koleksi hijab modern untuk sehari-hari', 1),
('Gamis', 'gamis', 'Gamis elegan untuk berbagai acara', 2),
('Batik Muslim', 'batik-muslim', 'Batik casual dengan sentuhan modern', 3),
('Aksesoris', 'aksesoris', 'Lengkapi penampilan dengan aksesoris', 4),
('Perlengkapan Sholat', 'perlengkapan-sholat', 'Mukena, sajadah, dan perlengkapan ibadah', 5);

-- 3. Products
INSERT INTO products (name, slug, description, category_id, base_price, profit_margin, tax_rate, final_price, stock, weight_grams, is_featured, images, meta_title, meta_description, meta_keywords) VALUES
(
  'Hijab Kalisha Premium',
  'hijab-kalisha-premium',
  'Hijab instan berbahan jersey premium yang adem dan tidak menerawang. Cocok untuk daily wear dengan nyaman sepanjang hari. Tersedia dalam berbagai warna cerah dan earth tone.',
  (SELECT id FROM categories WHERE slug = 'hijab'),
  75000, 20, 11, 99900, 50, 150, true,
  ARRAY['https://images.unsplash.com/photo-1605600659873-12a5b48218d9'],
  'Hijab Kalisha Premium - Hijab Instan Jersey Adem | D2C Pro',
  'Hijab Kalisha Premium bahan jersey adem tidak menerawang, nyaman dipakai sehari-hari. Tersedia berbagai warna. FREE COD dan gratis ongkir.',
  'hijab kalisha, hijab premium, hijab jersey, hijab instan'
),
(
  'Gamis Zara Exclusive',
  'gamis-zara-exclusive',
  'Gamis modern dengan potongan A-line yang flowly. Menggunakan kain viscose premium yang jatuh dan tidak mudah kusut. Detail payet halus di bagian dada memberikan kesan mewah.',
  (SELECT id FROM categories WHERE slug = 'gamis'),
  185000, 15, 11, 236000, 30, 400, true,
  ARRAY['https://images.unsplash.com/photo-1605600659873-12a5b48218d9'],
  'Gamis Zara Exclusive - Gamis Modern A-Line Viscose Premium | D2C Pro',
  'Gamis Zara Exclusive bahan viscose premium jatuh dan tidak mudah kusut. Detail payet halus. Cocok untuk acara formal dan semi-formal.',
  'gamis modern, gamis viscose, gamis payet, gamis exclusive'
),
(
  'Batik Pria Athaya',
  'batik-pria-athaya',
  'Batik pria modern dengan desain kontemporer yang tetap mempertahankan nilai tradisional. Bahan katun primissima yang adem dan nyaman. Cocok untuk acara formal dan semi-formal.',
  (SELECT id FROM categories WHERE slug = 'batik-muslim'),
  135000, 18, 11, 175000, 40, 300, true,
  ARRAY['https://images.unsplash.com/photo-1605600659873-12a5b48218d9'],
  'Batik Pria Athaya - Batik Modern Katun Primissima | D2C Pro',
  'Batik pria modern desain kontemporer bahan katun primissima adem. Cocok untuk acara formal dan semi-formal. Tersedia berbagai ukuran S-XXXL.',
  'batik pria, batik modern, batik katun, batik formal'
),
(
  'Mukena Travel Syar''i',
  'mukena-travel-syari',
  'Mukena travel bahan katun Japan yang super lembut dan ringan. Dilengkapi tas travel matching. Praktis dibawa kemana-mana, cocok untuk muslimah modern yang aktif.',
  (SELECT id FROM categories WHERE slug = 'perlengkapan-sholat'),
  155000, 22, 11, 207000, 25, 350, true,
  ARRAY['https://images.unsplash.com/photo-1605600659873-12a5b48218d9'],
  'Mukena Travel Syari - Mukena Katun Japan Soft | D2C Pro',
  'Mukena travel katun Japan super lembut dan ringan lengkap tas matching. Praktis untuk perjalanan. Cocok muslimah modern.',
  'mukena travel, mukena katun japan, mukena soft, perlengkapan sholat'
),
(
  'Hijab Pashmina Ceruty',
  'hijab-pashmina-ceruty',
  'Pashmina ceruty silk dengan tekstur mengkilap elegan. Mudah dibentuk dan tidak licin saat dipakai. Tersedia 15 varian warna soft yang cocok untuk acara formal.',
  (SELECT id FROM categories WHERE slug = 'hijab'),
  65000, 25, 11, 90400, 60, 120, false,
  ARRAY['https://images.unsplash.com/photo-1605600659873-12a5b48218d9'],
  'Hijab Pashmina Ceruty Silk - Pashmina Elegan | D2C Pro',
  'Pashmina ceruty silk tekstur mengkilap elegan, mudah dibentuk. 15 varian warna soft. Cocok untuk acara formal dan kondangan.',
  'pashmina ceruty, pashmina silk, hijab formal, pashmina kondangan'
),
(
  'Gamis Alisha Brukat',
  'gamis-alisha-brukat',
  'Gamis brukat dengan kombinasi lace dan tile yang anggun. Potongan pas di badan dengan flare di bagian bawah. Dilengkapi inner dan belt matching.',
  (SELECT id FROM categories WHERE slug = 'gamis'),
  250000, 20, 11, 333000, 20, 450, true,
  ARRAY['https://images.unsplash.com/photo-1605600659873-12a5b48218d9'],
  'Gamis Alisha Brukat - Gamis Lace Anggun | D2C Pro',
  'Gamis brukat lace anggun dengan kombinasi tile. Dilengkapi inner dan belt matching. Cocok untuk acara spesial dan wedding.',
  'gamis brukat, gamis lace, gamis wedding, gamis anggun'
),
(
  'Brooch Hijab Mutiara',
  'brooch-hijab-mutiara',
  'Brooch hijab dengan taburan mutiara sintetis berkualitas tinggi. Desain vintage modern yang cocok untuk pashmina dan hijab instan. Menjadi pemanis penampilan hijab Anda.',
  (SELECT id FROM categories WHERE slug = 'aksesoris'),
  35000, 30, 11, 50100, 100, 20, false,
  ARRAY['https://images.unsplash.com/photo-1605600659873-12a5b48218d9'],
  'Brooch Hijab Mutiara - Aksesoris Hijab Vintage | D2C Pro',
  'Brooch hijab mutiara sintetis berkualitas. Desain vintage modern. Pemanis penampilan hijab untuk pashmina dan hijab instan.',
  'brooch hijab, aksesoris hijab, brooch mutiara, bros hijab'
),
(
  'Sajadah Travel Premium',
  'sajadah-travel-premium',
  'Sajadah travel dengan bahan microfiber premium yang super lembut dan anti air. Dilengkapi tas selempang matching. Praktis dibawa bepergian dengan ukuran compact 60x110cm.',
  (SELECT id FROM categories WHERE slug = 'perlengkapan-sholat'),
  85000, 15, 11, 108600, 45, 250, false,
  ARRAY['https://images.unsplash.com/photo-1605600659873-12a5b48218d9'],
  'Sajadah Travel Premium - Sajadah Microfiber Anti Air | D2C Pro',
  'Sajadah travel microfiber premium anti air. Super lembut dan praktis. Ukuran compact 60x110cm. Lengkap tas selempang.',
  'sajadah travel, sajadah anti air, sajadah microfiber, perlengkapan sholat'
);

-- 4. Banners
INSERT INTO banners (title, subtitle, image_url, link_url, sort_order) VALUES
('Koleksi Hijab Terbaru', 'Tampil stylish dengan hijab modern kami, adem dan nyaman sepanjang hari', 'https://images.unsplash.com/photo-1605600659873-12a5b48218d9', '/kategori/hijab', 1),
('Gamis Spesial Ramadan', 'Sambut bulan penuh berkah dengan gamis elegan dari koleksi terbaru', 'https://images.unsplash.com/photo-1605600659873-12a5b48218d9', '/kategori/gamis', 2),
('Bebas Ongkir + COD', 'Nikmati belanja tanpa khawatir. Bayar di tempat dan gratis ongkir!', 'https://images.unsplash.com/photo-1605600659873-12a5b48218d9', '/search', 3);
