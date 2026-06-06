-- ============================================================
-- Phase 2: Product Variants + Coupons + Profile + Cart Items
-- ============================================================

-- 1. Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  price_adjustment DECIMAL(12,2) DEFAULT 0,
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- 2. Add variant_id to cart_items
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL;

-- 3. Add variant info to order_items
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variant_name VARCHAR(255);

-- 4. Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value DECIMAL(12,2) NOT NULL DEFAULT 0,
  min_purchase DECIMAL(12,2) DEFAULT 0,
  max_discount DECIMAL(12,2),
  usage_limit INT DEFAULT 0,
  used_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  discount_amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order ON coupon_usage(order_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user ON coupon_usage(user_id);

-- 5. Add discount to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(12,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL;

-- 6. Update profile with additional fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male', 'female'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 7. RLS for product_variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public active variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all variants" ON product_variants FOR ALL USING (public.is_admin());
CREATE POLICY "Public active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin all coupons" ON coupons FOR ALL USING (public.is_admin());
CREATE POLICY "Users own usage" ON coupon_usage FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admin all usage" ON coupon_usage FOR ALL USING (public.is_admin());

-- 8. Triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_variants_updated_at
  BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 9. Default coupon data
INSERT INTO coupons (code, type, value, min_purchase, max_discount, usage_limit, is_active, expires_at) VALUES
('WELCOME10', 'percentage', 10, 50000, 50000, 100, true, NOW() + INTERVAL '90 days'),
('FREEONGKIR', 'free_shipping', 0, 100000, NULL, 50, true, NOW() + INTERVAL '30 days'),
('DISKON20', 'fixed', 20000, 150000, NULL, 30, true, NOW() + INTERVAL '60 days')
ON CONFLICT (code) DO NOTHING;
