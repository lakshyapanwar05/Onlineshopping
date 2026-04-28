-- ============================================================
--  TheOutdoors — FRESH MIGRATION for Supabase
--  Run this in Supabase → SQL Editor → New Query → Run
--  This will DROP any existing conflicting tables to start fresh.
-- ============================================================

DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------
-- USERS 
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(120)  NOT NULL,
  email      VARCHAR(191)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------
-- PRODUCTS  (skip if exists)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  description TEXT,
  price       NUMERIC(10,2)  NOT NULL,
  category    VARCHAR(100)   NOT NULL,
  image_url   VARCHAR(500),
  stock       INTEGER        NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------
-- CART  (skip if exists)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER     NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  product_id INTEGER     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity   INTEGER     NOT NULL DEFAULT 1,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- ----------------------------------------------------------
-- ORDERS  (skip if exists)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2)  NOT NULL,
  status       VARCHAR(20)    NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------
-- PAYMENTS  (skip if exists)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id             SERIAL PRIMARY KEY,
  order_id       INTEGER        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount         NUMERIC(10,2)  NOT NULL,
  status         VARCHAR(20)    NOT NULL DEFAULT 'completed',
  payment_method VARCHAR(50)    NOT NULL,
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------
-- ORDER ITEMS  (skip if exists)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER        NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id INTEGER        NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity   INTEGER        NOT NULL,
  price      NUMERIC(10,2)  NOT NULL
);

-- ----------------------------------------------------------
-- VERIFY: show all tables created
-- ----------------------------------------------------------
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ----------------------------------------------------------
-- PRODUCTS SEED — 20 items
-- ON CONFLICT (id) DO NOTHING means:
--   • your existing products stay untouched
--   • only missing products get added
-- ----------------------------------------------------------
INSERT INTO products (id, name, description, price, category, image_url, stock) VALUES
(1,  'Alpine Storm Jacket',      'Waterproof GORE-TEX shell with articulated cut and thermal lining.',             289.00, 'Jackets',     '/images/jacket.png', 12),
(2,  'Tactical Trek Boots',      'Military-grade Vibram outsole, waterproof nubuck upper.',                        199.00, 'Footwear',    '/images/boots.png',  8),
(3,  'Summit Fleece Midlayer',   'Polartec 300 fleece, anti-pill finish, YKK zippers.',                            149.00, 'Fleece',      '/images/fleece.png', 20),
(4,  'Ultralight Daypack 22L',   'Roll-top ripstop nylon, hydration sleeve, purposeful pockets.',                  129.00, 'Bags',        '/images/bag.png',  15),
(5,  'Merino Base Layer',        '200gsm Merino, anti-odor, itch-free, machine washable.',                          89.00, 'Base Layers', '/images/baselayer.png', 30),
(6,  'Carbon Trekking Poles',    'Full carbon shafts, cork handles, carbide tips, 420g per pair.',                 169.00, 'Accessories', '/images/accessories.png',   0),
(7,  'Windshell Anorak',         'Packable DWR-treated ripstop fabric, front-pocket stuff sack.',                  219.00, 'Jackets',     '/images/jacket.png',  6),
(8,  'Trail Runner Pro',         'Zero-drop Vibram Megagrip outsole, wide toe box, max proprioception.',           159.00, 'Footwear',    '/images/boots.png', 18),
(9,  'Hardshell Pro 3L',         '3-layer hardshell, fully taped seams, helmet-compatible hood.',                  399.00, 'Jackets',     '/images/jacket.png',  7),
(10, 'Insulated Down Parka',     '850-fill power goose down, water-resistant shell, packable.',                    329.00, 'Jackets',     '/images/jacket.png', 14),
(11, 'Summit Approach Shoe',     'Sticky rubber rand, precise toe box, heel-locking lacing.',                      139.00, 'Footwear',    '/images/boots.png', 22),
(12, 'Winter Mountaineer Boot',  'B3-rated double boot, crampon-compatible welt, -40C insulation.',                279.00, 'Footwear',    '/images/boots.png',  5),
(13, 'Expedition Pack 60L',      '60L suspension pack, integrated rain cover, ice axe loops.',                     249.00, 'Bags',        '/images/bag.png',   9),
(14, 'Technical Hip Pack 5L',    'Fast-light 5L hip pack, stretchy pockets, breathable back panel.',                79.00, 'Bags',        '/images/bag.png',  25),
(15, 'Grid Fleece Hoody',        'Lightweight grid fleece, full zip, helmet-compatible hood.',                     119.00, 'Fleece',      '/images/fleece.png', 17),
(16, 'Synthetic Active Base',    'Quick-dry polyester, four-way stretch, flatlock seams.',                          65.00, 'Base Layers', '/images/baselayer.png', 35),
(17, 'Merino Beanie',            '100% Merino wool, double-knit cuff, temperature-regulating.',                     39.00, 'Accessories', '/images/accessories.png', 50),
(18, 'Lightweight Gaiters',      'Waterproof DWR gaiters, instep strap, front zip, fits any boot.',                 59.00, 'Accessories', '/images/accessories.png',  28),
(19, 'Trekking Gloves',          'Softshell, touchscreen fingertips, fleece lining, three-season.',                 49.00, 'Accessories', '/images/accessories.png', 40),
(20, 'Headlamp 700 Lumen',       '700-lumen LED, red night-vision mode, rechargeable, IPX67.',                      69.00, 'Accessories', '/images/accessories.png',  33)
ON CONFLICT (id) DO NOTHING;

-- Fix sequence so future auto-inserts don't collide with seeded IDs
SELECT setval('products_id_seq', GREATEST((SELECT MAX(id) FROM products), 20));

-- ----------------------------------------------------------
-- VERIFY: show product count
-- ----------------------------------------------------------
SELECT COUNT(*) AS total_products FROM products;
