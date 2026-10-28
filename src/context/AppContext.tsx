import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../mockData';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: string;
  city?: string;
  state?: string;
}

interface AppContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  addToCart: (product: Product, selectedVariants: Record<string, string>, quantity?: number) => void;
  removeFromCart: (productId: string, selectedVariants: Record<string, string>) => void;
  updateCartQuantity: (productId: string, selectedVariants: Record<string, string>, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  loginAs: (role: 'customer' | 'admin', email?: string) => void;
  logout: () => void;
  formatPrice: (amount: number) => string;
}

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
      },
      {
        productId: 'prod-6',
        product: INITIAL_PRODUCTS[5],
        selectedVariants: { 'Color': 'Cognac Brown' },
        quantity: 1,
        unitPrice: 16800
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('hv_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hv_user');
    return saved ? JSON.parse(saved) : {
      id: 'cust-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+234 801 234 5678',
      role: 'customer',
      address: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos State'
    };
  });

  useEffect(() => {
    localStorage.setItem('hv_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hv_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hv_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hv_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hv_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hv_user');
    }
  }, [user]);

  const formatPrice = (amount: number): string => {
    return '₦ ' + amount.toLocaleString('en-NG');
  };

  const getVariantKey = (variants: Record<string, string>) => {
    return Object.entries(variants).sort().map(([k, v]) => `${k}:${v}`).join('|');
  };

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

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>): Order => {
    const newOrderNumber = `#HV00${124 + orders.length}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending Payment',
      sourcingNotes: [
        {
          date: new Date().toLocaleString(),
          message: 'Pre-order placed. Awaiting initial payment confirmation to initiate sourcing.'
        }
      ]
    };
    setOrders(prev => [newOrder, ...prev]);
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
        return {
          ...order,
          status,
          sourcingNotes: updatedNotes
        };
      }
      return order;
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const loginAs = (role: 'customer' | 'admin', email = role === 'admin' ? 'admin@helenvarieties.com' : 'johndoe@example.com') => {
    setUser({
      id: role === 'admin' ? 'admin-1' : 'cust-1',
      name: role === 'admin' ? 'Helen Varieties Admin' : 'John Doe',
      email,
      phone: '+234 801 234 5678',
      role,
      address: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos State'
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        cart,
        wishlist,
        user,
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
        loginAs,
        logout,
        formatPrice
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

