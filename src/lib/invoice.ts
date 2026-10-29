import { Order } from '../types';

export const BRAND_NAME = "Helen's Varieties Venture";
export const BRAND_TAGLINE = 'Discover More. Pre-Order with Confidence.';
export const WHATSAPP_PHONE = '07032583937';
export const WHATSAPP_LINK = 'https://wa.me/2347032583937';

export function formatMoney(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

// Absolute URL so the logo also loads when the receipt opens in its own tab (blob: URL) or prints.
function assetUrl(path: string): string {
  const origin = typeof window !== 'undefined' && window.location?.origin?.startsWith('http') ? window.location.origin : '';
  return `${origin}${path}`;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildInvoiceHtml(order: Order): string {
  const itemsHtml = order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;">
          ${escapeHtml(it.productName)}<br/>
          <span style="color:#64748b;font-size:10px;">SKU: ${escapeHtml(it.sku)}${Object.keys(it.selectedVariants || {}).length ? ' • ' + Object.entries(it.selectedVariants).map(([k, v]) => `${escapeHtml(k)}: ${escapeHtml(v)}`).join(', ') : ''}</span>
        </td>
        <td style="padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;text-align:center;">${it.quantity}</td>
        <td style="padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;text-align:right;">${formatMoney(it.unitPrice)}</td>
        <td style="padding:8px 6px;border-bottom:1px solid #e2e8f0;font-size:12px;text-align:right;font-weight:700;">${formatMoney(it.totalPrice)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice ${escapeHtml(order.orderNumber)} — ${BRAND_NAME}</title>
  <link rel="icon" type="image/png" href="${assetUrl('/favicon-32x32.png')}" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Poppins', 'Segoe UI', Arial, sans-serif; margin: 0; padding: 24px; color: #191919; background: #f7f7f8; }
    .sheet { max-width: 760px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0070DC; padding-bottom: 16px; margin-bottom: 20px; }
    .brandrow { display: flex; align-items: center; gap: 12px; }
    .logo { width: 56px; height: 56px; object-fit: contain; flex-shrink: 0; }
    .brand { font-size: 20px; font-weight: 800; color: #0070DC; }
    .tagline { font-size: 11px; color: #64748b; margin-top: 2px; }
    .inv-title { font-size: 18px; font-weight: 800; color: #191919; text-align: right; }
    .inv-num { font-size: 13px; color: #0070DC; font-weight: 700; text-align: right; margin-top: 2px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-size: 12px; }
    .box h4 { margin: 0 0 6px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; }
    .box p { margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; padding: 8px 6px; border-bottom: 2px solid #e2e8f0; }
    th.right { text-align: right; }
    th.center { text-align: center; }
    .totals { margin-left: auto; width: 280px; font-size: 12px; }
    .totals .row { display: flex; justify-content: space-between; padding: 4px 0; }
    .totals .grand { font-size: 16px; font-weight: 800; color: #0070DC; border-top: 2px solid #e2e8f0; padding-top: 8px; margin-top: 4px; }
    .disclaimer { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 12px; font-size: 11px; color: #991b1b; margin-top: 16px; }
    .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    .actions { text-align: center; margin-top: 24px; }
    .btn { display: inline-block; padding: 10px 20px; border-radius: 10px; font-size: 12px; font-weight: 700; text-decoration: none; cursor: pointer; border: none; }
    .btn-primary { background: #0070DC; color: #fff; }
    .btn-wa { background: #10B981; color: #fff; margin-left: 8px; }
    @media print { .actions { display: none; } body { background: #fff; padding: 0; } .sheet { box-shadow: none; border: none; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="brandrow">
        <img class="logo" src="${assetUrl('/icon-192.png')}" alt="" width="56" height="56" />
        <div>
        <div class="brand">${BRAND_NAME}</div>
        <div class="tagline">${BRAND_TAGLINE}</div>
        <div style="font-size:10px;color:#94a3b8;margin-top:6px;">WhatsApp: ${WHATSAPP_PHONE}</div>
        </div>
      </div>
      <div>
        <div class="inv-title">RECEIPT / INVOICE</div>
        <div class="inv-num">${escapeHtml(order.orderNumber)}</div>
        <div style="font-size:10px;color:#64748b;text-align:right;margin-top:4px;">Date: ${escapeHtml(order.date)}</div>
        <div style="font-size:10px;color:#64748b;text-align:right;">Status: ${escapeHtml(order.status)}</div>
      </div>
    </div>

    <div class="grid">
      <div class="box">
        <h4>Bill To</h4>
        <p><strong>${escapeHtml(order.customerName)}</strong></p>
        ${order.customerEmail ? `<p>${escapeHtml(order.customerEmail)}</p>` : ''}
        ${order.customerPhone ? `<p>${escapeHtml(order.customerPhone)}</p>` : ''}
      </div>
      <div class="box">
        <h4>Ship To</h4>
        <p>${escapeHtml(order.deliveryAddress.fullName)}</p>
        <p>${escapeHtml(order.deliveryAddress.address)}</p>
        <p>${escapeHtml(order.deliveryAddress.city)}, ${escapeHtml(order.deliveryAddress.state)}${order.deliveryAddress.postalCode ? ' ' + escapeHtml(order.deliveryAddress.postalCode) : ''}</p>
        <p>${escapeHtml(order.deliveryAddress.phone)}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="center">Qty</th>
          <th class="right">Unit Price</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div class="totals">
      <div class="row"><span>Subtotal</span><span>${formatMoney(order.subtotal)}</span></div>
      <div class="row"><span>Shipping / Customs</span><span style="color:#b45309;font-weight:600;">Not included</span></div>
      <div class="row grand"><span>Total (products)</span><span>${formatMoney(order.totalAmount)}</span></div>
    </div>

    <div class="disclaimer">
      <strong>Shipping disclaimer:</strong> ${escapeHtml(order.shippingNote || 'Product prices exclude international shipping, customs charges, and other applicable delivery fees unless explicitly stated. Additional charges will be communicated according to the order’s sourcing and delivery arrangements.')}
    </div>

    <div class="footer">
      Thank you for pre-ordering with ${BRAND_NAME}. This receipt is generated automatically. Payments are subject to verification. For support, contact us on WhatsApp ${WHATSAPP_PHONE}.
    </div>

    <div class="actions">
      <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
      <a class="btn btn-wa" href="${WHATSAPP_LINK}?text=${encodeURIComponent('Hello Helen\'s Varieties Venture. Here is my order ' + order.orderNumber + ' (total ' + formatMoney(order.totalAmount) + '). Please confirm and advise on shipping. Invoice: ' + (typeof window !== 'undefined' ? window.location.href : ''))}" target="_blank" rel="noopener noreferrer">Send to WhatsApp</a>
    </div>
  </div>
</body>
</html>`;
}

export function openInvoice(order: Order): void {
  const html = buildInvoiceHtml(order);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => URL.revokeObjectURL(url);
  }
}
