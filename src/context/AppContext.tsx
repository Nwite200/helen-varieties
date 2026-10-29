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
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../mockData';
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
  user: User | null;
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
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  
  // Product Actions
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  // Customer Auth
  customerRegister: (name: string, email: string, phone: string, password?: string) => { success: boolean; error?: string };
  customerLogin: (email: string, password?: string) => { success: boolean; error?: string };
  customerLogout: () => void;
  updateCustomerProfile: (data: Partial<User>) => void;
  addCustomerAddress: (address: Omit<UserAddress, 'id'>) => void;
  deleteCustomerAddress: (id: string) => void;

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
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hv_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hv_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [aiConfig, setAiConfig] = useState<AIAssistantConfig>(() => {
    const saved = localStorage.getItem('hv_ai_config');
    return saved ? { ...DEFAULT_AI_CONFIG, ...JSON.parse(saved) } : DEFAULT_AI_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('hv_ai_config', JSON.stringify(aiConfig));
  }, [aiConfig]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hv_cart');
    return saved ? JSON.parse(saved) : [
      {
        productId: 'prod-1',
        product: INITIAL_PRODUCTS[0],
        selectedVariants: { 'Color': 'White' },
        quantity: 1,
        unitPrice: 18500
      },
      {
        productId: 'prod-2',
        product: INITIAL_PRODUCTS[1],
        selectedVariants: { 'Band Color': 'Midnight Black' },
        quantity: 1,
        unitPrice: 32000
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('hv_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
  });

  // Active Customer Session
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hv_customer_session');
    return saved ? JSON.parse(saved) : {
      id: 'cust-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '08012345678',
      role: 'customer',
      isEmailVerified: true,
      createdAt: '2026-10-20',
      addresses: [
        {
          id: 'addr-1',
          fullName: 'John Doe',
          phone: '+234 801 234 5678',
          street: '123 Main Street, Victoria Island',
          city: 'Lagos',
          state: 'Lagos State',
          isDefault: true
        }
      ]
    };
  });

  // Separate, Protected Admin Session
  const [adminUser, setAdminUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hv_admin_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('hv_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [whatsappConversations, setWhatsappConversations] = useState<WhatsAppConversation[]>(() => {
    const saved = localStorage.getItem('hv_whatsapp_convs');
    return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_CONVERSATIONS;
  });

  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>(() => {
    const saved = localStorage.getItem('hv_whatsapp_config');
    return saved ? JSON.parse(saved) : DEFAULT_WHATSAPP_CONFIG;
  });

  // Local storage synchronizations
  useEffect(() => { localStorage.setItem('hv_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('hv_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('hv_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('hv_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => {
    if (user) localStorage.setItem('hv_customer_session', JSON.stringify(user));
    else localStorage.removeItem('hv_customer_session');
  }, [user]);
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
  useEffect(() => { localStorage.setItem('hv_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('hv_whatsapp_convs', JSON.stringify(whatsappConversations)); }, [whatsappConversations]);
  useEffect(() => { localStorage.setItem('hv_whatsapp_config', JSON.stringify(whatsappConfig)); }, [whatsappConfig]);

  const formatPrice = (amount: number): string => {
    return '₦ ' + amount.toLocaleString('en-NG');
  };

  const getWhatsAppLink = (prefilledText?: string): string => {
    const baseNumber = whatsappConfig.internationalNumber || '2347032583937';
    const text = prefilledText 
      ? encodeURIComponent(prefilledText)
      : encodeURIComponent("Hello Helen's Varieties Venture, I would like to inquire about sourcing and pre-orders.");
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
    // Try the server (D1) first so orders are persisted and trackable across devices.
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          deliveryAddress: orderData.deliveryAddress,
          items: orderData.items,
          isGuest: orderData.isGuest,
          paymentMethod: orderData.paymentMethod,
        }),
      });
      if (res.ok) {
        const data = await res.json() as any;
        const newOrder: Order = {
          ...orderData,
          id: `ord-${Date.now()}`,
          orderNumber: data.orderNumber,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Pending Payment',
          paymentStatus: 'Unpaid',
          trackingSecret: data.trackingSecret,
          sourcingNotes: [
            { date: new Date().toLocaleString(), message: 'Pre-order created. Initial product procurement funds pending confirmation.' }
          ],
        };
        setOrders(prev => [newOrder, ...prev]);
        logAuditEvent('CREATE_ORDER', newOrder.orderNumber, `Order placed by ${orderData.customerName} for ${formatPrice(orderData.totalAmount)}`);
        clearCart();
        return newOrder;
      }
    } catch {
      // Fall through to local generation when the API is unavailable (local dev / offline).
    }

    // Stateless fallback (no DB) — keeps the app usable in local dev.
    const newOrderNumber = `#HV00${124 + orders.length}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending Payment',
      paymentStatus: 'Unpaid',
      trackingSecret: Math.random().toString(36).substring(2, 10),
      sourcingNotes: [
        { date: new Date().toLocaleString(), message: 'Pre-order created. Initial product procurement funds pending confirmation.' }
      ]
    };
    setOrders(prev => [newOrder, ...prev]);
    logAuditEvent('CREATE_ORDER', newOrderNumber, `Order placed by ${orderData.customerName} for ${formatPrice(orderData.totalAmount)}`);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const notes = order.sourcingNotes || [];
        const updatedNotes = note ? [
          ...notes,
          { date: new Date().toLocaleString(), message: note }
        ] : notes;
        const paymentStatus = (status === 'Payment Confirmed' || status === 'Purchased from Supplier' || status === 'In Transit' || status === 'Delivered') 
          ? 'Paid' 
          : status === 'Refunded' ? 'Refunded' : order.paymentStatus || 'Unpaid';
        
        logAuditEvent('UPDATE_ORDER_STATUS', order.orderNumber, `Status set to "${status}". Note: ${note || 'None'}`);
        return {
          ...order,
          status,
          paymentStatus,
          sourcingNotes: updatedNotes
        };
      }
      return order;
    }));
  };

  // Product management
  const addProduct = (product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
    logAuditEvent('CREATE_PRODUCT', newProduct.sku, `Added product ${newProduct.name} at ${formatPrice(newProduct.price)}`);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    logAuditEvent('UPDATE_PRODUCT', updated.sku, `Modified product details for ${updated.name}`);
  };

  const deleteProduct = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    setProducts(prev => prev.filter(item => item.id !== productId));
    if (p) logAuditEvent('DELETE_PRODUCT', p.sku, `Removed product ${p.name}`);
  };

  // Customer Authentication & Profile
  const customerRegister = (name: string, email: string, phone: string, _password?: string) => {
    const newUser: User = {
      id: `cust-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      phone,
      role: 'customer',
      isEmailVerified: false,
      createdAt: new Date().toISOString().split('T')[0],
      addresses: []
    };
    setUser(newUser);
    return { success: true };
  };

  const customerLogin = (email: string, _password?: string) => {
    const existing: User = {
      id: 'cust-1',
      name: email.split('@')[0].replace('.', ' '),
      email: email.toLowerCase().trim(),
      phone: '+234 801 234 5678',
      role: 'customer',
      isEmailVerified: true,
      createdAt: '2026-10-28',
      addresses: [
        {
          id: 'addr-1',
          fullName: 'John Doe',
          phone: '+234 801 234 5678',
          street: '123 Main Street, Victoria Island',
          city: 'Lagos',
          state: 'Lagos State',
          isDefault: true
        }
      ]
    };
    setUser(existing);
    return { success: true };
  };

  const customerLogout = () => {
    setUser(null);
  };

  const updateCustomerProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const addCustomerAddress = (address: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddress: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`
    };
    const updated = [...(user.addresses || []), newAddress];
    setUser({ ...user, addresses: updated });
  };

  const deleteCustomerAddress = (id: string) => {
    if (!user) return;
    const updated = (user.addresses || []).filter(a => a.id !== id);
    setUser({ ...user, addresses: updated });
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
        name: 'Helen Varieties Super Admin',
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
        user,
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
        customerRegister,
        customerLogin,
        customerLogout,
        updateCustomerProfile,
        addCustomerAddress,
        deleteCustomerAddress,
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
