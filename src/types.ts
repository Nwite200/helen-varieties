export interface ProductVariant {
  id: string;
  name: string;
  value: string;
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

export type UserRole = 'customer' | 'admin' | 'super_admin' | 'product_manager' | 'order_manager';

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isEmailVerified?: boolean;
  avatarUrl?: string;
  addresses?: UserAddress[];
  createdAt: string;
}

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
  inStock?: boolean;
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
  paymentStatus?: 'Unpaid' | 'Paid' | 'Refunded';
  source?: 'website' | 'whatsapp';
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

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  ipAddress?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'customer' | 'ai' | 'admin';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  mediaUrl?: string;
  mediaType?: 'text' | 'voice' | 'image';
}

export interface WhatsAppConversation {
  id: string;
  customerPhone: string;
  customerName: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  escalatedToHuman: boolean;
  escalationReason?: string;
  associatedOrderNumber?: string;
  messages: WhatsAppMessage[];
}

export interface WhatsAppConfig {
  phoneNumber: string; // e.g. 07032583937
  internationalNumber: string; // 2347032583937
  provider: 'meta_cloud_api' | 'twilio' | 'unconfigured';
  isConnected: boolean;
  webhookStatus: 'verified' | 'unverified' | 'disabled';
  aiAgentEnabled: boolean;
  voiceNoteEnabled: boolean;
  welcomeMessage: string;
  disclaimer: string;
}
