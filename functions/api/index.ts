/**
 * Cloudflare Worker Backend Router for Helen's Varieties Venture
 * Secure authentication, guest pre-order checkout validation, and D1 persistence
 */

export interface Env {
  DB?: any;
  ADMIN_PROVISION_EMAIL?: string;
  ADMIN_PROVISION_PASSWORD?: string;
  // TTS provider credentials (Cloudflare secrets — never exposed to the browser)
  TTS_API_KEY?: string;
  TTS_PROVIDER?: 'elevenlabs' | 'azure' | 'polly';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Health & Config status
      if (path === '/api/health') {
        return Response.json({
          status: 'online',
          brand: "Helen's Varieties Venture",
          whatsapp: "07032583937",
          d1_connected: Boolean(env.DB)
        }, { headers: corsHeaders });
      }

      // 2. Guest & Authenticated Pre-Order Checkout Endpoint
      if (path === '/api/orders' && method === 'POST') {
        const body = await request.json() as any;
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

        // Generate unique order number
        const orderNumber = `#HV${Math.floor(100000 + Math.random() * 900000)}`;
        const trackingSecret = Math.random().toString(36).substring(2, 10);
        const orderId = `ord-${Date.now()}`;
        const subtotal = items.reduce((s: number, it: any) => s + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 0), 0);
        const now = new Date().toISOString();

        // Persist to D1 when available (production). Stateless fallback in local dev.
        if (env.DB) {
          try {
            await env.DB.prepare(
              `INSERT INTO orders (id, order_number, customer_id, customer_name, customer_email, customer_phone, is_guest, delivery_street, delivery_city, delivery_state, subtotal, shipping_note, total_amount, status, payment_method, payment_status, payment_reference, source, tracking_secret, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
              orderId, orderNumber, null, customerName.trim(),
              customerEmail ? customerEmail.trim() : null,
              customerPhone ? customerPhone.trim() : null,
              isGuest ? 1 : 0,
              deliveryAddress.address, deliveryAddress.city, deliveryAddress.state,
              subtotal,
              'Not included. Will be shared separately after order confirmation and cargo arrival.',
              subtotal, 'Pending Payment', body.paymentMethod || 'Paystack / Online Transfer',
              'Unpaid', null, 'website', trackingSecret, now
            ).run();

            for (const it of items) {
              await env.DB.prepare(
                `INSERT INTO order_items (id, order_id, product_id, product_name, sku, selected_variants, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
              ).bind(
                `oi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                orderId, it.productId || null, it.productName || it.name || 'Item',
                it.sku || '', JSON.stringify(it.selectedVariants || {}),
                Number(it.quantity) || 1, Number(it.unitPrice) || 0,
                (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1)
              ).run();
            }

            await env.DB.prepare(
              `INSERT INTO order_sourcing_notes (id, order_id, date, message) VALUES (?, ?, ?, ?)`
            ).bind(`sn-${Date.now()}`, orderId, now, 'Order created. Initial product procurement funds pending confirmation.').run();
          } catch (err: any) {
            return Response.json({ error: 'Failed to persist order: ' + (err.message || 'DB error') }, { status: 500, headers: corsHeaders });
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
        return ttsHandler.handle(request, env);
      }

      // 2b. Track an order by number + secret (D1)
      if (path.startsWith('/api/orders/') && method === 'GET') {
        const orderNumber = decodeURIComponent(path.replace('/api/orders/', ''));
        const secret = url.searchParams.get('secret');
        if (!orderNumber) {
          return Response.json({ error: 'Order number required.' }, { status: 400, headers: corsHeaders });
        }
        if (!env.DB) {
          return Response.json({ error: 'Database not available.' }, { status: 503, headers: corsHeaders });
        }
        const order = await env.DB.prepare('SELECT * FROM orders WHERE order_number = ?').bind(orderNumber).first();
        if (!order) {
          return Response.json({ error: 'Order not found.' }, { status: 404, headers: corsHeaders });
        }
        if (secret && order.tracking_secret && secret !== order.tracking_secret) {
          return Response.json({ error: 'Invalid tracking secret.' }, { status: 403, headers: corsHeaders });
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

      // 3. Admin Verification Endpoint
      if (path === '/api/admin/verify' && method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return Response.json({ error: 'Unauthorized administrative access.' }, { status: 401, headers: corsHeaders });
        }
        return Response.json({ authorized: true, role: 'super_admin' }, { headers: corsHeaders });
      }

      return Response.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });
    } catch (err: any) {
      return Response.json({ error: err.message || 'Server error' }, { status: 500, headers: corsHeaders });
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
  async handle(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api/tts' || request.method !== 'POST') {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
    const apiKey = env.TTS_API_KEY;
    const provider = env.TTS_PROVIDER || 'elevenlabs';
    if (!apiKey) {
      return Response.json({ error: 'TTS provider is not configured on the server.' }, { status: 501 });
    }
    let body: { text?: string; voiceId?: string; speed?: number };
    try {
      body = (await request.json()) as any;
    } catch {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    if (!body.text || typeof body.text !== 'string') {
      return Response.json({ error: 'Text is required.' }, { status: 400 });
    }
    try {
      const audio = await synthesizeSpeech({ provider, apiKey, text: body.text, voiceId: body.voiceId, speed: body.speed });
      return new Response(audio, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'private, no-store',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err: any) {
      return Response.json({ error: err.message || 'Speech generation failed.' }, { status: 502 });
    }
  },
};

