import { Product, CartItem } from '../types';

export const BRAND_NAME = "Helen's Varieties Venture";
export const WHATSAPP_PHONE = '07032583937';
export const WHATSAPP_LINK = 'https://wa.me/2347032583937';
export const CURRENCY = '₦';

export const SHIPPING_DISCLAIMER =
  'Note: product prices exclude international shipping, customs charges, and other applicable delivery fees unless explicitly stated. ' +
  'Additional charges are communicated according to the order’s sourcing and delivery arrangements.';

export const PRE_ORDER_EXPLANATION =
  'Pre-ordering means we source the item directly from verified 1688 manufacturers and global suppliers after you place your order. ' +
  'We inspect the product, arrange air or sea cargo freight to Nigeria, clear customs, and deliver to your doorstep (or our Lagos warehouse for pickup). ' +
  'Sourcing typically takes 10–15 working days by air cargo or 35–45 days by sea cargo, depending on the item.';

export function formatPrice(amount: number): string {
  return `${CURRENCY}${amount.toLocaleString()}`;
}

function matchProducts(query: string, products: Product[]): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    const haystack = `${p.name} ${p.description} ${p.category} ${(p.keywords || []).join(' ')} ${Object.values(p.specifications || {}).join(' ')}`.toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}

function findProductByNameOrSku(query: string, products: Product[]): Product | undefined {
  const q = query.toLowerCase();
  return products.find(
    (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );
}

interface AIReply {
  text: string;
  links?: { text: string; url: string }[];
  actions?: string[];
}

function addLink(links: { text: string; url: string }[], text: string, url: string) {
  if (!links.some((l) => l.url === url)) links.push({ text, url });
}

/**
 * Generates a grounded reply from the actual catalogue and verified business info.
 * Never invents stock status, supplier quotations, delivery dates, shipping fees, or payment confirmations.
 */
export function generateAIReply({
  message,
  products,
  cart,
  user,
  orderByNumber,
}: {
  message: string;
  products: Product[];
  cart: CartItem[];
  user: { name?: string; email?: string; phone?: string } | null;
  orderByNumber: (number: string) => { orderNumber: string; status: string } | undefined;
}): AIReply {
  const m = message.toLowerCase();
  const links: { text: string; url: string }[] = [];
  const actions: string[] = [];

  // --- Order tracking ---
  const explicitRef = m.match(/#?(hv\d{5,})/i);
  const ref = explicitRef ? explicitRef[1].toUpperCase() : null;
  const isTrackingQuery = m.includes('track') || m.includes('my order') || !!ref;
  if (isTrackingQuery) {
    if (ref) {
      const order = orderByNumber(ref);
      if (order) {
        return {
          text: `Here is your tracking for ${order.orderNumber}: current status is *${order.status}*. Product prices exclude shipping until confirmed; waybill charges are shared separately after cargo landing. Need anything else?`,
          links: [{ text: 'Track my order on the website', url: '/track' }],
          actions: ['Contact support'],
        };
      }
      return {
        text: `I couldn't find an order with reference ${ref}. Please double-check the order number (e.g. #HV00123) or ask our support team on WhatsApp.`,
        links: [{ text: 'Track order', url: '/track' }, { text: 'WhatsApp support', url: WHATSAPP_LINK }],
        actions: ['Contact support'],
      };
    }
    return {
      text: "Sure! Share your order reference (e.g. #HV00123) and I'll look it up for you. You can also track it on our Track Order page.",
      links: [{ text: 'Track Order', url: '/track' }],
      actions: ['Contact support'],
    };
  }

  // --- Pre-order process ---
  if (m.includes('pre-order') || m.includes('preorder') || m.includes('how does it work') || m.includes('sourcing')) {
    return {
      text: `${PRE_ORDER_EXPLANATION}\n\nTo get started: pick a product, choose variant and quantity, then check out as a guest or registered customer. You'll need a name and at least an email address or phone number.\n\n${SHIPPING_DISCLAIMER}`,
      links: [{ text: 'Browse products', url: '/shop' }, { text: 'Pre-Order Info', url: '/pre-order' }],
      actions: ['Find a Product', 'Contact support'],
    };
  }

  // --- Shipping ---
  if (m.includes('shipping') || m.includes('delivery') || m.includes('freight') || m.includes('customs')) {
    return {
      text: `We ship via air cargo freight (10–15 working days after factory dispatch) or sea cargo freight (35–45 days for bulky items), then local delivery in Nigeria via GIG Logistics or pickup at our Lagos warehouse.\n\n${SHIPPING_DISCLAIMER}`,
      links: [{ text: 'Pre-Order & Shipping Info', url: '/pre-order' }],
      actions: ['Contact support'],
    };
  }

  // --- Human support / WhatsApp ---
  if (m.includes('human') || m.includes('support') || m.includes('whatsapp') || m.includes('talk to') || m.includes('agent')) {
    return {
      text: `You can reach our human support team on WhatsApp: ${WHATSAPP_LINK} (${WHATSAPP_PHONE}). We'll be happy to help with sourcing, orders, or anything else.\n\nNote: website chat and WhatsApp are separate channels — conversation history is not shared between them unless our team connects them manually.`,
      links: [{ text: 'Chat on WhatsApp', url: WHATSAPP_LINK }],
      actions: ['Chat with AI Assistant'],
    };
  }

  // --- Checkout / registration help ---
  if (m.includes('checkout') || m.includes('register') || m.includes('account') || m.includes('guest')) {
    return {
      text: 'You can check out as a guest (name + at least an email address or phone number) or create a customer account to track orders and save addresses. Website orders and WhatsApp enquiries are handled separately — WhatsApp messages start a conversation and do not confirm an order on their own.',
      links: [{ text: 'Checkout', url: '/checkout' }, { text: 'Register / Login', url: '/login' }],
      actions: ['Browse Products', 'Contact support'],
    };
  }

  // --- Price / product-specific enquiry ---
  const priceMatch = m.match(/price|cost|how much|₦|naira/i);
  const productQuery = m.replace(/\b(price|cost|how much|is there|do you have|available|tell me about|details|specs|specification)\b/gi, '').trim();
  const specific = productQuery ? findProductByNameOrSku(productQuery, products) : undefined;

  if (specific || priceMatch) {
    if (specific) {
      const variants = Object.entries(specific.variants || {})
        .map(([name, variant]) => `${name}: ${variant.options.join(', ')}`)
        .join('; ');
      const specs = Object.entries(specific.specifications || {})
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
      return {
        text: `${specific.name} — ${formatPrice(specific.price)}\n${specific.description}\n\n${variants ? `Variants: ${variants}\n` : ''}${specs ? `Specifications:\n${specs}\n\n` : ''}Sourcing timeframe: ${specific.sourcingTimeframe}. ${specific.isPreOrder ? 'This is a pre-order item sourced from verified suppliers.' : ''}\n${SHIPPING_DISCLAIMER}`,
        links: [{ text: `View ${specific.name}`, url: `/product/${specific.id}` }],
        actions: ['Find another product', 'Contact support'],
      };
    }
    return {
      text: "I'd be happy to check prices! Which product are you interested in? You can name it or share a category, and I'll look it up in our catalogue.",
      links: [{ text: 'Browse catalogue', url: '/shop' }],
      actions: ['Find a Product'],
    };
  }

  // --- Product search / recommendations ---
  if (m.includes('find') || m.includes('search') || m.includes('recommend') || m.includes('looking for') || m.includes('budget') || m.includes('under')) {
    let results = products;
    let note = '';
    const budgetMatch = m.match(/under\s*₦?\s*([\d,]+)|below\s*₦?\s*([\d,]+)|budget\s*₦?\s*([\d,]+)/i);
    if (budgetMatch) {
      const cap = Number((budgetMatch[1] || budgetMatch[2] || budgetMatch[3]).replace(/,/g, ''));
      results = results.filter((p) => p.price <= cap);
      note = `Here are products under ${formatPrice(cap)}:`;
    } else if (productQuery) {
      results = matchProducts(productQuery, products);
      note = `Results for "${productQuery}":`;
    }

    const top = results.slice(0, 4);
    if (top.length > 0) {
      const list = top.map((p) => `• ${p.name} — ${formatPrice(p.price)}${p.isPreOrder ? ' (pre-order)' : ''}`).join('\n');
      return {
        text: `${note || 'Here are some options:'}\n${list}\n\nWant details on any of these? Tell me the name and I'll show specifications and variants.\n${SHIPPING_DISCLAIMER}`,
        links: top.map((p) => ({ text: `View ${p.name}`, url: `/product/${p.id}` })),
        actions: ['Browse Categories', 'Contact support'],
      };
    }
    return {
      text: `I couldn't find anything matching that in our catalogue right now. You can browse all categories or ask our team on WhatsApp.\n${SHIPPING_DISCLAIMER}`,
      links: [{ text: 'Browse catalogue', url: '/shop' }, { text: 'WhatsApp support', url: WHATSAPP_LINK }],
      actions: ['Contact support'],
    };
  }

  // --- Cart enquiry ---
  if (m.includes('cart') || m.includes('basket')) {
    if (cart.length === 0) {
      return {
        text: 'Your cart is currently empty. Browse our catalogue to add items for pre-order.',
        links: [{ text: 'Browse Products', url: '/shop' }],
        actions: ['Find a Product'],
      };
    }
    const list = cart.map((i) => `- ${i.product.name} x ${i.quantity} — ${formatPrice(i.unitPrice * i.quantity)}`).join('\n');
    const subtotal = cart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    return {
      text: `Your cart contains:\n${list}\n\nEstimated product subtotal: ${formatPrice(subtotal)}.\n${SHIPPING_DISCLAIMER}\nWould you like to proceed to checkout or continue with WhatsApp ordering?`,
      links: [{ text: 'View Cart', url: '/cart' }, { text: 'Checkout', url: '/checkout' }],
      actions: ['Order on WhatsApp', 'Contact support'],
    };
  }

  // --- General fallback ---
  const namePart = user?.name ? `, ${user.name}` : '';
  return {
    text: `Hello${namePart}! I'm your AI shopping assistant at Helen's Varieties Venture. I can help you find products, check prices and specifications, explain pre-orders and shipping, track orders, or connect you with our support team on WhatsApp (${WHATSAPP_PHONE}).\n\nWhat are you looking for today?`,
    links: [
      { text: 'Browse Products', url: '/shop' },
      { text: 'Track Order', url: '/track' },
      { text: 'WhatsApp Support', url: WHATSAPP_LINK },
    ],
    actions: ['Find a Product', 'Browse Categories', 'Contact support'],
  };
}
