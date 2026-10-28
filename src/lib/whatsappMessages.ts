import { Product, CartItem } from '../types';

export const WHATSAPP_PHONE = '07032583937';
export const WHATSAPP_INTERNATIONAL = '2347032583937';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_INTERNATIONAL}`;

export const SHIPPING_DISCLAIMER =
  'Shipping, customs and other delivery fees are excluded unless explicitly stated. ' +
  'They will be confirmed separately based on cargo weight and delivery arrangements.';

export const formatMoney = (amount: number): string => `₦${amount.toLocaleString()}`;

export const variantLabel = (selectedVariants: Record<string, string>): string =>
  Object.entries(selectedVariants || {})
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

/**
 * Builds a prefilled WhatsApp message for a product enquiry / pre-order request.
 * Never includes passwords, payment credentials, or sensitive personal data.
 */
export function buildProductWhatsAppMessage({
  product,
  selectedVariants,
  quantity,
  baseUrl,
}: {
  product: Product;
  selectedVariants?: Record<string, string>;
  quantity: number;
  baseUrl: string;
}): string {
  const variants = variantLabel(selectedVariants);
  const unitTotal = product.price * quantity;
  const productUrl = `${baseUrl}/product/${product.id}`;
  const lines = [
    `Hello Helen's Varieties Venture. I am interested in pre-ordering ${product.name}.`,
    variants ? `Variant: ${variants}.` : '',
    `Quantity: ${quantity}.`,
    `Product price shown: ${formatMoney(unitTotal)}.`,
    `Product link: ${productUrl}`,
    '',
    'Please confirm availability and explain the shipping charges.',
    '',
    SHIPPING_DISCLAIMER,
  ];
  return lines.filter(Boolean).join('\n');
}

/**
 * Builds a prefilled WhatsApp message from the current shopping cart.
 * Contains only item names, variants, quantities, subtotals and product links.
 */
export function buildCartWhatsAppMessage({
  cartItems,
  baseUrl,
}: {
  cartItems: CartItem[];
  baseUrl: string;
}): string {
  const total = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const lines = [
    `Hello Helen's Varieties Venture. I would like to place a pre-order for the following items:`,
    '',
    ...cartItems.map((item) => {
      const variants = variantLabel(item.selectedVariants);
      const subtotal = item.unitPrice * item.quantity;
      return `- ${item.product.name}${variants ? ` (${variants})` : ''} x ${item.quantity} — ${formatMoney(subtotal)} — ${baseUrl}/product/${item.product.id}`;
    }),
    '',
    `Estimated product subtotal: ${formatMoney(total)}.`,
    '',
    SHIPPING_DISCLAIMER,
    'Please confirm availability and advise on next steps. I understand this message starts a conversation — it does not confirm an order until we agree on shipping and payment.',
  ];
  return lines.filter(Boolean).join('\n');
}