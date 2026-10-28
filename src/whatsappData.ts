import { WhatsAppConversation, AuditLog, WhatsAppConfig, AIAssistantConfig } from './types';

export const DEFAULT_AI_CONFIG: AIAssistantConfig = {
  id: 'ai-config-1',
  assistantName: "Helen's Varieties Assistant",
  welcomeMessage: "Hello! 👋 Welcome to Helen's Varieties Venture. I'm your AI shopping assistant. I can help you discover products, find great options, understand our pre-order process, and get assistance with your order. What are you looking for today?",
  avatarUrl: null,
  aiEnabled: true,
  greetingBehavior: 'delayed',
  voiceProvider: 'browser',
  voiceId: '',
  speakingRate: 1.15,
  pitch: 1.0,
  defaultVoiceVolume: 1.0,
  backgroundSoundEnabled: false,
  backgroundSoundAsset: null,
  backgroundSoundVolume: 0.2,
  suggestedQuestions: [
    'Do you have smart watches?',
    'Recommend products under ₦20,000',
    'Where is my order?',
    'How does pre-order work?',
    'Explain shipping charges',
    'Contact support',
  ],
  humanSupportContact: {
    phone: '07032583937',
    whatsapp: 'https://wa.me/2347032583937',
  },
  updatedAt: new Date().toISOString(),
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-28 15:42:10',
    actor: 'admin@helenvarieties.com (Super Admin)',
    action: 'SYSTEM_INITIALIZATION',
    target: 'Security Policy',
    details: 'Configured role-based access control and Cloudflare API guard.'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-28 16:10:04',
    actor: 'admin@helenvarieties.com (Super Admin)',
    action: 'STATUS_UPDATE',
    target: 'Order #HV00121',
    details: 'Status transitioned from Ready for Delivery to Delivered.'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-28 16:25:31',
    actor: 'WhatsApp AI Agent (Webhook)',
    action: 'ORDER_INQUIRY',
    target: 'Order #HV00123',
    details: 'Customer (+234 703 258 3937) checked live tracking status via WhatsApp.'
  }
];

export const INITIAL_WHATSAPP_CONVERSATIONS: WhatsAppConversation[] = [
  {
    id: 'conv-1',
    customerPhone: '+234 703 258 3937',
    customerName: 'Amina Bello',
    lastMessage: 'Thank you! When will order #HV00123 land in Lagos?',
    lastTimestamp: '10:24 AM',
    unreadCount: 0,
    escalatedToHuman: false,
    associatedOrderNumber: '#HV00123',
    messages: [
      {
        id: 'wm-1',
        sender: 'customer',
        text: 'Hello, I want to track my pre-order #HV00123',
        timestamp: '10:20 AM'
      },
      {
        id: 'wm-2',
        sender: 'ai',
        text: 'Hello Amina! 💙 Here is your live tracking for order #HV00123:\nStatus: Purchased from Supplier (Guangzhou warehouse consolidation).\nCarrier: Air Freight Cargo AF-9082.\nNotice: Product price excludes international shipping; weight waybill will be calculated upon Lagos landing.',
        timestamp: '10:21 AM'
      },
      {
        id: 'wm-3',
        sender: 'customer',
        text: 'Thank you! When will order #HV00123 land in Lagos?',
        timestamp: '10:24 AM'
      },
      {
        id: 'wm-4',
        sender: 'ai',
        text: 'Air cargo transit typically takes 10 to 15 working days following factory dispatch. You will receive an instant WhatsApp update the moment it clears MMA Lagos customs!',
        timestamp: '10:25 AM'
      }
    ]
  },
  {
    id: 'conv-2',
    customerPhone: '+234 809 111 2233',
    customerName: 'Emeka Nwosu',
    lastMessage: 'I need to speak with human support regarding custom 1688 industrial blender sourcing.',
    lastTimestamp: '09:15 AM',
    unreadCount: 1,
    escalatedToHuman: true,
    escalationReason: 'Requested human assistance for 50-unit wholesale factory procurement from 1688.',
    messages: [
      {
        id: 'wm-201',
        sender: 'customer',
        text: 'Do you source commercial blenders from 1688?',
        timestamp: '09:12 AM'
      },
      {
        id: 'wm-202',
        sender: 'ai',
        text: "Yes, Helen's Varieties Venture sources commercial equipment directly from verified 1688 factories in Guangdong. What capacity or voltage specification are you looking for?",
        timestamp: '09:13 AM'
      },
      {
        id: 'wm-203',
        sender: 'customer',
        text: 'I need to speak with human support regarding custom 1688 industrial blender sourcing.',
        timestamp: '09:15 AM'
      },
      {
        id: 'wm-204',
        sender: 'ai',
        text: "Understood! I've escalated your conversation to our Guangzhou & Lagos procurement desks. An officer will join this WhatsApp thread shortly. Reference: TICKET-8821.",
        timestamp: '09:15 AM'
      }
    ]
  }
];

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  phoneNumber: '07032583937',
  internationalNumber: '2347032583937',
  provider: 'unconfigured', // Transparently indicates when live webhook tokens aren't set
  isConnected: false,
  webhookStatus: 'unverified',
  aiAgentEnabled: true,
  voiceNoteEnabled: true,
  welcomeMessage: `Hello and welcome to Helen's Varieties Venture! 💙\n\nWe help you discover and pre-order quality products from 1688, China, and other trusted suppliers.\n\nI'm your AI shopping assistant, and I'm here to help you find products, check prices, understand the pre-order process, and get assistance with your order.\n\nWhat would you like to do today?\n1. Browse products\n2. Find a product\n3. Make a pre-order\n4. Check my order\n5. Understand shipping and delivery\n6. Speak with customer support\n\nSimply type what you need, and I'll guide you.`,
  disclaimer: `Product prices do not include international shipping, customs charges, or other applicable delivery fees unless explicitly stated. Additional charges will be communicated according to the order's sourcing and delivery arrangements.`
};

