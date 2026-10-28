export interface ProductVariant {
  id: string;
  name: string; // e.g., "Color" or "Storage"
  value: string; // e.g., "White", "Black", "256GB"
  sku?: string;
  additionalPrice?: number;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Confirmed'
  | 'Awaiting Sourcing'
  | 'Sourcing in Progress'
  | 'Supplier Confirmed'
  | 'Purchased from Supplier'
  | 'In Transit'
  | 'Customs/Local Processing'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refund Requested'
  | 'Refunded';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number; // in NGN
  supplierPriceRMB?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  primaryImage: string;
  variants: {
    name: string;
    options: string[];
  }[];
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isPreOrder: boolean;
  sourcingTimeframe: string;
  supplierInfo?: string;
  minOrderQuantity?: number;
  keywords?: string[];
}

export interface CartItem {
  productId: string;
  product: Product;
  selectedVariants: Record<string, string>;
  quantity: number;
  unitPrice: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  selectedVariants: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingNote: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentReference?: string;
  sourcingNotes?: {
    date: string;
    message: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount?: number;
}

