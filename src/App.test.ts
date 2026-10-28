import { describe, it, expect } from 'vitest';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, CATEGORIES } from './mockData';

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
});

