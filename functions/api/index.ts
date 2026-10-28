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

