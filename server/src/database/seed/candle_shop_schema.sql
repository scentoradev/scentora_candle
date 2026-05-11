-- Candle Shop PostgreSQL Schema
-- Includes Google login support, email verification, ecommerce core tables, indexes, and updated_at triggers.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- ENUM TYPES
-- =========================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'PENDING_PAYMENT',
    'WAITING_ADMIN_CONFIRM',
    'CONTACTED_CUSTOMER',
    'READY_TO_SHIP',
    'SHIPPING',
    'COMPLETED',
    'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('UNPAID', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_provider_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE inventory_log_type AS ENUM ('IN', 'OUT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE discount_type AS ENUM ('PERCENT', 'FIXED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =========================
-- UPDATED_AT TRIGGER
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================contr
-- USERS / AUTH
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NULL,
  google_id VARCHAR(255) UNIQUE NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(30),
  role user_role NOT NULL DEFAULT 'user',
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  ip_address VARCHAR(100),
  user_agent TEXT,
  expired_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(10) NOT NULL,
  expired_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- CATEGORIES / PRODUCTS
-- =========================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  scent VARCHAR(255),
  burn_time INT CHECK (burn_time IS NULL OR burn_time >= 0),
  weight INT CHECK (weight IS NULL OR weight >= 0),
  thumbnail_url TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- CART / ADDRESSES
-- =========================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT cart_owner_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TRIGGER trg_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  province VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  ward VARCHAR(255) NOT NULL,
  address_line TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_addresses_updated_at
BEFORE UPDATE ON addresses
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================
-- ORDERS / PAYMENTS
-- =========================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  order_code VARCHAR(50) NOT NULL UNIQUE,
  status order_status NOT NULL DEFAULT 'PENDING_PAYMENT',
  payment_status payment_status NOT NULL DEFAULT 'UNPAID',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  note TEXT,
  admin_note TEXT,
  paid_at TIMESTAMP NULL,
  shipped_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(12,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL DEFAULT 'OTHER',
  transaction_id VARCHAR(255),
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  status payment_provider_status NOT NULL DEFAULT 'PENDING',
  raw_response JSONB,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- REVIEWS / INVENTORY / COUPONS
-- =========================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE TRIGGER trg_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type inventory_log_type NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  reason VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(12,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (min_order_amount >= 0),
  usage_limit INT CHECK (usage_limit IS NULL OR usage_limit >= 0),
  used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  expired_at TIMESTAMP NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_coupons_updated_at
BEFORE UPDATE ON coupons
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================
-- INDEXES
-- =========================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- =========================
-- SEED SAMPLE DATA
-- =========================
INSERT INTO categories (name, slug, description)
VALUES
  ('Soy Candle', 'soy-candle', 'Nến sáp đậu nành tự nhiên'),
  ('Scented Candle', 'scented-candle', 'Nến thơm nhiều mùi hương'),
  ('Gift Set', 'gift-set', 'Set quà tặng nến thơm')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  category_id,
  name,
  slug,
  short_description,
  description,
  price,
  stock,
  scent,
  burn_time,
  weight,
  thumbnail_url,
  is_active
)
SELECT
  c.id,
  'Lavender Soy Candle',
  'lavender-soy-candle',
  'Nến thơm lavender thư giãn',
  'Nến sáp đậu nành mùi lavender, phù hợp phòng ngủ và không gian thư giãn.',
  250000,
  20,
  'Lavender',
  40,
  200,
  '/images/lavender-soy-candle.jpg',
  TRUE
FROM categories c
WHERE c.slug = 'soy-candle'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  category_id,
  name,
  slug,
  short_description,
  description,
  price,
  stock,
  scent,
  burn_time,
  weight,
  thumbnail_url,
  is_active
)
SELECT
  c.id,
  'Vanilla Gift Set',
  'vanilla-gift-set',
  'Set quà nến thơm vanilla',
  'Bộ quà tặng gồm nến vanilla, thiệp và hộp quà.',
  420000,
  10,
  'Vanilla',
  35,
  300,
  '/images/vanilla-gift-set.jpg',
  TRUE
FROM categories c
WHERE c.slug = 'gift-set'
ON CONFLICT (slug) DO NOTHING;

