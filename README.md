# Helen Varieties — Sourcing & Pre-Order E-Commerce Platform

Helen Varieties Venture is a modern, responsive web application for product sourcing and pre-order management, connecting customers directly to verified manufacturers on 1688 and global wholesale markets.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
git clone <repository-url>
cd "Helens varities website"
npm install
```

### Running Locally (Development Mode)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Test Suite
```bash
npm test
```

### Building for Production
```bash
npm run build
```
The compiled output is located in the `dist/` directory.

---

## 🎨 Design System & Visual Identity
- **Primary Blue**: `#0070DC`
- **Primary Red**: `#C90016`
- **Dark Neutral**: `#191919`
- **Canvas Neutral**: `#F7F7F8`
- **Branded Logo**: Integrated house and shopping cart icon with the wordmark *"Helen Varieties — Discover More. Pre-Order with Confidence."*

---

## 🛠️ Key Modules & Architecture

1. **Pre-Order Sourcing System**:
   - Customer-facing pre-order prices clearly separated from international freight.
   - Mandatory shipping disclaimers on every product page, shopping cart, and checkout step.
   - 12 comprehensive sourcing statuses: `Pending Payment`, `Payment Confirmed`, `Awaiting Sourcing`, `Sourcing in Progress`, `Purchased from Supplier`, `In Transit`, `Customs/Local Processing`, `Ready for Delivery`, `Delivered`, etc.

2. **Customer Portal & Live Tracking**:
   - Customer dashboard (`/dashboard`) with real-time milestone timestamps.
   - Quick public order tracking page (`/track`) by reference code (e.g. `#HV00123`).

3. **Operations & Admin Dashboard**:
   - Access at `/admin` (or click "One-Click Login as Admin" on the login page).
   - Order pipeline monitoring and status updates with customer progress messages.
   - 1688 Catalogue management (add, edit, publish, remove items).
   - Exchange rate monitor benchmarked to Chinese Yuan (`¥1 = ₦220.00`).

4. **AI Shopping Assistant (Helen's Varieties Venture Assistant)**:
   - Floating assistant in the bottom-right corner of every public page — replaces the standalone WhatsApp button (only one floating support widget remains).
   - Welcome card: delayed, session-aware greeting with close button and explicit sound control (no autoplaying audio).
   - AI chat: catalogue search, recommendations, prices/specifications, pre-order and shipping explanations, order tracking, checkout guidance, and WhatsApp human-support escalation — grounded in the real catalogue (no invented prices, stock, or delivery dates).
   - WhatsApp ordering integrated into the agent (https://wa.me/2347032583937), plus product-page and cart WhatsApp options with dynamically generated prefilled messages. Opening WhatsApp starts a conversation only; it never submits or confirms a website order.
   - Voice: browser speech synthesis by default; optional server-side neural TTS via /api/tts with provider keys in Cloudflare secrets only.
   - Background ambience: optional technology ambience, disabled by default; add a licensed track at public/audio/tech-ambience.mp3 and enable it in Admin → AI Assistant Settings.

---

## 🔐 Configuration & Secrets

**Non-secret AI settings** (display name, avatar, welcome message, voice provider/voice ID/speaking rate/volume, background sound asset/volume, greeting behaviour, suggested questions, human support phone/WhatsApp) are editable by administrators at `/admin/ai-assistant` and stored in the database (`migrations/0002_ai_assistant_settings.sql`).

**Provider credentials** (`TTS_API_KEY`, `TTS_PROVIDER`) must be set as Cloudflare secrets — never in frontend code:

```bash
cd "Helens varities website"
npx wrangler secret put TTS_API_KEY    # ElevenLabs / Azure / Polly key (optional)
npx wrangler secret put TTS_PROVIDER   # elevenlabs | azure | polly (optional, default elevenlabs)
```

Without credentials the assistant gracefully falls back to browser speech synthesis and text-only responses, and background ambience stays disabled.

## 🧪 Tests
`npm test` — vitest suite covering the catalogue, orders, WhatsApp config/links, WhatsApp message builders, and grounded AI replies (no invented data).

## ☁️ Production Deployment (Cloudflare)

To deploy on **Cloudflare Pages / Workers**:
1. Connect this repository to your Cloudflare dashboard.
2. Set build command: `npm run build`
3. Set build output directory: `dist`
4. Set node version environment variable: `NODE_VERSION=20`

