-- Cloudflare D1 Migration for Helen's Varieties Venture

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'customer', -- 'customer', 'super_admin', 'order_manager'
  is_email_verified INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  supplier_price_rmb REAL,
  rating REAL DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  primary_image TEXT,
  images_json TEXT,
  variants_json TEXT,
  specifications_json TEXT,
  is_featured INTEGER DEFAULT 0,
  is_trending INTEGER DEFAULT 0,
  is_pre_order INTEGER DEFAULT 1,
  sourcing_timeframe TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id TEXT, -- NULL for Guest checkout
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  is_guest INTEGER DEFAULT 0,
  delivery_street TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  subtotal REAL NOT NULL,
  shipping_note TEXT,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'Pending Payment',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'Unpaid',
  payment_reference TEXT,
  source TEXT DEFAULT 'website', -- 'website' or 'whatsapp'
  tracking_secret TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  sku TEXT NOT NULL,
  selected_variants TEXT,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_sourcing_notes (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  date TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT,
  ip_address TEXT
);

