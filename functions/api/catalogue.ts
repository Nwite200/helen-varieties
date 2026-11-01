/**
 * Catalogue, media and admin-order endpoints (D1 + R2).
 * All write routes require a valid admin token; prices for orders always come from D1.
 */

export const ORDER_STATUSES = [
  'Pending Payment', 'Payment Confirmed', 'Awaiting Sourcing', 'Sourcing in Progress',
  'Supplier Confirmed', 'Purchased from Supplier', 'In Transit', 'Customs/Local Processing',
  'Ready for Delivery', 'Delivered', 'Cancelled', 'Refund Requested', 'Refunded',
] as const;
const PAYMENT_STATUSES = ['Unpaid', 'Paid', 'Refunded'];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
};

const clamp = (v: any, max: number) => String(v ?? '').trim().slice(0, max);
const safeJson = (s: any, fallback: any) => { try { return s ? JSON.parse(s) : fallback; } catch { return fallback; } };
const num = (v: any, fallback = 0) => { const n = Number(v); return Number.isFinite(n) ? n : fallback; };
const flag = (v: any) => (v ? 1 : 0);

export function slugify(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'product';
}

/** Database row -> the Product shape the website uses. */
export function rowToProduct(r: any) {
  const images: string[] = safeJson(r.images_json, []);
  return {
    id: r.id,
    sku: r.sku,
    name: r.name,
    category: r.category,
    description: r.description || '',
    price: r.price,
    supplierPriceRMB: r.supplier_price_rmb ?? 0,
    rating: r.rating ?? 5,
    reviewsCount: r.reviews_count ?? 0,
    images,
    primaryImage: r.primary_image || images[0] || '',
    variants: safeJson(r.variants_json, []),
    specifications: safeJson(r.specifications_json, {}),
    isFeatured: Boolean(r.is_featured),
    isTrending: Boolean(r.is_trending),
    isNewArrival: Boolean(r.is_new_arrival),
    isPreOrder: r.is_pre_order === null || r.is_pre_order === undefined ? true : Boolean(r.is_pre_order),
    sourcingTimeframe: r.sourcing_timeframe || '',
    supplierInfo: r.supplier_info || '',
    minOrderQuantity: r.min_order_quantity || 1,
    keywords: safeJson(r.keywords_json, []),
    inStock: r.in_stock === null || r.in_stock === undefined ? true : Boolean(r.in_stock),
  };
}

/** Validates admin input; returns the cleaned fields or an error message. */
export function cleanProductInput(b: any): { error: string } | { data: any } {
  if (!b || typeof b !== 'object') return { error: 'Invalid product.' };
  const name = clamp(b.name, 200);
  const category = clamp(b.category, 80);
  const price = num(b.price, NaN);
  if (!name) return { error: 'Product name is required.' };
  if (!category) return { error: 'Category is required.' };
  if (!Number.isFinite(price) || price < 0 || price > 1e9) return { error: 'Enter a valid price in Naira.' };
  const images = (Array.isArray(b.images) ? b.images : []).map((x: any) => clamp(x, 500)).filter(Boolean).slice(0, 10);
  const strMap = (o: any) => {
    const out: Record<string, string> = {};
    if (o && typeof o === 'object') for (const [k, v] of Object.entries(o).slice(0, 40)) out[clamp(k, 80)] = clamp(v, 300);
    return out;
  };
  const variants = (Array.isArray(b.variants) ? b.variants : []).slice(0, 10).map((v: any) => ({
    name: clamp(v?.name, 60),
    options: (Array.isArray(v?.options) ? v.options : []).map((o: any) => clamp(o, 60)).filter(Boolean).slice(0, 30),
  })).filter((v: any) => v.name && v.options.length);
  return {
    data: {
      sku: clamp(b.sku, 60),
      name, category,
      description: clamp(b.description, 4000),
      price,
      supplier_price_rmb: Math.max(0, num(b.supplierPriceRMB)),
      rating: Math.min(5, Math.max(0, num(b.rating, 5))),
      reviews_count: Math.max(0, Math.floor(num(b.reviewsCount))),
      primary_image: clamp(b.primaryImage, 500) || images[0] || '',
      images_json: JSON.stringify(images),
      variants_json: JSON.stringify(variants),
      specifications_json: JSON.stringify(strMap(b.specifications)),
      is_featured: flag(b.isFeatured), is_trending: flag(b.isTrending), is_new_arrival: flag(b.isNewArrival),
      is_pre_order: b.isPreOrder === false ? 0 : 1,
      in_stock: b.inStock === false ? 0 : 1,
      sourcing_timeframe: clamp(b.sourcingTimeframe, 120),
      supplier_info: clamp(b.supplierInfo, 300),
      min_order_quantity: Math.max(1, Math.min(10000, Math.floor(num(b.minOrderQuantity, 1)))),
      keywords_json: JSON.stringify((Array.isArray(b.keywords) ? b.keywords : []).map((k: any) => clamp(k, 40)).filter(Boolean).slice(0, 30)),
    },
  };
}

