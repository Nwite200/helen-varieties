/**
 * Cloudflare Worker Backend Router for Helen's Varieties Venture
 * Secure authentication, guest pre-order checkout validation, and D1 persistence
 */

export interface Env {
  DB?: any;
  MEDIA_BUCKET?: any;
  // Branding / contact (set in wrangler.toml [vars])
  BRAND_NAME?: string;
  WHATSAPP_PHONE?: string;
  WHATSAPP_INTERNATIONAL?: string;
  // Optional comma-separated list of extra origins allowed to call the API
  ALLOWED_ORIGINS?: string;
  // Admin credentials (Cloudflare secrets — never exposed to the browser)
  ADMIN_PROVISION_EMAIL?: string;
  ADMIN_PROVISION_PASSWORD?: string;
  // Optional separate key for signing admin session tokens (falls back to the admin password)
  ADMIN_SESSION_SECRET?: string;
  // TTS provider credentials (Cloudflare secrets — never exposed to the browser)
  TTS_API_KEY?: string;
  TTS_PROVIDER?: 'elevenlabs' | 'azure' | 'polly';
}

const DEFAULT_ALLOWED_ORIGINS = [
  'https://helensvarieties.com.ng',
  'https://www.helensvarieties.com.ng',
];
const ADMIN_SESSION_HOURS = 12;

/* ---------- small crypto helpers (Web Crypto, available in Workers) ---------- */

const encoder = new TextEncoder();

function toB64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Constant-time string comparison (hashes first so lengths don't leak). */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function sessionSecret(env: Env): string | null {
  return env.ADMIN_SESSION_SECRET || env.ADMIN_PROVISION_PASSWORD || null;
}

async function signAdminToken(env: Env, email: string): Promise<{ token: string; expiresAt: number } | null> {
  const secret = sessionSecret(env);
  if (!secret) return null;
  const expiresAt = Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000;
  const payload = toB64Url(encoder.encode(JSON.stringify({ sub: email, role: 'super_admin', exp: expiresAt })));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(payload));
  return { token: `${payload}.${toB64Url(new Uint8Array(sig))}`, expiresAt };
}

