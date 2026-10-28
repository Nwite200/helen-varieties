import { Product, Category, Order } from './types';

export const CATEGORIES: Category[] = [
  { id: 'electronics-gadgets', name: 'Electronics & Gadgets', slug: 'electronics-gadgets', icon: 'Headphones', itemCount: 142 },
  { id: 'phones-accessories', name: 'Phones & Accessories', slug: 'phones-accessories', icon: 'Smartphone', itemCount: 98 },
  { id: 'fashion-accessories', name: 'Fashion & Accessories', slug: 'fashion-accessories', icon: 'Shirt', itemCount: 215 },
  { id: 'home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'Utensils', itemCount: 120 },
  { id: 'beauty-personal-care', name: 'Beauty & Personal Care', slug: 'beauty-personal-care', icon: 'Sparkles', itemCount: 85 },
  { id: 'baby-kids', name: 'Baby & Kids', slug: 'baby-kids', icon: 'Smile', itemCount: 64 },
  { id: 'sports-outdoors', name: 'Sports & Outdoors', slug: 'sports-outdoors', icon: 'Trophy', itemCount: 53 },
  { id: 'automotive-accessories', name: 'Automotive Accessories', slug: 'automotive-accessories', icon: 'Car', itemCount: 41 },
  { id: 'shoes-bags', name: 'Shoes & Bags', slug: 'shoes-bags', icon: 'Briefcase', itemCount: 110 },
  { id: 'office-supplies', name: 'Office Supplies', slug: 'office-supplies', icon: 'FileText', itemCount: 37 },
  { id: 'toys-gifts', name: 'Toys & Gifts', slug: 'toys-gifts', icon: 'Gift', itemCount: 49 },
  { id: 'other-products', name: 'Other Products', slug: 'other-products', icon: 'Layers', itemCount: 30 }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'HV-WBR-001',
    name: 'Wireless Earbuds Pro',
    category: 'Electronics & Gadgets',
    description: 'Experience premium sound quality with these wireless earbuds. Designed for comfort, style and performance. Perfect for work, study, and entertainment.',
    price: 18500,
    supplierPriceRMB: 38,
    rating: 4.8,
    reviewsCount: 120,
    primaryImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Color', options: ['White', 'Black'] }
    ],
    specifications: {
      'Active Noise Cancellation': 'Yes',
      'Battery Life': 'Up to 30 Hours with Case',
      'Connectivity': 'Bluetooth 5.3',
      'Water Resistance': 'IPX5'
    },
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    isPreOrder: true,
    sourcingTimeframe: '10 - 15 working days',
    supplierInfo: '1688 Verified Gold Electronics Supplier (Guangdong)',
    minOrderQuantity: 1
  },
  {
    id: 'prod-2',
    sku: 'HV-SMW-002',
    name: 'Smart Watch Series 8',
    category: 'Electronics & Gadgets',
    description: 'Advanced biometric smartwatch with AMOLED screen, heart rate tracking, sleep analytics, and multi-sport workout modes.',
    price: 32000,
    supplierPriceRMB: 75,
    rating: 4.9,
    reviewsCount: 96,
    primaryImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Band Color', options: ['Midnight Black', 'Silver Grey', 'Rose Gold'] }
    ],
    specifications: {
      'Display': '1.92-inch AMOLED Always-On',
      'Battery': '7 days typical use',
      'Sensors': 'SpO2, Heart Rate, Pedometer',
      'Compatibility': 'iOS & Android'
    },
    isFeatured: true,
    isTrending: true,
    isPreOrder: true,
    sourcingTimeframe: '10 - 14 working days',
    supplierInfo: '1688 Direct OEM Tech Factory'
  },
  {
    id: 'prod-3',
    sku: 'HV-BTS-003',
    name: 'Portable Bluetooth Speaker',
    category: 'Electronics & Gadgets',
    description: 'Deep 360-degree stereo bass speaker with waterproof casing, party boost pairing, and 18-hour continuous playtime.',
    price: 12000,
    supplierPriceRMB: 28,
    rating: 4.7,
    reviewsCount: 54,
    primaryImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Stealth Black', 'Navy Blue', 'Forest Green'] }
    ],
    specifications: {
      'Output': '20W Peak Power',
      'Battery': '4000mAh',
      'Bluetooth': 'V5.2'
    },
    isFeatured: false,
    isTrending: true,
    isPreOrder: true,
    sourcingTimeframe: '12 - 16 working days'
  },
  {
    id: 'prod-4',
    sku: 'HV-PBK-004',
    name: 'Power Bank 20000mAh Ultra-Slim',
    category: 'Phones & Accessories',
    description: 'High-density lithium polymer portable charger with 22.5W fast charge, dual USB-A + Type-C PD input and output.',
    price: 16000,
    supplierPriceRMB: 35,
    rating: 4.8,
    reviewsCount: 88,
    primaryImage: 'https://images.unsplash.com/photo-1609592426868-b7a424ca60bb?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1609592426868-b7a424ca60bb?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Matte Black', 'Pearl White'] }
    ],
    specifications: {
      'Capacity': '20000mAh / 74Wh',
      'Fast Charge': 'PD 3.0 & QC 4.0 Support'
    },
    isFeatured: true,
    isTrending: false,
    isPreOrder: true,
    sourcingTimeframe: '10 - 15 working days'
  },
  {
    id: 'prod-5',
    sku: 'HV-MJK-005',
    name: "Men's Trendy Utility Bomber Jacket",
    category: 'Fashion & Accessories',
    description: 'Contemporary streetwear windproof bomber jacket crafted with premium water-repellent nylon weave and tactical utility pockets.',
    price: 24500,
    supplierPriceRMB: 58,
    rating: 4.9,
    reviewsCount: 76,
    primaryImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Size', options: ['M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['Black', 'Army Olive', 'Dark Khaki'] }
    ],
    specifications: {
      'Material': 'Polyester & Taslan Shell',
      'Fit': 'Modern Regular Streetwear',
      'Season': 'All Season'
    },
    isFeatured: true,
    isTrending: true,
    isPreOrder: true,
    sourcingTimeframe: '14 - 18 working days'
  },
  {
    id: 'prod-6',
    sku: 'HV-LHB-006',
    name: 'Luxury Vegan Leather Handbag',
    category: 'Shoes & Bags',
    description: 'Elegant structured tote bag featuring gold-tone brass hardware, detachable crossbody shoulder strap, and interior compartments.',
    price: 16800,
    supplierPriceRMB: 42,
    rating: 4.8,
    reviewsCount: 64,
    primaryImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Cognac Brown', 'Noir Black', 'Burgundy Red'] }
    ],
    specifications: {
      'Dimensions': '32cm x 24cm x 12cm',
      'Closure': 'Secure Zip & Magnetic Clasp',
      'Lining': 'Custom Monogram Cotton'
    },
    isFeatured: true,
    isTrending: true,
    isPreOrder: true,
    sourcingTimeframe: '10 - 15 working days'
  },
  {
    id: 'prod-7',
    sku: 'HV-AFY-007',
    name: 'Digital Air Fryer 5.5L Large Capacity',
    category: 'Home & Kitchen',
    description: 'Oil-free rapid vortex heat air fryer with 8 preset one-touch cooking programs, non-stick removable basket, and LED touch controls.',
    price: 45000,
    supplierPriceRMB: 110,
    rating: 4.9,
    reviewsCount: 48,
    primaryImage: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Piano Black / Rose Gold Accent', 'Matte White'] }
    ],
    specifications: {
      'Power': '1400 Watts',
      'Capacity': '5.5 Liters',
      'Temperature Range': '80°C - 200°C'
    },
    isFeatured: true,
    isTrending: false,
    isPreOrder: true,
    sourcingTimeframe: '15 - 20 working days'
  },
  {
    id: 'prod-8',
    sku: 'HV-RSN-008',
    name: 'Breathable Running Athletic Sneakers',
    category: 'Sports & Outdoors',
    description: 'Shock-absorbing air cushion running shoes engineered with flexible knitted upper and wear-resistant rubber grip traction.',
    price: 21500,
    supplierPriceRMB: 50,
    rating: 4.7,
    reviewsCount: 52,
    primaryImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Size (EU)', options: ['40', '41', '42', '43', '44', '45'] },
      { name: 'Color', options: ['Classic Red/White', 'All Black', 'Grey/Neon'] }
    ],
    specifications: {
      'Upper': 'Flyknit Mesh Breathable Fabric',
      'Sole': 'Anti-slip TPU Shock Absorption Cushion'
    },
    isFeatured: true,
    isTrending: true,
    isPreOrder: true,
    sourcingTimeframe: '12 - 16 working days'
  },
  {
    id: 'prod-9',
    sku: 'HV-LPS-009',
    name: 'Shockproof Laptop Sleeve & Organizer',
    category: 'Office Supplies',
    description: 'Slim water-resistant 360 protective case with velvet inner lining and front accessory pocket for charger and cables.',
    price: 8500,
    supplierPriceRMB: 20,
    rating: 4.8,
    reviewsCount: 39,
    primaryImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Size', options: ['13 - 14 inch', '15 - 16 inch'] },
      { name: 'Color', options: ['Dark Grey', 'Light Ash', 'Midnight Blue'] }
    ],
    specifications: {
      'Protection': 'CornerArmor Shock Absorbing Foam',
      'Fabric': 'Durable Waterproof Polyester'
    },
    isFeatured: false,
    isTrending: false,
    isPreOrder: true,
    sourcingTimeframe: '10 - 14 working days'
  },
  {
    id: 'prod-10',
    sku: 'HV-HUB-010',
    name: '8-in-1 USB-C Multiport Docking Hub',
    category: 'Electronics & Gadgets',
    description: 'Aluminum USB-C hub supporting 4K HDMI, 100W Power Delivery, SD/TF Card slots, and 3x USB 3.0 ultra-speed ports.',
    price: 12000,
    supplierPriceRMB: 29,
    rating: 4.9,
    reviewsCount: 61,
    primaryImage: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Model', options: ['Space Grey Aluminum'] }
    ],
    specifications: {
      'HDMI': '4K @ 30Hz / 1080P @ 60Hz',
      'PD Charging': 'Up to 100W Pass-through'
    },
    isFeatured: false,
    isTrending: true,
    isPreOrder: true,
    sourcingTimeframe: '10 - 15 working days'
  },
  {
    id: 'prod-11',
    sku: 'HV-RNG-011',
    name: '10-inch LED Ring Light with 2M Tripod',
    category: 'Electronics & Gadgets',
    description: 'Professional content creator ring light kit with adjustable color temperatures, dimming modes, and 360 rotating phone mount.',
    price: 13500,
    supplierPriceRMB: 32,
    rating: 4.7,
    reviewsCount: 45,
    primaryImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Kit Type', options: ['Ring Light + 2.1m Stand', 'Ring Light + Desktop Stand'] }
    ],
    specifications: {
      'Color Temp': '3200K - 6500K 3 Modes',
      'Power': 'USB 5V Powered with Remote'
    },
    isFeatured: false,
    isTrending: true,
    isPreOrder: true,
    sourcingTimeframe: '12 - 16 working days'
  },
  {
    id: 'prod-12',
    sku: 'HV-STD-012',
    name: 'Foldable Aluminum Desktop Phone Stand',
    category: 'Phones & Accessories',
    description: 'Ergonomic dual-axis adjustable phone and tablet desktop holder with non-slip silicone pads and cable pass-through hole.',
    price: 6000,
    supplierPriceRMB: 12,
    rating: 4.8,
    reviewsCount: 83,
    primaryImage: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=600&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Metallic Silver', 'Space Grey', 'Rose Gold'] }
    ],
    specifications: {
      'Material': 'Solid Aerospace Alloy Aluminum',
      'Weight': '160g'
    },
    isFeatured: false,
    isTrending: false,
    isPreOrder: true,
    sourcingTimeframe: '10 - 14 working days'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: '#HV00123',
    date: 'Oct 28, 2026',
    customerName: 'John Doe',
    customerEmail: 'johndoe@example.com',
    customerPhone: '+234 801 234 5678',
    deliveryAddress: {
      fullName: 'John Doe',
      phone: '+234 801 234 5678',
      email: 'johndoe@example.com',
      address: '123 Main Street, Victoria Island',
      city: 'Lagos',
      state: 'Lagos State'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Wireless Earbuds Pro',
        productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        sku: 'HV-WBR-001',
        selectedVariants: { 'Color': 'White' },
        quantity: 1,
        unitPrice: 18500,
        totalPrice: 18500
      }
    ],
    subtotal: 18500,
    shippingNote: 'Not included. Will be shared separately after order confirmation and cargo arrival.',
    totalAmount: 18500,
    status: 'Purchased from Supplier',
    paymentMethod: 'Paystack / Online Transfer',
    paymentReference: 'PAY_HV_9823412',
    sourcingNotes: [
      { date: 'Oct 28, 2026 10:14 AM', message: 'Order created and payment confirmed.' },
      { date: 'Oct 28, 2026 02:30 PM', message: 'Procured from 1688 manufacturer; tracking shipment to Guangzhou warehouse.' }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: '#HV00122',
    date: 'Oct 26, 2026',
    customerName: 'Sarah K.',
    customerEmail: 'sarah.k@example.com',
    customerPhone: '+234 802 345 6789',
    deliveryAddress: {
      fullName: 'Sarah K.',
      phone: '+234 802 345 6789',
      email: 'sarah.k@example.com',
      address: '45 Adetokunbo Ademola St',
      city: 'Abuja',
      state: 'FCT'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Smart Watch Series 8',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        sku: 'HV-SMW-002',
        selectedVariants: { 'Band Color': 'Midnight Black' },
        quantity: 1,
        unitPrice: 32000,
        totalPrice: 32000
      }
    ],
    subtotal: 32000,
    shippingNote: 'Not included. Calculated upon cargo flight landing.',
    totalAmount: 32000,
    status: 'In Transit',
    paymentMethod: 'Flutterwave Card',
    paymentReference: 'FLW_HV_553198',
    sourcingNotes: [
      { date: 'Oct 26, 2026', message: 'Payment confirmed.' },
      { date: 'Oct 27, 2026', message: 'Packaged and loaded on air freight container AF-9082.' }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: '#HV00121',
    date: 'Oct 21, 2026',
    customerName: 'Michael E.',
    customerEmail: 'michael.e@example.com',
    customerPhone: '+234 803 456 7890',
    deliveryAddress: {
      fullName: 'Michael E.',
      phone: '+234 803 456 7890',
      email: 'michael.e@example.com',
      address: '15 Trans-Amadi Road',
      city: 'Port Harcourt',
      state: 'Rivers State'
    },
    items: [
      {
        productId: 'prod-6',
        productName: 'Luxury Vegan Leather Handbag',
        productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
        sku: 'HV-LHB-006',
        selectedVariants: { 'Color': 'Cognac Brown' },
        quantity: 1,
        unitPrice: 16800,
        totalPrice: 16800
      }
    ],
    subtotal: 16800,
    shippingNote: 'Local dispatch completed.',
    totalAmount: 16800,
    status: 'Delivered',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'NIP_HV_0029182',
    sourcingNotes: [
      { date: 'Oct 21, 2026', message: 'Order submitted and verified.' },
      { date: 'Oct 24, 2026', message: 'Customs cleared at MMA Airport.' },
      { date: 'Oct 25, 2026', message: 'Delivered successfully to customer.' }
    ]
  }
];

