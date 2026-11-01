import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  User, 
  UserRole,
  UserAddress,
  WhatsAppConversation, 
  AuditLog, 
  WhatsAppConfig,
  AIAssistantConfig
} from '../types';
import { INITIAL_PRODUCTS } from '../mockData';
import { 
  INITIAL_AUDIT_LOGS, 
  INITIAL_WHATSAPP_CONVERSATIONS, 
  DEFAULT_WHATSAPP_CONFIG,
  DEFAULT_AI_CONFIG
} from '../whatsappData';

interface AppContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  adminUser: User | null;
  auditLogs: AuditLog[];
  whatsappConversations: WhatsAppConversation[];
  whatsappConfig: WhatsAppConfig;
  
  // Cart Actions
  addToCart: (product: Product, selectedVariants: Record<string, string>, quantity?: number) => void;
  removeFromCart: (productId: string, selectedVariants: Record<string, string>) => void;
  updateCartQuantity: (productId: string, selectedVariants: Record<string, string>, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  
  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  
  // Product Actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  uploadProductImage: (file: File) => Promise<string>;
  productsLoading: boolean;
  productsError: boolean;
  refreshProducts: () => Promise<void>;
  
  // Admin Auth & Access
  adminLogin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  logAuditEvent: (action: string, target: string, details: string) => void;

  // WhatsApp Actions
  updateWhatsAppConfig: (config: Partial<WhatsAppConfig>) => void;
  sendWhatsAppMessage: (conversationId: string, text: string, sender?: 'admin' | 'ai') => void;
  escalateWhatsAppConversation: (conversationId: string, reason: string) => void;
  resolveWhatsAppEscalation: (conversationId: string) => void;

  // AI Assistant Configuration (admin only)
  aiConfig: AIAssistantConfig;
  updateAiConfig: (config: Partial<AIAssistantConfig>) => void;

  // Utilities
  formatPrice: (amount: number) => string;
  getWhatsAppLink: (prefilledText?: string) => string;
}

