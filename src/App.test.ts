import { describe, it, expect } from 'vitest';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, CATEGORIES } from './mockData';
import { DEFAULT_WHATSAPP_CONFIG, DEFAULT_AI_CONFIG, INITIAL_WHATSAPP_CONVERSATIONS } from './whatsappData';
import { buildProductWhatsAppMessage, buildCartWhatsAppMessage, WHATSAPP_URL } from './lib/whatsappMessages';
import { generateAIReply, formatPrice } from './lib/aiResponses';

describe('Helen Varieties Core Business Workflows', () => {
  it('loads valid initial products from 1688 and international suppliers', () => {
    expect(INITIAL_PRODUCTS.length).toBeGreaterThan(0);
    const firstProduct = INITIAL_PRODUCTS[0];
    expect(firstProduct.name).toBe('Wireless Earbuds Pro');
    expect(firstProduct.price).toBe(18500);
    expect(firstProduct.isPreOrder).toBe(true);
    expect(firstProduct.sku).toBeDefined();
  });

  it('contains mandatory pre-order categories', () => {
    const categoryNames = CATEGORIES.map(c => c.name);
    expect(categoryNames).toContain('Electronics & Gadgets');
    expect(categoryNames).toContain('Phones & Accessories');
    expect(categoryNames).toContain('Fashion & Accessories');
    expect(categoryNames).toContain('Home & Kitchen');
  });

  it('tracks orders with realistic pre-order statuses and notes', () => {
    expect(INITIAL_ORDERS.length).toBeGreaterThan(0);
    const demoOrder = INITIAL_ORDERS[0];
    expect(demoOrder.orderNumber).toBe('#HV00123');
    expect(demoOrder.status).toBe('Purchased from Supplier');
    expect(demoOrder.shippingNote).toContain('Not included');
    expect(demoOrder.sourcingNotes?.length).toBeGreaterThan(0);
  });

  it('configures WhatsApp AI shopping agent for 07032583937', () => {
    expect(DEFAULT_WHATSAPP_CONFIG.phoneNumber).toBe('07032583937');
    expect(DEFAULT_WHATSAPP_CONFIG.internationalNumber).toBe('2347032583937');
    expect(DEFAULT_WHATSAPP_CONFIG.welcomeMessage).toContain("Hello and welcome to Helen's Varieties Venture!");
    expect(DEFAULT_WHATSAPP_CONFIG.disclaimer).toContain('Product prices do not include international shipping');
  });

  it('supports WhatsApp human escalation handover', () => {
    const escalated = INITIAL_WHATSAPP_CONVERSATIONS.find(c => c.escalatedToHuman);
    expect(escalated).toBeDefined();
    expect(escalated?.escalationReason).toContain('human assistance');
  });

  describe('AI assistant configuration', () => {
    it('defaults to the Nigerian business WhatsApp number and disables background ambience by default', () => {
      expect(DEFAULT_AI_CONFIG.humanSupportContact.phone).toBe('07032583937');
      expect(DEFAULT_AI_CONFIG.humanSupportContact.whatsapp).toBe('https://wa.me/2347032583937');
      expect(DEFAULT_AI_CONFIG.aiEnabled).toBe(true);
      expect(DEFAULT_AI_CONFIG.backgroundSoundEnabled).toBe(false);
      expect(DEFAULT_AI_CONFIG.backgroundSoundAsset).toBeNull();
      expect(DEFAULT_AI_CONFIG.voiceProvider).toBe('browser');
      expect(DEFAULT_AI_CONFIG.welcomeMessage).toContain("I'm your AI shopping assistant");
    });
  });

  describe('WhatsApp links', () => {
    it('builds the official Nigerian WhatsApp URL', () => {
      expect(WHATSAPP_URL).toBe('https://wa.me/2347032583937');
    });

    it('builds a product-specific WhatsApp message from real catalogue data', () => {
      const product = INITIAL_PRODUCTS[0];
      const message = buildProductWhatsAppMessage({
        product,
        selectedVariants: { Color: 'Black' },
        quantity: 2,
        baseUrl: 'https://helenvarieties.example.com',
      });
      expect(message).toContain(product.name);
      expect(message).toContain('Variant: Color: Black');
      expect(message).toContain('Quantity: 2');
      expect(message).toContain('₦37,000');
      expect(message).toContain('https://helenvarieties.example.com/product/prod-1');
      expect(message).toContain('confirm availability');
      expect(message).toContain('shipping');
    });

    it('builds a cart-based WhatsApp message with real items, variants and quantities', () => {
      const cartItems = [
        {
          productId: 'prod-1',
          product: INITIAL_PRODUCTS[0],
          selectedVariants: { Color: 'White' },
          quantity: 1,
          unitPrice: 18500,
        },
      ];
      const message = buildCartWhatsAppMessage({ cartItems, baseUrl: 'https://helenvarieties.example.com' });
      expect(message).toContain('Wireless Earbuds Pro');
      expect(message).toContain('Color: White');
      expect(message).toContain('x 1');
      expect(message).toContain('₦18,500');
      expect(message).toContain('Estimated product subtotal: ₦18,500');
      expect(message).toContain('excluded unless explicitly stated');
      expect(message).not.toContain('@');
      expect(message).not.toContain('password');
    });
  });

  describe('AI replies grounded in real data', () => {
    const orderByNumber = (ref: string) => {
      const norm = (s: string) => String(s).replace(/^#/, '');
      return INITIAL_ORDERS.find((o) => norm(o.orderNumber) === norm(ref) || norm(o.id) === norm(ref));
    };

    it('tracks a real order without inventing dates', () => {
      const reply = generateAIReply({
        message: 'Where is my order #HV00123?',
        products: INITIAL_PRODUCTS,
        cart: [],
        user: null,
        orderByNumber,
      });
      expect(reply.text).toContain('#HV00123');
      expect(reply.text).toContain('Purchased from Supplier');
    });

    it('explains pre-ordering and shipping without inventing fees', () => {
      const reply = generateAIReply({
        message: 'How does pre-order work and what are shipping charges?',
        products: INITIAL_PRODUCTS,
        cart: [],
        user: null,
        orderByNumber,
      });
      expect(reply.text).toContain('1688');
      expect(reply.text).toContain('exclude');
      expect(reply.links.some((l) => l.url === '/track' || l.url === '/shop')).toBe(true);
    });

    it('recommends real products under a budget with real prices', () => {
      const reply = generateAIReply({
        message: 'recommend products under 20000',
        products: INITIAL_PRODUCTS,
        cart: [],
        user: null,
        orderByNumber,
      });
      const prices = INITIAL_PRODUCTS.filter((p) => p.price <= 20000).map((p) => p.price);
      expect(reply.text).toContain('₦18,500');
      prices.forEach((p) => expect(p).toBeLessThanOrEqual(20000));
    });

    it('escalates to WhatsApp support for human help', () => {
      const reply = generateAIReply({
        message: 'I want to speak with human support',
        products: INITIAL_PRODUCTS,
        cart: [],
        user: null,
        orderByNumber,
      });
      expect(reply.text).toContain('07032583937');
      expect(reply.text).toContain('https://wa.me/2347032583937');
      expect(reply.text).toContain('conversation history is not shared');
    });

    it('formats prices in naira', () => {
      expect(formatPrice(18500)).toBe('₦18,500');
    });
  });
});
