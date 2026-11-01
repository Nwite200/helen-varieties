-- Production catalogue: extra product fields, image on order lines, update timestamps.
ALTER TABLE products ADD COLUMN is_new_arrival INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN in_stock INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN supplier_info TEXT;
ALTER TABLE products ADD COLUMN min_order_quantity INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN keywords_json TEXT;
ALTER TABLE products ADD COLUMN updated_at DATETIME;
ALTER TABLE order_items ADD COLUMN product_image TEXT;
ALTER TABLE orders ADD COLUMN updated_at DATETIME;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_items_order ON order_items(order_id);