async function verifyAdminToken(env: Env, request: Request): Promise<{ sub: string; role: string; exp: number } | null> {
  const secret = sessionSecret(env);
  const header = request.headers.get('Authorization');
  if (!secret || !header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), fromB64Url(sig) as BufferSource, encoder.encode(payload));
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64Url(payload)));
    if (!data || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

/** Cryptographically random digits / token characters (replaces Math.random). */
function randomDigits(n: number): string {
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  return Array.from(buf, (v) => String(v % 10)).join('');
}

function randomToken(n: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  return Array.from(buf, (v) => alphabet[v % alphabet.length]).join('');
}

function isAllowedOrigin(origin: string | null, url: URL, env: Env): boolean {
  if (!origin) return false;
  if (origin === url.origin) return true;
  const extra = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return [...DEFAULT_ALLOWED_ORIGINS, ...extra].includes(origin);
}

const clampStr = (v: any, max: number): string => String(v ?? '').trim().slice(0, max);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS: only reflect origins we trust (same origin, our own domains, or ALLOWED_ORIGINS).
    const origin = request.headers.get('Origin');
    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Vary': 'Origin',
    };
    if (isAllowedOrigin(origin, url, env)) {
      corsHeaders['Access-Control-Allow-Origin'] = origin as string;
    }

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // 1. Health & Config status
      if (path === '/api/health') {
        return Response.json({
          status: 'online',
          brand: env.BRAND_NAME || "Helen's Varieties Venture",
          whatsapp: env.WHATSAPP_PHONE || '',
          d1_connected: Boolean(env.DB),
          admin_configured: Boolean(env.ADMIN_PROVISION_EMAIL && env.ADMIN_PROVISION_PASSWORD),
        }, { headers: corsHeaders });
      }

      // 2. Guest & Authenticated Pre-Order Checkout Endpoint
      if (path === '/api/orders' && method === 'POST') {
        let body: any;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: 'Invalid request body.' }, { status: 400, headers: corsHeaders });
        }
        if (!body || typeof body !== 'object') {
          return Response.json({ error: 'Invalid request body.' }, { status: 400, headers: corsHeaders });
        }
        const { customerName, customerEmail, customerPhone, deliveryAddress, items, isGuest } = body;

        // Validation Rule: Full name is required
        if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
          return Response.json({ error: 'Customer full name is required.' }, { status: 400, headers: corsHeaders });
        }

        // Validation Rule: AT LEAST ONE valid contact method (email OR phone) is mandatory
        const emailValid = customerEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim());
        const phoneValid = customerPhone && customerPhone.replace(/\D/g, '').length >= 10;

        if (!emailValid && !phoneValid) {
          return Response.json({
            error: 'You must provide at least one valid contact method (email address or phone number).'
          }, { status: 400, headers: corsHeaders });
        }

        // Validation Rule: Delivery address required for physical sourcing
        if (!deliveryAddress || !deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.state) {
          return Response.json({ error: 'Complete delivery destination (street, city, state) is required.' }, { status: 400, headers: corsHeaders });
        }

        // Validation Rule: Cart items cannot be empty
        if (!items || !Array.isArray(items) || items.length === 0) {
          return Response.json({ error: 'Order must contain at least one item.' }, { status: 400, headers: corsHeaders });
        }
        if (items.length > 50) {
          return Response.json({ error: 'Too many items in one order.' }, { status: 400, headers: corsHeaders });
        }
        for (const it of items) {
          const qty = Number(it?.quantity);
          const price = Number(it?.unitPrice);
          if (!Number.isFinite(qty) || qty < 1 || qty > 1000 || !Number.isFinite(price) || price < 0) {
            return Response.json({ error: 'Invalid item quantity or price.' }, { status: 400, headers: corsHeaders });
          }
        }
        // NOTE: unit prices are still supplied by the browser. They can only be verified
        // server-side once products live in D1 (planned next step).

        // Generate unique order number and tracking secret (cryptographically random)
        const orderNumber = `#HV${100000 + (parseInt(randomDigits(6), 10) % 900000)}`;
        const trackingSecret = randomToken(12);
        const orderId = `ord-${crypto.randomUUID()}`;
        const subtotal = items.reduce((s: number, it: any) => s + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 0), 0);
        const now = new Date().toISOString();

        // Persist to D1 when available (production). Stateless fallback in local dev.
        if (env.DB) {
          try {
            await env.DB.prepare(
              `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, is_guest, delivery_street, delivery_city, delivery_state, subtotal, shipping_note, total_amount, status, payment_method, payment_status, payment_reference, source, tracking_secret, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
              orderId, orderNumber, null, clampStr(customerName, 120),
              customerEmail ? clampStr(customerEmail, 160) : null,
              customerPhone ? clampStr(customerPhone, 30) : null,
              isGuest ? 1 : 0,
              clampStr(deliveryAddress.address, 250), clampStr(deliveryAddress.city, 80), clampStr(deliveryAddress.state, 80),
              subtotal,
              'Not included. Will be shared separately after order confirmation and cargo arrival.',
              subtotal, 'Pending Payment', clampStr(body.paymentMethod, 60) || 'Paystack / Online Transfer',
              'Unpaid', null, 'website', trackingSecret, now
            ).run();

            for (const it of items) {
              await env.DB.prepare(
                `INSERT INTO order_items (id, order_id, product_id, product_name, sku, selected_variants, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
              ).bind(
                `oi-${crypto.randomUUID()}`,
                orderId, it.productId ? clampStr(it.productId, 80) : null, clampStr(it.productName || it.name || 'Item', 200),
                clampStr(it.sku, 80), JSON.stringify(it.selectedVariants || {}).slice(0, 1000),
                Number(it.quantity) || 1, Number(it.unitPrice) || 0,
                (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1)
              ).run();
            }

            await env.DB.prepare(
              `INSERT INTO order_sourcing_notes (id, order_id, date, message) VALUES (?, ?, ?, ?)`
            ).bind(`sn-${crypto.randomUUID()}`, orderId, now, 'Order created. Initial product procurement funds pending confirmation.').run();
          } catch (err: any) {
            console.error('Order persistence failed:', err?.message || err);
            return Response.json({ error: 'We could not save your order right now. Please try again or contact us on WhatsApp.' }, { status: 500, headers: corsHeaders });
          }
        }

        return Response.json({
          success: true,
          orderNumber,
          trackingSecret,
          isGuest: Boolean(isGuest),
          customerName,
          customerEmail: customerEmail || null,
          customerPhone: customerPhone || null,
          shippingDisclaimer: "Product prices exclude international shipping, customs charges, and other applicable delivery fees unless explicitly stated. Additional charges will be communicated according to the order's sourcing and delivery arrangements."
        }, { status: 201, headers: corsHeaders });
      }

      // 3.5. Secure Text-to-Speech (provider credentials stay server-side)
      if (path === '/api/tts') {
        return ttsHandler.handle(request, env, corsHeaders, isAllowedOrigin(origin, url, env));
      }

      // 2b. Track an order by number + secret (D1)
      if (path.startsWith('/api/orders/') && method === 'GET') {
        let orderNumber = '';
        try {
          orderNumber = decodeURIComponent(path.replace('/api/orders/', ''));
        } catch {
          return Response.json({ error: 'Order number required.' }, { status: 400, headers: corsHeaders });
        }
        const secret = url.searchParams.get('secret') || '';
        if (!orderNumber) {
          return Response.json({ error: 'Order number required.' }, { status: 400, headers: corsHeaders });
        }
        if (!env.DB) {
          return Response.json({ error: 'Database not available.' }, { status: 503, headers: corsHeaders });
        }
        const order = await env.DB.prepare('SELECT * FROM orders WHERE order_number = ?').bind(orderNumber).first();
        // The tracking secret is mandatory. A missing order and a wrong secret give the same
        // answer, so order numbers cannot be probed to discover which ones exist.
        const secretOk = Boolean(order && order.tracking_secret && secret && (await safeEqual(secret, String(order.tracking_secret))));
        if (!order || !secretOk) {
          return Response.json({ error: 'Order not found. Check the order number and tracking secret.' }, { status: 404, headers: corsHeaders });
        }
        const itemsRes = await env.DB.prepare('SELECT * FROM order_items WHERE order_id = ?').bind(order.id).all();
        const notesRes = await env.DB.prepare('SELECT * FROM order_sourcing_notes WHERE order_id = ? ORDER BY created_at').bind(order.id).all();
        const safeJson = (s: any, fallback: any) => { try { return JSON.parse(s); } catch { return fallback; } };
        return Response.json({
          success: true,
          order: {
            id: order.id,
            orderNumber: order.order_number,
            date: order.created_at,
            customerName: order.customer_name,
            customerEmail: order.customer_email,
            customerPhone: order.customer_phone,
            isGuest: Boolean(order.is_guest),
            deliveryAddress: {
              fullName: order.customer_name,
              phone: order.customer_phone || '',
              email: order.customer_email || '',
              address: order.delivery_street,
              city: order.delivery_city,
              state: order.delivery_state,
            },
            items: (itemsRes.results || []).map((it: any) => ({
              productId: it.product_id,
              productName: it.product_name,
              productImage: '',
              sku: it.sku,
              selectedVariants: safeJson(it.selected_variants, {}),
              quantity: it.quantity,
              unitPrice: it.unit_price,
              totalPrice: it.total_price,
            })),
            subtotal: order.subtotal,
            shippingNote: order.shipping_note,
            totalAmount: order.total_amount,
            status: order.status,
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            paymentReference: order.payment_reference,
            source: order.source,
            trackingSecret: order.tracking_secret,
            sourcingNotes: (notesRes.results || []).map((n: any) => ({ date: n.date, message: n.message })),
          }
        }, { headers: corsHeaders });
      }

      // 3a. Admin login: checks the Cloudflare secrets and returns a signed, expiring session token
      if (path === '/api/admin/login' && method === 'POST') {
        const adminEmail = (env.ADMIN_PROVISION_EMAIL || '').trim().toLowerCase();
        const adminPassword = env.ADMIN_PROVISION_PASSWORD || '';
        if (!adminEmail || !adminPassword) {
          return Response.json({ error: 'Admin login is not configured on the server.' }, { status: 503, headers: corsHeaders });
        }
        let creds: any;
        try {
          creds = await request.json();
        } catch {
          return Response.json({ error: 'Invalid request body.' }, { status: 400, headers: corsHeaders });
        }
        const email = clampStr(creds?.email, 160).toLowerCase();
        const password = typeof creds?.password === 'string' ? creds.password.slice(0, 200) : '';
        // Evaluate both checks so timing doesn't reveal which one failed
        const [emailOk, passOk] = await Promise.all([safeEqual(email, adminEmail), safeEqual(password, adminPassword)]);
        if (!emailOk || !passOk) {
          await new Promise((resolve) => setTimeout(resolve, 600)); // slows down password guessing
          return Response.json({ error: 'Invalid administrator credentials.' }, { status: 401, headers: corsHeaders });
        }
        const session = await signAdminToken(env, adminEmail);
        if (!session) {
          return Response.json({ error: 'Admin login is not configured on the server.' }, { status: 503, headers: corsHeaders });
        }
        return Response.json({
          success: true,
          token: session.token,
          expiresAt: session.expiresAt,
          user: { email: adminEmail, role: 'super_admin' },
        }, { headers: corsHeaders });
      }

      // 3b. Admin verification: the token must be genuine and unexpired
      if (path === '/api/admin/verify' && method === 'POST') {
        const session = await verifyAdminToken(env, request);
        if (!session) {
          return Response.json({ error: 'Unauthorized administrative access.' }, { status: 401, headers: corsHeaders });
        }
        return Response.json({ authorized: true, role: session.role, email: session.sub, expiresAt: session.exp }, { headers: corsHeaders });
      }

      return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
    } catch (err: any) {
      console.error('Unhandled API error:', err?.message || err);
      return Response.json({ error: 'Server error' }, { status: 500, headers: corsHeaders });
    }
  }
};