/** Public list (cached briefly at the edge). */
export async function listProducts(env: any): Promise<any[]> {
  const res = await env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC, name').all();
  return (res.results || []).map(rowToProduct);
}

export async function saveProduct(env: any, id: string | null, input: any): Promise<{ error: string; status: number } | { product: any }> {
  const now = new Date().toISOString();
  const d = input;
  if (id) {
    const existing = await env.DB.prepare('SELECT id, sku FROM products WHERE id = ?').bind(id).first();
    if (!existing) return { error: 'Product not found.', status: 404 };
    const sku = d.sku || existing.sku;
    try {
      await env.DB.prepare(
        `UPDATE products SET sku=?, name=?, category=?, description=?, price=?, supplier_price_rmb=?, rating=?, reviews_count=?,
         primary_image=?, images_json=?, variants_json=?, specifications_json=?, is_featured=?, is_trending=?, is_new_arrival=?,
         is_pre_order=?, in_stock=?, sourcing_timeframe=?, supplier_info=?, min_order_quantity=?, keywords_json=?, updated_at=? WHERE id=?`
      ).bind(sku, d.name, d.category, d.description, d.price, d.supplier_price_rmb, d.rating, d.reviews_count,
        d.primary_image, d.images_json, d.variants_json, d.specifications_json, d.is_featured, d.is_trending, d.is_new_arrival,
        d.is_pre_order, d.in_stock, d.sourcing_timeframe, d.supplier_info, d.min_order_quantity, d.keywords_json, now, id).run();
    } catch (e: any) {
      return { error: 'That SKU is already used by another product.', status: 409 };
    }
    const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
    return { product: rowToProduct(row) };
  }
  const newId = `prod-${crypto.randomUUID().slice(0, 12)}`;
  const sku = d.sku || `HV-${newId.slice(5, 11).toUpperCase()}`;
  const slug = `${slugify(d.name)}-${newId.slice(5, 11)}`;
  try {
    await env.DB.prepare(
      `INSERT INTO products (id, sku, name, slug, category, description, price, supplier_price_rmb, rating, reviews_count,
       primary_image, images_json, variants_json, specifications_json, is_featured, is_trending, is_new_arrival, is_pre_order,
       in_stock, sourcing_timeframe, supplier_info, min_order_quantity, keywords_json, created_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(newId, sku, d.name, slug, d.category, d.description, d.price, d.supplier_price_rmb, d.rating, d.reviews_count,
      d.primary_image, d.images_json, d.variants_json, d.specifications_json, d.is_featured, d.is_trending, d.is_new_arrival,
      d.is_pre_order, d.in_stock, d.sourcing_timeframe, d.supplier_info, d.min_order_quantity, d.keywords_json, now, now).run();
  } catch (e: any) {
    return { error: 'That SKU is already used by another product.', status: 409 };
  }
  const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(newId).first();
  return { product: rowToProduct(row) };
}

/** Image upload to R2. Only real image types, 5 MB max, random key. */
export async function uploadImage(env: any, request: Request): Promise<Response | { url: string }> {
  if (!env.MEDIA_BUCKET) return Response.json({ error: 'Image storage is not available.' }, { status: 503 });
  const type = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  const ext = IMAGE_TYPES[type];
  if (!ext) return Response.json({ error: 'Only JPG, PNG, WebP or GIF images are allowed.' }, { status: 415 });
  const buf = await request.arrayBuffer();
  if (buf.byteLength === 0) return Response.json({ error: 'Empty file.' }, { status: 400 });
  if (buf.byteLength > MAX_UPLOAD_BYTES) return Response.json({ error: 'Image is larger than 5 MB.' }, { status: 413 });
  const key = `products/${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  await env.MEDIA_BUCKET.put(key, buf, { httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' } });
  return { url: `/api/media/${key}` };
}

export async function serveMedia(env: any, key: string): Promise<Response> {
  if (!env.MEDIA_BUCKET || !/^products\/[a-z0-9._-]+$/i.test(key)) return new Response('Not found', { status: 404 });
  const obj = await env.MEDIA_BUCKET.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  headers.set('Content-Type', obj.httpMetadata?.contentType || 'application/octet-stream');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(obj.body, { headers });
}

/** Re-price cart lines from D1. Unknown / unavailable products are rejected. */
export async function priceItems(env: any, items: any[]): Promise<{ error: string } | { lines: any[]; subtotal: number }> {
  const lines: any[] = [];
  let subtotal = 0;
  for (const it of items) {
    const pid = clamp(it?.productId, 80);
    const qty = Math.floor(num(it?.quantity));
    if (!pid || qty < 1 || qty > 1000) return { error: 'Invalid item quantity.' };
    const p = await env.DB.prepare('SELECT id, sku, name, price, primary_image, in_stock, min_order_quantity FROM products WHERE id = ?').bind(pid).first();
    if (!p) return { error: 'One of the products in your cart is no longer available. Please refresh and try again.' };
    if (p.in_stock === 0) return { error: `${p.name} is currently unavailable.` };
    if (qty < (p.min_order_quantity || 1)) return { error: `${p.name} has a minimum order of ${p.min_order_quantity}.` };
    const total = p.price * qty;
    subtotal += total;
    const sv = it?.selectedVariants && typeof it.selectedVariants === 'object' ? it.selectedVariants : {};
    lines.push({ productId: p.id, name: p.name, sku: p.sku, image: p.primary_image || '', unitPrice: p.price, quantity: qty, total, variants: JSON.stringify(sv).slice(0, 1000) });
  }
  return { lines, subtotal };
}

export function rowToAdminOrder(o: any, items: any[], notes: any[]) {
  return {
    id: o.id,
    orderNumber: o.order_number,
    date: o.created_at,
    customerName: o.customer_name,
    customerEmail: o.customer_email || '',
    customerPhone: o.customer_phone || '',
    isGuest: Boolean(o.is_guest),
    deliveryAddress: {
      fullName: o.customer_name, phone: o.customer_phone || '', email: o.customer_email || '',
      address: o.delivery_street, city: o.delivery_city, state: o.delivery_state,
    },
    items: items.map((it) => ({
      productId: it.product_id, productName: it.product_name, productImage: it.product_image || '', sku: it.sku,
      selectedVariants: safeJson(it.selected_variants, {}), quantity: it.quantity, unitPrice: it.unit_price, totalPrice: it.total_price,
    })),
    subtotal: o.subtotal,
    shippingNote: o.shipping_note || '',
    totalAmount: o.total_amount,
    status: o.status,
    paymentMethod: o.payment_method || '',
    paymentReference: o.payment_reference || '',
    paymentStatus: o.payment_status || 'Unpaid',
    source: o.source || 'website',
    trackingSecret: o.tracking_secret,
    sourcingNotes: notes.map((n) => ({ date: n.date, message: n.message })),
  };
}

export async function listAdminOrders(env: any): Promise<any[]> {
  const orders = (await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500').all()).results || [];
  if (!orders.length) return [];
  const items = (await env.DB.prepare('SELECT * FROM order_items ORDER BY rowid').all()).results || [];
  const notes = (await env.DB.prepare('SELECT * FROM order_sourcing_notes ORDER BY created_at, rowid').all()).results || [];
  return orders.map((o: any) =>
    rowToAdminOrder(o, items.filter((i: any) => i.order_id === o.id), notes.filter((n: any) => n.order_id === o.id)));
}

export async function updateAdminOrder(env: any, id: string, body: any, actor: string): Promise<{ error: string; status: number } | { order: any }> {
  const o = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  if (!o) return { error: 'Order not found.', status: 404 };
  const now = new Date().toISOString();
  const status = body?.status !== undefined ? String(body.status) : o.status;
  const payStatus = body?.paymentStatus !== undefined ? String(body.paymentStatus) : o.payment_status;
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) return { error: 'Unknown order status.', status: 400 };
  if (!PAYMENT_STATUSES.includes(payStatus)) return { error: 'Unknown payment status.', status: 400 };
  const ref = body?.paymentReference !== undefined ? clamp(body.paymentReference, 120) : o.payment_reference;
  await env.DB.prepare('UPDATE orders SET status=?, payment_status=?, payment_reference=?, updated_at=? WHERE id=?')
    .bind(status, payStatus, ref || null, now, id).run();
  const note = clamp(body?.note, 500) || (status !== o.status ? `Status updated to "${status}".` : '');
  if (note) {
    await env.DB.prepare('INSERT INTO order_sourcing_notes (id, order_id, date, message) VALUES (?,?,?,?)')
      .bind(`sn-${crypto.randomUUID()}`, id, now, note).run();
  }
  await env.DB.prepare('INSERT INTO audit_logs (id, timestamp, actor, action, target, details) VALUES (?,?,?,?,?,?)')
    .bind(`al-${crypto.randomUUID()}`, now, actor, 'order.update', o.order_number, `${o.status} -> ${status}; payment ${payStatus}`).run();
  const fresh = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  const items = (await env.DB.prepare('SELECT * FROM order_items WHERE order_id = ?').bind(id).all()).results || [];
  const notes = (await env.DB.prepare('SELECT * FROM order_sourcing_notes WHERE order_id = ? ORDER BY created_at, rowid').bind(id).all()).results || [];
  return { order: rowToAdminOrder(fresh, items, notes) };
}

export async function logAudit(env: any, actor: string, action: string, target: string, details = ''): Promise<void> {
  try {
    await env.DB.prepare('INSERT INTO audit_logs (id, timestamp, actor, action, target, details) VALUES (?,?,?,?,?,?)')
      .bind(`al-${crypto.randomUUID()}`, new Date().toISOString(), actor, action, target, details.slice(0, 500)).run();
  } catch { /* auditing must never break the request */ }
}

export async function listAudit(env: any): Promise<any[]> {
  const res = await env.DB.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 200').all();
  return (res.results || []).map((r: any) => ({ id: r.id, timestamp: r.timestamp, actor: r.actor, action: r.action, target: r.target, details: r.details || '' }));
}

export async function sitemapXml(env: any, origin: string): Promise<string> {
  const base = ['/', '/shop', '/pre-order', '/contact', '/privacy', '/terms'];
  let products: any[] = [];
  if (env.DB) {
    try { products = (await env.DB.prepare('SELECT id, updated_at, created_at FROM products').all()).results || []; } catch { /* empty */ }
  }
  const urls = [
    ...base.map((p) => `<url><loc>${origin}${p}</loc></url>`),
    ...products.map((p: any) => `<url><loc>${origin}/product/${encodeURIComponent(p.id)}</loc><lastmod>${String(p.updated_at || p.created_at || '').slice(0, 10)}</lastmod></url>`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}