const ADMIN_TOKEN_KEY = 'hv_admin_token';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // The catalogue lives on the server (D1). Demo products are only used while developing locally.
  const [products, setProducts] = useState<Product[]>(() => (import.meta.env.DEV ? INITIAL_PRODUCTS : []));
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  // Orders are only loaded for a signed-in administrator, straight from the server.
  const [orders, setOrders] = useState<Order[]>([]);

  const getAdminToken = (): string | null => {
    try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; }
  };

  const adminFetch = async (path: string, init: RequestInit = {}): Promise<any> => {
    const token = getAdminToken();
    const isBody = typeof init.body === 'string';
    const res = await fetch(path, {
      ...init,
      headers: {
        ...(isBody ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers || {}),
        Authorization: `Bearer ${token || ''}`,
      },
    });
    const data = await res.json().catch(() => ({} as any));
    if (res.status === 401) {
      try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch { /* ignore */ }
      setAdminUser(null);
      throw new Error('Your admin session has expired. Please sign in again.');
    }
    if (!res.ok) throw new Error(data.error || 'Request failed. Please try again.');
    return data;
  };

  const refreshProducts = async (): Promise<void> => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('bad status');
      const data = await res.json() as { products?: Product[] };
      const list = Array.isArray(data.products) ? data.products : [];
      // In local development, keep the demo catalogue when the API has nothing yet.
      if (list.length || !import.meta.env.DEV) setProducts(list);
      setProductsError(false);
    } catch {
      if (!import.meta.env.DEV) setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    // Old per-browser copies are no longer used.
    try { ['hv_products', 'hv_orders', 'hv_audit_logs', 'hv_whatsapp_convs', 'hv_customer_session'].forEach((k) => localStorage.removeItem(k)); } catch { /* ignore */ }
    refreshProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [aiConfig, setAiConfig] = useState<AIAssistantConfig>(() => {
    const saved = localStorage.getItem('hv_ai_config');
    return saved ? { ...DEFAULT_AI_CONFIG, ...JSON.parse(saved) } : DEFAULT_AI_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('hv_ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hv_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('hv_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Separate, Protected Admin Session
  const [adminUser, setAdminUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hv_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => (import.meta.env.DEV ? INITIAL_AUDIT_LOGS : []));

  // Demo conversations are for local development only; the live inbox is WhatsApp itself.
  const [whatsappConversations, setWhatsappConversations] = useState<WhatsAppConversation[]>(() => (import.meta.env.DEV ? INITIAL_WHATSAPP_CONVERSATIONS : []));

  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>(() => {
    const saved = localStorage.getItem('hv_whatsapp_config');
    return saved ? JSON.parse(saved) : DEFAULT_WHATSAPP_CONFIG;
  });

  // Local storage synchronizations
  useEffect(() => { localStorage.setItem('hv_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('hv_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => {
    if (adminUser) localStorage.setItem('hv_admin_session', JSON.stringify(adminUser));
    else localStorage.removeItem('hv_admin_session');
  }, [adminUser]);

  // A saved admin session is only trusted if the server confirms its token is still genuine.
  // This also removes any "admin" session someone planted by hand in browser storage.
  useEffect(() => {
    if (!adminUser) return;
    let cancelled = false;
    const token = (() => { try { return localStorage.getItem(ADMIN_TOKEN_KEY); } catch { return null; } })();
    const reject = () => {
      if (cancelled) return;
      try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch { /* ignore */ }
      setAdminUser(null);
    };
    if (!token) { reject(); return; }
    fetch('/api/admin/verify', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (res.status === 401 || res.status === 403) reject(); })
      .catch(() => { /* offline: keep the session until the server can be reached */ });
    return () => { cancelled = true; };
    // Only on first load of a saved session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { localStorage.setItem('hv_whatsapp_config', JSON.stringify(whatsappConfig)); }, [whatsappConfig]);

  const refreshOrders = async (): Promise<void> => {
    if (!getAdminToken()) return;
    try {
      const data = await adminFetch('/api/admin/orders');
      setOrders(data.orders || []);
      const audit = await adminFetch('/api/admin/audit');
      setAuditLogs((audit.logs || []).map((l: any) => ({ ...l, timestamp: String(l.timestamp).replace('T', ' ').substring(0, 19), ipAddress: '' })));
    } catch { /* leaves the previous list in place */ }
  };

  useEffect(() => {
    if (adminUser) refreshOrders();
    else setOrders([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminUser?.email]);

  const formatPrice = (amount: number): string => {
    return '₦ ' + amount.toLocaleString('en-NG');
  };

  const getWhatsAppLink = (prefilledText?: string): string => {
    const baseNumber = whatsappConfig.internationalNumber || '2347032583937';
    const text = prefilledText 
      ? encodeURIComponent(prefilledText)
      : encodeURIComponent("Hello Helen's Varieties Venture, I would like to inquire about sourcing and orders.");
    return `https://wa.me/${baseNumber}?text=${text}`;
  };

  const logAuditEvent = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: adminUser ? `${adminUser.email} (${adminUser.role})` : 'System Daemon',
      action,
      target,
      details,
      ipAddress: '102.89.44.12'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getVariantKey = (variants: Record<string, string>) => {
    return Object.entries(variants).sort().map(([k, v]) => `${k}:${v}`).join('|');
  };

  // Cart operations
  const addToCart = (product: Product, selectedVariants: Record<string, string>, quantity = 1) => {
    const incomingKey = getVariantKey(selectedVariants);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && getVariantKey(item.selectedVariants) === incomingKey
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          selectedVariants,
          quantity,
          unitPrice: product.price
        }
      ];
    });
  };

  const removeFromCart = (productId: string, selectedVariants: Record<string, string>) => {
    const targetKey = getVariantKey(selectedVariants);
    setCart(prev => prev.filter(
      item => !(item.productId === productId && getVariantKey(item.selectedVariants) === targetKey)
    ));
  };

  const updateCartQuantity = (productId: string, selectedVariants: Record<string, string>, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariants);
      return;
    }
    const targetKey = getVariantKey(selectedVariants);
    setCart(prev => prev.map(item => {
      if (item.productId === productId && getVariantKey(item.selectedVariants) === targetKey) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Order management
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>): Promise<Order> => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        deliveryAddress: orderData.deliveryAddress,
        // Only ids, options and quantities are sent; the server applies the real prices.
        items: orderData.items.map((it) => ({ productId: it.productId, quantity: it.quantity, selectedVariants: it.selectedVariants })),
        isGuest: true,
        paymentMethod: orderData.paymentMethod,
      }),
    });
    const data = await res.json().catch(() => ({} as any));
    if (!res.ok) {
      throw new Error(data.error || 'We could not place your order. Please try again or contact us on WhatsApp.');
    }
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: data.orderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending Payment',
      paymentStatus: 'Unpaid',
      trackingSecret: data.trackingSecret,
      paymentInstructions: data.payment || null,
      items: Array.isArray(data.items) ? data.items : orderData.items,
      subtotal: typeof data.subtotal === 'number' ? data.subtotal : orderData.subtotal,
      totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : orderData.totalAmount,
      sourcingNotes: [
        { date: new Date().toLocaleString(), message: 'Order created. Initial product procurement funds pending confirmation.' }
      ],
    };
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, note?: string): Promise<void> => {
    const current = orders.find((o) => o.id === orderId);
    const paymentStatus = (status === 'Payment Confirmed' || status === 'Purchased from Supplier' || status === 'In Transit' || status === 'Delivered')
      ? 'Paid'
      : status === 'Refunded' ? 'Refunded' : current?.paymentStatus || 'Unpaid';
    const data = await adminFetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus, note }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
  };

  // Product management (saved to the server; images go to R2)
  const uploadProductImage = async (file: File): Promise<string> => {
    const data = await adminFetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    return data.url as string;
  };

  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const data = await adminFetch('/api/admin/products', { method: 'POST', body: JSON.stringify(product) });
    setProducts((prev) => [data.product, ...prev]);
    return data.product as Product;
  };

  const updateProduct = async (updated: Product): Promise<void> => {
    const data = await adminFetch(`/api/admin/products/${encodeURIComponent(updated.id)}`, { method: 'PUT', body: JSON.stringify(updated) });
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? data.product : p)));
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    await adminFetch(`/api/admin/products/${encodeURIComponent(productId)}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  // Admin Authentication & Access
  // The login is checked on the server (Cloudflare secrets); the browser only holds a signed, expiring token.
  const adminLogin = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: password || '' }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || !data.token) {
        return { success: false, error: data.error || 'Invalid administrator credentials. Access restricted to authorized personnel.' };
      }
      try { localStorage.setItem(ADMIN_TOKEN_KEY, data.token); } catch { /* storage unavailable */ }
      const adminSession: User = {
        id: 'admin-super',
        name: 'Helen’s Varieties Super Admin',
        email: data.user?.email || cleanEmail,
        phone: '+234 703 258 3937',
        role: 'super_admin',
        createdAt: '2026-10-01'
      };
      setAdminUser(adminSession);
      logAuditEvent('ADMIN_LOGIN', adminSession.email, 'Super Administrator authenticated successfully.');
      return { success: true };
    } catch {
      return { success: false, error: 'Could not reach the server. Check your internet connection and try again.' };
    }
  };

  const adminLogout = () => {
    if (adminUser) {
      logAuditEvent('ADMIN_LOGOUT', adminUser.email, 'Administrator logged out of session.');
    }
    try { localStorage.removeItem(ADMIN_TOKEN_KEY); } catch { /* ignore */ }
    setAdminUser(null);
  };

  // WhatsApp Operations
  const updateWhatsAppConfig = (cfg: Partial<WhatsAppConfig>) => {
    setWhatsappConfig(prev => ({ ...prev, ...cfg }));
    logAuditEvent('UPDATE_WHATSAPP_CONFIG', 'WhatsApp Settings', 'Modified automated agent or webhook parameters.');
  };

  const updateAiConfig = (config: Partial<AIAssistantConfig>) => {
    setAiConfig(prev => ({ ...prev, ...config, updatedAt: new Date().toISOString() }));
    logAuditEvent('UPDATE_AI_ASSISTANT_CONFIG', 'AI Assistant Settings', 'Assistant configuration updated by administrator.');
  };

  const sendWhatsAppMessage = (conversationId: string, text: string, sender: 'admin' | 'ai' = 'admin') => {
    setWhatsappConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newMsg = {
          id: `wm-${Date.now()}`,
          sender,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent' as const
        };
        return {
          ...conv,
          lastMessage: text,
          lastTimestamp: newMsg.timestamp,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  const escalateWhatsAppConversation = (conversationId: string, reason: string) => {
    setWhatsappConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          escalatedToHuman: true,
          escalationReason: reason
        };
      }
      return conv;
    }));
    logAuditEvent('WHATSAPP_ESCALATION', conversationId, `Escalated to human support: ${reason}`);
  };

  const resolveWhatsAppEscalation = (conversationId: string) => {
    setWhatsappConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          escalatedToHuman: false,
          escalationReason: undefined
        };
      }
      return conv;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        cart,
        wishlist,
        adminUser,
        auditLogs,
        whatsappConversations,
        whatsappConfig,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        uploadProductImage,
        productsLoading,
        productsError,
        refreshProducts,
        refreshOrders,
        adminLogin,
        adminLogout,
        logAuditEvent,
        updateWhatsAppConfig,
        sendWhatsAppMessage,
        escalateWhatsAppConversation,
        resolveWhatsAppEscalation,
        aiConfig,
        updateAiConfig,
        formatPrice,
        getWhatsAppLink
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