/**
 * Server-side neural text-to-speech.
 * Provider API keys live exclusively in Cloudflare secrets (TTS_API_KEY).
 * The browser never sees them; it only receives the generated audio.
 */
async function synthesizeSpeech({
  provider,
  apiKey,
  text,
  voiceId,
  speed = 1,
}: {
  provider: string;
  apiKey: string;
  text: string;
  voiceId?: string;
  speed?: number;
}): Promise<Uint8Array> {
  if (provider === 'elevenlabs') {
    const voice = voiceId || 'EXAVITQu4vr4xnSDxMaL'; // default mature female voice
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75, speed },
      }),
    });
    if (!res.ok) throw new Error(`ElevenLabs error: ${res.status}`);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }
  throw new Error(`TTS provider '${provider}' is not implemented yet`);
}

// 4. Secure text-to-speech endpoint (called by the assistant only when a remote provider is configured)
export const ttsHandler = {
  async handle(
    request: Request,
    env: Env,
    corsHeaders: Record<string, string> = {},
    originAllowed = true,
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api/tts' || request.method !== 'POST') {
      return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
    }
    // Only our own website may spend the TTS credits (browsers always send Origin on POST)
    if (!originAllowed) {
      return Response.json({ error: 'Forbidden.' }, { status: 403, headers: corsHeaders });
    }
    const apiKey = env.TTS_API_KEY;
    const provider = env.TTS_PROVIDER || 'elevenlabs';
    if (!apiKey) {
      return Response.json({ error: 'TTS provider is not configured on the server.' }, { status: 501, headers: corsHeaders });
    }
    let body: { text?: string; voiceId?: string; speed?: number };
    try {
      body = (await request.json()) as any;
    } catch {
      return Response.json({ error: 'Invalid request body.' }, { status: 400, headers: corsHeaders });
    }
    if (!body.text || typeof body.text !== 'string') {
      return Response.json({ error: 'Text is required.' }, { status: 400, headers: corsHeaders });
    }
    if (body.text.length > 600) {
      return Response.json({ error: 'Text is too long (600 characters max).' }, { status: 413, headers: corsHeaders });
    }
    const voiceId = typeof body.voiceId === 'string' && /^[A-Za-z0-9]{8,40}$/.test(body.voiceId) ? body.voiceId : undefined;
    const speed = Math.min(1.2, Math.max(0.7, Number(body.speed) || 1));
    try {
      const audio = await synthesizeSpeech({ provider, apiKey, text: body.text, voiceId, speed });
      return new Response(audio as unknown as BodyInit, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'private, no-store',
        },
      });
    } catch (err: any) {
      console.error('TTS failed:', err?.message || err);
      return Response.json({ error: 'Speech generation failed.' }, { status: 502, headers: corsHeaders });
    }
  },
};

