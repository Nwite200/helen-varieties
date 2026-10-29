import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Truck, 
  Image, 
  MessageCircle, 
  Bot, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Trash2,
  Pencil,
  X,
  FileText,
  Check, 
  AlertTriangle, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Send,
  Lock,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, Product, GreetingBehavior, TTSVoiceProvider } from '../types';
import { CATEGORIES } from '../mockData';

export const AdminAppLayout: React.FC = () => {
  const { 
    adminUser, 
    adminLogout, 
    orders, 
    products, 
    auditLogs, 
    whatsappConversations, 
    whatsappConfig,
    updateWhatsAppConfig,
    sendWhatsAppMessage,
    escalateWhatsAppConversation,
    resolveWhatsAppEscalation,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    formatPrice,
    aiConfig,
    updateAiConfig
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in as admin, redirect to admin login
  if (!adminUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-200 p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Restricted Administration Access</h2>
          <p className="text-xs text-slate-500">
            This administrative boundary is protected by role-based access control. Please sign in with authorized administrator credentials.
          </p>
          <Link
            to="/admin/login"
            className="inline-block w-full py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  // Active section based on URL
  const path = location.pathname;
  let activeSection = 'dashboard';
  if (path.includes('/products')) activeSection = 'products';
  else if (path.includes('/categories')) activeSection = 'categories';
  else if (path.includes('/orders')) activeSection = 'orders';
  else if (path.includes('/pre-orders')) activeSection = 'pre-orders';
  else if (path.includes('/customers')) activeSection = 'customers';
  else if (path.includes('/payments')) activeSection = 'payments';
  else if (path.includes('/shipping')) activeSection = 'shipping';
  else if (path.includes('/banners')) activeSection = 'banners';
  else if (path.includes('/whatsapp')) activeSection = 'whatsapp';
  else if (path.includes('/ai-assistant')) activeSection = 'ai-assistant';
  else if (path.includes('/reports')) activeSection = 'reports';
  else if (path.includes('/analytics')) activeSection = 'analytics';
  else if (path.includes('/settings')) activeSection = 'settings';
  else if (path.includes('/audit-logs')) activeSection = 'audit-logs';

  // State for order status modal
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Sourcing in Progress');
  const [statusNote, setStatusNote] = useState('');

  // AI Assistant settings form state (admin only)
  const [aiName, setAiName] = useState(aiConfig.assistantName);
  const [welcomeMessage, setWelcomeMessage] = useState(aiConfig.welcomeMessage);
  const [aiEnabled, setAiEnabled] = useState(aiConfig.aiEnabled);
  const [greetingBehavior, setGreetingBehavior] = useState(aiConfig.greetingBehavior);
  const [voiceProvider, setVoiceProvider] = useState(aiConfig.voiceProvider);
  const [voiceId, setVoiceId] = useState(aiConfig.voiceId);
  const [speakingRate, setSpeakingRate] = useState(aiConfig.speakingRate);
  const [defaultVoiceVolume, setDefaultVoiceVolume] = useState(aiConfig.defaultVoiceVolume);
  const [avatarUrl, setAvatarUrl] = useState(aiConfig.avatarUrl || '');
  const [backgroundEnabled, setBackgroundEnabled] = useState(aiConfig.backgroundSoundEnabled);
  const [backgroundAsset, setBackgroundAsset] = useState(aiConfig.backgroundSoundAsset || '');
  const [backgroundVolume, setBackgroundVolume] = useState(aiConfig.backgroundSoundVolume);
  const [suggestedQuestions, setSuggestedQuestions] = useState(aiConfig.suggestedQuestions);
  const [humanPhone, setHumanPhone] = useState(aiConfig.humanSupportContact.phone);
  const [humanWhatsapp, setHumanWhatsapp] = useState(aiConfig.humanSupportContact.whatsapp);

  const saveAiConfig = () => {
    updateAiConfig({
      assistantName: aiName,
      welcomeMessage,
      aiEnabled,
      greetingBehavior: greetingBehavior as any,
      voiceProvider: voiceProvider as any,
      voiceId,
      speakingRate: Number(speakingRate),
      pitch: aiConfig.pitch,
      defaultVoiceVolume: Number(defaultVoiceVolume),
      avatarUrl: avatarUrl || null,
      backgroundSoundEnabled: backgroundEnabled,
      backgroundSoundAsset: backgroundAsset || null,
      backgroundSoundVolume: Number(backgroundVolume),
      suggestedQuestions,
      humanSupportContact: {
        phone: humanPhone,
        whatsapp: humanWhatsapp,
      },
    });
  };

  // State for product modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPSku(p.sku);
    setPPrice(p.price);
    setPCategory(p.category);
    setPImages(p.images && p.images.length ? p.images : [p.primaryImage]);
    setShowAddProductModal(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setPName('');
    setPSku('HV-SRC-' + Math.floor(100 + Math.random() * 900));
    setPPrice(18500);
    setPCategory('Electronics & Gadgets');
    setPImages(['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80']);
    setPImageUrlInput('');
    setPFormError('');
  };
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Electronics & Gadgets');
  const [pPrice, setPPrice] = useState(18500);
  const [pSku, setPSku] = useState('HV-SRC-' + Math.floor(100 + Math.random() * 900));
  const [pImages, setPImages] = useState<string[]>(['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80']);
  const [pImageUrlInput, setPImageUrlInput] = useState('');
  const [pFormError, setPFormError] = useState('');

  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const addImageFromUrl = () => {
    const url = pImageUrlInput.trim();
    if (!url) return;
    setPImages((prev) => [...prev, url]);
    setPImageUrlInput('');
  };

  const removeImage = (idx: number) => {
    setPImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // WhatsApp active conversation state
  const [selectedConvId, setSelectedConvId] = useState<string>(whatsappConversations[0]?.id || '');
  const [replyText, setReplyText] = useState('');

  // Operations metrics calculation
  const totalOrders = orders.length;
  const newPreOrders = orders.filter(o => o.status === 'Pending Payment').length;
  const pendingPayments = orders.filter(o => o.paymentStatus === 'Unpaid').length;
  const ordersAwaitingSourcing = orders.filter(o => o.status === 'Awaiting Sourcing' || o.status === 'Payment Confirmed').length;
  const ordersInTransit = orders.filter(o => o.status === 'In Transit').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  const confirmedRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const activeConv = whatsappConversations.find(c => c.id === selectedConvId) || whatsappConversations[0];

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrderId) {
      updateOrderStatus(editingOrderId, newStatus, statusNote);
      setEditingOrderId(null);
      setStatusNote('');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setPFormError('');
    if (!pName.trim()) { setPFormError('Product name is required.'); return; }
    if (!(Number(pPrice) > 0)) { setPFormError('Price must be greater than 0.'); return; }
    if (pImages.length === 0) { setPFormError('At least one product image is required.'); return; }
    const primaryImage = pImages[0] || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80';
    const images = pImages.length ? pImages : [primaryImage];
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        sku: pSku,
        name: pName,
        category: pCategory,
        price: Number(pPrice),
        primaryImage,
        images,
      });
    } else {
      addProduct({
        sku: pSku,
        name: pName,
        category: pCategory,
        description: 'Verified 1688 wholesale product sourced directly from Guangzhou.',
        price: Number(pPrice),
        rating: 5.0,
        reviewsCount: 1,
        primaryImage,
        images,
        variants: [{ name: 'Option', options: ['Default'] }],
        specifications: { 'Procurement Origin': '1688 Verified Supplier' },
        isFeatured: true,
        isPreOrder: true,
        sourcingTimeframe: '10 - 15 working days'
      });
    }
    setShowAddProductModal(false);
    resetProductForm();
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConv) return;
    sendWhatsAppMessage(activeConv.id, replyText, 'admin');
    setReplyText('');
  };

  const menuSections = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Products', path: '/admin/products', icon: Package, id: 'products', count: products.length },
    { label: 'Categories', path: '/admin/categories', icon: Layers, id: 'categories', count: CATEGORIES.length },
    { label: 'All Orders', path: '/admin/orders', icon: ShoppingCart, id: 'orders', count: totalOrders },
    { label: 'Pre-Orders Queue', path: '/admin/pre-orders', icon: Truck, id: 'pre-orders', count: ordersAwaitingSourcing },
    { label: 'Customers', path: '/admin/customers', icon: Users, id: 'customers' },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard, id: 'payments' },
    { label: 'Shipping Rules', path: '/admin/shipping', icon: Truck, id: 'shipping' },
    { label: 'Banners & Sliders', path: '/admin/banners', icon: Image, id: 'banners' },
    { label: 'WhatsApp Live Hub', path: '/admin/whatsapp', icon: MessageCircle, id: 'whatsapp', count: whatsappConversations.filter(c => c.escalatedToHuman).length },
    { label: 'AI Shopping Assistant', path: '/admin/ai-assistant', icon: Bot, id: 'ai-assistant' },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3, id: 'reports' },
    { label: 'Sales Analytics', path: '/admin/analytics', icon: BarChart3, id: 'analytics' },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings, id: 'settings' },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck, id: 'audit-logs', count: auditLogs.length },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#191919] text-white flex-shrink-0 flex flex-col justify-between p-4 border-r border-white/10">
        <div className="space-y-6">
          {/* Logo / Brand header */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-[#0070DC] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
              HV
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">Helen's Varieties</h2>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                {adminUser.role === 'super_admin' ? 'Super Admin' : 'Admin Portal'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 max-h-[70vh] overflow-y-auto no-scrollbar text-xs font-semibold pr-1">
            {menuSections.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? 'bg-[#0070DC] text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.id === 'whatsapp' ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer with logged in identity and logout */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="px-2">
            <p className="text-xs font-bold text-white truncate">{adminUser.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{adminUser.email}</p>
          </div>
          <button
            onClick={() => {
              adminLogout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition font-bold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        {/* 1. DASHBOARD OVERVIEW */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Operations Command Center</h1>
                <p className="text-xs text-slate-500 mt-0.5">Live monitoring of 1688 supplier orders, payments, and WhatsApp inquiries.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-4 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Sourcing Item
                </button>
              </div>
            </div>

            {/* 8 Functional Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">Total Orders</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalOrders}</div>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">All Channels</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">New Pre-Orders</span>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">{newPreOrders}</div>
                <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">Pending Auth</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">In Air / Sea Transit</span>
                <div className="text-2xl font-extrabold text-blue-600 mt-1">{ordersInTransit}</div>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">Cargo Flight</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">Confirmed Revenue</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">{formatPrice(confirmedRevenue)}</div>
                <span className="text-[10px] text-slate-500 font-medium">Excludes unpaid</span>
              </div>
            </div>

            {/* Recent Orders Pipeline Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Live Orders Pipeline</h3>
                <Link to="/admin/orders" className="text-xs text-[#0070DC] font-bold hover:underline">
                  View Full Queue →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="pb-3 font-bold">Order #</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Channel</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold">Payment</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-mono font-bold text-[#0070DC]">{order.orderNumber}</td>
                        <td className="py-3 font-semibold text-slate-800">{order.customerName}</td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.source === 'whatsapp' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.source === 'whatsapp' ? 'WhatsApp' : 'Web Store'}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-slate-900">{formatPrice(order.totalAmount)}</td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {order.paymentStatus || 'Unpaid'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setEditingOrderId(order.id);
                              setNewStatus(order.status);
                            }}
                            className="px-2.5 py-1 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold rounded-lg text-[11px] transition shadow-xs"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. WHATSAPP LIVE OPERATIONS HUB */}
        {activeSection === 'whatsapp' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-emerald-500" /> WhatsApp AI Shopping & Customer Service Hub
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official number: <strong className="text-slate-800">{whatsappConfig.phoneNumber}</strong> (wa.me/{whatsappConfig.internationalNumber}). Monitor conversations and human escalations.
                </p>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                  whatsappConfig.isConnected 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${whatsappConfig.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {whatsappConfig.isConnected ? 'Meta Cloud API Connected' : 'WhatsApp Integration Unconfigured'}
                </span>
              </div>
            </div>

            {/* Setup Guidance Alert if unconfigured */}
            {!whatsappConfig.isConnected && (
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-xs text-slate-700 space-y-3">
                <h3 className="font-extrabold text-sm text-[#0070DC] flex items-center gap-2">
                  <Bot className="w-4 h-4" /> Setup Instructions for Meta WhatsApp Cloud API
                </h3>
                <p className="leading-relaxed">
                  To activate automated 24/7 AI shopping responses on WhatsApp number <strong>07032583937</strong>:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                  <li>Register your business on the <strong>Meta for Developers</strong> portal.</li>
                  <li>Configure WhatsApp Cloud API and verify phone number <code>+234 703 258 3937</code>.</li>
                  <li>Set Webhook Callback URL to your Cloudflare Worker: <code>https://api.helenvarieties.com/webhook/whatsapp</code>.</li>
                  <li>Set verify token environment variable: <code>WHATSAPP_VERIFY_TOKEN</code> and <code>WHATSAPP_ACCESS_TOKEN</code>.</li>
                </ol>
                <div className="pt-2">
                  <button
                    onClick={() => updateWhatsAppConfig({ isConnected: true, webhookStatus: 'verified', provider: 'meta_cloud_api' })}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                  >
                    Simulate Active Webhook Verification (Testing Mode)
                  </button>
                </div>
              </div>
            )}

            {/* Split Screen WhatsApp Chat Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm min-h-[500px]">
              {/* Left Conversations List */}
              <div className="lg:col-span-4 border-r border-slate-200 p-4 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-2 mb-2">
                  Recent WhatsApp Inquiries
                </h4>
                <div className="space-y-1.5">
                  {whatsappConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`w-full p-3 rounded-2xl text-left transition flex items-start justify-between gap-3 ${
                        selectedConvId === conv.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">{conv.customerName}</span>
                          {conv.escalatedToHuman && (
                            <span className="bg-red-100 text-red-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                              Escalated
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{conv.customerPhone}</p>
                        <p className="text-xs text-slate-600 truncate">{conv.lastMessage}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">{conv.lastTimestamp}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Conversation Transcript & Action Desk */}
              <div className="lg:col-span-8 flex flex-col justify-between p-6">
                {activeConv ? (
                  <>
                    <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          {activeConv.customerName}
                          <span className="text-xs text-slate-500 font-mono">({activeConv.customerPhone})</span>
                        </h3>
                        {activeConv.associatedOrderNumber && (
                          <span className="text-[11px] text-[#0070DC] font-bold">
                            Associated Pre-Order: {activeConv.associatedOrderNumber}
                          </span>
                        )}
                      </div>

                      {activeConv.escalatedToHuman ? (
                        <button
                          onClick={() => resolveWhatsAppEscalation(activeConv.id)}
                          className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold text-xs rounded-xl transition"
                        >
                          Resolve Handover
                        </button>
                      ) : (
                        <button
                          onClick={() => escalateWhatsAppConversation(activeConv.id, 'Admin manually escalated thread.')}
                          className="px-3 py-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold text-xs rounded-xl transition"
                        >
                          Trigger Handover
                        </button>
                      )}
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[380px] pr-2">
                      {activeConv.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === 'customer' ? 'items-start' : 'items-end'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs whitespace-pre-wrap leading-relaxed ${
                              msg.sender === 'customer'
                                ? 'bg-slate-100 text-slate-800 rounded-bl-none'
                                : msg.sender === 'ai'
                                ? 'bg-blue-50 text-[#0070DC] border border-blue-200 rounded-br-none'
                                : 'bg-[#191919] text-white rounded-br-none'
                            }`}
                          >
                            <span className="text-[9px] font-bold block mb-1 opacity-70">
                              {msg.sender === 'customer' ? activeConv.customerName : msg.sender === 'ai' ? 'Helen AI Shopping Agent' : 'Human Support Officer'}
                            </span>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                        </div>
                      ))}
                    </div>

                    {/* Admin WhatsApp Reply box */}
                    <form onSubmit={handleSendAdminReply} className="pt-4 border-t border-slate-100 flex gap-2">
                      <input
                        type="text"
                        placeholder="Type reply as Human Support Officer..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <Send className="w-4 h-4" /> Send
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">Select a conversation to inspect.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. PRODUCTS MANAGEMENT */}
        {activeSection === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Sourcing Catalogue ({products.length})</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage 1688 wholesale items, variants, and Nigerian customer pricing.</p>
              </div>

              <button
                onClick={() => { resetProductForm(); setShowAddProductModal(true); }}
                className="px-4 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-10 text-slate-500 text-sm">No products yet. Click "Add Item" to create one.</div>
              ) : products.map((p) => (
                <div key={p.id} className="p-4 border border-slate-200 rounded-2xl flex gap-3 items-center justify-between bg-white hover:border-[#0070DC] transition">
                  <img src={p.primaryImage} alt="" className="w-24 h-24 rounded-xl object-cover border border-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                    <p className="text-xs text-[#0070DC] font-extrabold">{formatPrice(p.price)}</p>
                    <span className="text-[10px] text-slate-500 font-mono">SKU: {p.sku}</span>
                  </div>
                  <button
                    onClick={() => openEditProduct(p)}
                    className="p-2 text-[#0070DC] hover:bg-blue-50 rounded-xl"
                    title="Edit product"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ORDERS & PRE-ORDERS */}
        {(activeSection === 'orders' || activeSection === 'pre-orders') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeSection === 'orders' ? 'All Orders & Transactions' : 'Pre-Order Procurement Queue'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Full customer pre-order lifecycle management.</p>
              </div>
            </div>

            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">No orders yet.</div>
              ) : orders.map((o) => (
                <div key={o.id} className="p-4 border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0070DC]">{o.orderNumber}</span>
                      <span className="text-xs font-bold text-slate-800">• {o.customerName} ({o.customerPhone})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${o.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {o.paymentStatus || 'Unpaid'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Items: {o.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                    </p>
                    <p className="text-xs font-extrabold text-slate-900">Total: {formatPrice(o.totalAmount)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to={`/invoice/${o.orderNumber}`} className="text-xs font-bold text-[#0070DC] hover:underline flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Invoice
                    </Link>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {o.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditingOrderId(o.id);
                        setNewStatus(o.status);
                      }}
                      className="px-3 py-1.5 bg-[#0070DC] text-white text-xs font-bold rounded-xl hover:bg-[#005BB5] transition shadow-xs"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AUDIT LOGS */}
        {activeSection === 'audit-logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">System Audit Trail</h2>
                <p className="text-xs text-slate-500 mt-0.5">Tamper-evident log of administrative modifications and sensitive operations.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="pb-3 font-bold">Timestamp</th>
                    <th className="pb-3 font-bold">Actor</th>
                    <th className="pb-3 font-bold">Action</th>
                    <th className="pb-3 font-bold">Target</th>
                    <th className="pb-3 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 font-bold text-slate-800">{log.actor}</td>
                      <td className="py-3">
                        <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-[#0070DC]">{log.target}</td>
                      <td className="py-3 text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. AI ASSISTANT CONFIGURATION (ADMIN ONLY) */}
        {activeSection === 'ai-assistant' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">AI Shopping Assistant Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure the floating Helen's Varieties Assistant. Changes apply to all public pages.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0070DC] text-[10px] font-bold border border-blue-100">
                Admin Only
              </span>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Assistant display name</label>
                  <input
                    type="text"
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">AI assistant status</label>
                  <select
                    value={aiEnabled ? 'enabled' : 'disabled'}
                    onChange={(e) => setAiEnabled(e.target.value === 'enabled')}
                    className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none bg-white"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled (hidden from customers)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Welcome message</label>
                <textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">Shown in the welcome card after a short delay.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Greeting behaviour</label>
                  <select
                    value={greetingBehavior}
                    onChange={(e) => setGreetingBehavior(e.target.value as GreetingBehavior)}
                    className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none bg-white"
                  >
                    <option value="delayed">Delayed once per session</option>
                    <option value="immediate">Immediately on load</option>
                    <option value="none">Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Voice provider</label>
                  <select
                    value={voiceProvider}
                    onChange={(e) => setVoiceProvider(e.target.value as TTSVoiceProvider)}
                    className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none bg-white"
                  >
                    <option value="browser">Browser voice (no credentials)</option>
                    <option value="elevenlabs">ElevenLabs (server-side)</option>
                    <option value="azure">Azure TTS (server-side)</option>
                    <option value="polly">Amazon Polly (server-side)</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">Remote providers need TTS_API_KEY set in Cloudflare secrets.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Voice ID / name</label>
                  <input
                    type="text"
                    value={voiceId}
                    placeholder="e.g. default browser voice"
                    onChange={(e) => setVoiceId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Speaking rate</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speakingRate}
                    onChange={(e) => setSpeakingRate(Number(e.target.value))}
                    className="w-full accent-[#0070DC]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 text-center">{speakingRate}x</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Default voice volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={defaultVoiceVolume}
                    onChange={(e) => setDefaultVoiceVolume(Number(e.target.value))}
                    className="w-full accent-[#0070DC]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1 text-center">{Math.round(Number(defaultVoiceVolume) * 100)}%</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Avatar URL (image)</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    placeholder="https://…/avatar.png or leave blank"
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Background technology ambience</span>
                  <button
                    type="button"
                    onClick={() => setBackgroundEnabled(!backgroundEnabled)}
                    className={`relative w-10 h-5 rounded-full p-0.5 transition ${backgroundEnabled ? 'bg-[#0070DC]' : 'bg-slate-200'}`}
                  >
                    <span className={`block w-3 h-3 rounded-full bg-white shadow-md transition ${backgroundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Background sound asset path</label>
                  <input
                    type="text"
                    value={backgroundAsset}
                    placeholder="/audio/tech-ambience.mp3"
                    onChange={(e) => setBackgroundAsset(e.target.value)}
                    disabled={!backgroundEnabled}
                    className={`w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none ${!backgroundEnabled ? 'bg-slate-100 text-slate-500' : ''}`}
                  />
                  <label className="block text-xs font-bold text-slate-700">Background volume</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={backgroundVolume}
                    onChange={(e) => setBackgroundVolume(Number(e.target.value))}
                    disabled={!backgroundEnabled}
                    className={`w-full accent-[#0070DC] ${!backgroundEnabled ? 'opacity-50' : ''}`}
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Optional. Disabled by default. Add a licensed technology ambience track to <code className="font-mono">public/audio/tech-ambience.mp3</code> and select it here. Never autoplayed before visitor interaction.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Suggested questions (comma separated)</label>
                <textarea
                  value={suggestedQuestions.join(', ')}
                  onChange={(e) => setSuggestedQuestions(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  rows={2}
                  className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Human support phone</label>
                  <input
                    type="text"
                    value={humanPhone}
                    onChange={(e) => setHumanPhone(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp link</label>
                  <input
                    type="text"
                    value={humanWhatsapp}
                    onChange={(e) => setHumanWhatsapp(e.target.value)}
                    className="w-full p-2.5 border rounded-xl text-xs focus:border-[#0070DC] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={saveAiConfig}
                className="w-full py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-[0.99]"
              >
                Save AI Assistant Settings
              </button>
            </div>
          </div>
        )}
        {/* ANALYTICS DASHBOARD */}
        {activeSection === 'analytics' && (() => {
          const totalOrders = orders.length;
          const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
          const avgOrder = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
          const uniqueCustomers = new Set(orders.map((o) => o.customerEmail || o.customerPhone || o.customerName)).size;
          const prodMap = new Map<string, { name: string; qty: number; revenue: number }>();
          orders.forEach((o) => (o.items || []).forEach((it) => {
            const prev = prodMap.get(it.productName) || { name: it.productName, qty: 0, revenue: 0 };
            prev.qty += it.quantity;
            prev.revenue += it.totalPrice;
            prodMap.set(it.productName, prev);
          }));
          const topProducts = [...prodMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 6);
          const maxProdQty = topProducts.reduce((m, p) => Math.max(m, p.qty), 1);
          const custMap = new Map<string, { name: string; spend: number; orders: number }>();
          orders.forEach((o) => {
            const key = o.customerEmail || o.customerPhone || o.customerName;
            const prev = custMap.get(key) || { name: o.customerName, spend: 0, orders: 0 };
            prev.spend += o.totalAmount || 0;
            prev.orders += 1;
            custMap.set(key, prev);
          });
          const topCustomers = [...custMap.values()].sort((a, b) => b.spend - a.spend).slice(0, 6);
          const maxCustSpend = topCustomers.reduce((m, c) => Math.max(m, c.spend), 1);

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Sales Analytics</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Orders, revenue, best-selling products, and leading customers.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: totalOrders, color: 'text-[#0070DC]' },
                  { label: 'Total Revenue', value: formatPrice(totalRevenue), color: 'text-emerald-600' },
                  { label: 'Avg. Order Value', value: formatPrice(avgOrder), color: 'text-amber-600' },
                  { label: 'Unique Customers', value: uniqueCustomers, color: 'text-purple-600' },
                ].map((k) => (
                  <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{k.label}</p>
                    <p className={`text-xl font-extrabold mt-1 ${k.color}`}>{k.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3">Best-Selling Products (by quantity)</h3>
                  {topProducts.length === 0 ? (
                    <p className="text-xs text-slate-500">No order data yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {topProducts.map((p) => (
                        <div key={p.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-700 truncate max-w-[70%]">{p.name}</span>
                            <span className="text-slate-500">{p.qty} units • {formatPrice(p.revenue)}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#0070DC] rounded-full" style={{ width: `${(p.qty / maxProdQty) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3">Leading Customers (by spend)</h3>
                  {topCustomers.length === 0 ? (
                    <p className="text-xs text-slate-500">No order data yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {topCustomers.map((c) => (
                        <div key={c.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-700 truncate max-w-[60%]">{c.name}</span>
                            <span className="text-slate-500">{c.orders} order(s) • {formatPrice(c.spend)}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(c.spend / maxCustSpend) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3">Orders by Date</h3>
                  {(() => {
                    const dateMap = new Map<string, number>();
                    orders.forEach((o) => dateMap.set(o.date, (dateMap.get(o.date) || 0) + 1));
                    const dateEntries = [...dateMap.entries()].slice(-10);
                    const maxDateCount = dateEntries.reduce((m, d) => Math.max(m, d[1]), 1);
                    if (dateEntries.length === 0) return <p className="text-xs text-slate-500">No order data yet.</p>;
                    return (
                      <div className="flex items-end gap-1.5 h-40">
                        {dateEntries.map(([date, count]) => (
                          <div key={date} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-[#0070DC] rounded-t" style={{ height: `${(count / maxDateCount) * 100}%`, minHeight: '4px' }} title={`${date}: ${count}`} />
                            <span className="text-[8px] text-slate-500 truncate w-full text-center">{date.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="text-sm font-extrabold text-slate-900 mb-3">Order Status Distribution</h3>
                  {(() => {
                    const statusMap = new Map<string, number>();
                    orders.forEach((o) => statusMap.set(o.status, (statusMap.get(o.status) || 0) + 1));
                    const statusEntries = [...statusMap.entries()].sort((a, b) => b[1] - a[1]);
                    if (statusEntries.length === 0) return <p className="text-xs text-slate-500">No order data yet.</p>;
                    return (
                      <div className="space-y-2">
                        {statusEntries.map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700">{status}</span>
                            <span className="text-slate-500">{count} ({Math.round((count / orders.length) * 100)}%)</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {topProducts.length > 0 && topCustomers.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-slate-700 space-y-1">
                  <p><strong>Top product:</strong> {topProducts[0].name} ({topProducts[0].qty} units, {formatPrice(topProducts[0].revenue)})</p>
                  <p><strong>Top customer:</strong> {topCustomers[0].name} ({topCustomers[0].orders} order(s), {formatPrice(topCustomers[0].spend)})</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* 6. SETTINGS & OTHER MODULES */}
        {activeSection === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 max-w-xl">
            <h2 className="text-xl font-extrabold text-slate-900">Platform & Sourcing Configuration</h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Name</label>
                <input type="text" readOnly value="Helen's Varieties Venture" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official WhatsApp Contact</label>
                <input type="text" readOnly value="07032583937 (+234 703 258 3937)" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Guangzhou Benchmark Exchange Rate</label>
                <input type="text" readOnly value="¥1 RMB = ₦220.00" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'categories' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">Configured Categories ({CATEGORIES.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {CATEGORIES.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 border rounded-2xl flex items-center justify-between">
                  <span className="font-bold text-slate-800">{c.name}</span>
                  <span className="text-[10px] text-slate-500">({c.itemCount || 40})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* UPDATE STATUS MODAL */}
      {editingOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Update Pre-Order Sourcing Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Payment Confirmed">Payment Confirmed</option>
                  <option value="Awaiting Sourcing">Awaiting Sourcing</option>
                  <option value="Sourcing in Progress">Sourcing in Progress</option>
                  <option value="Supplier Confirmed">Supplier Confirmed</option>
                  <option value="Purchased from Supplier">Purchased from Supplier</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Customs/Local Processing">Customs/Local Processing</option>
                  <option value="Ready for Delivery">Ready for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Milestone Log Message</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Cleared Guangzhou customs. Air freight cargo departed for Lagos MMA airport."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrderId(null)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0070DC] text-white font-bold rounded-xl"
                >
                  Save Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SOURCING PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">{editingProduct ? 'Edit Product' : 'Add 1688 Sourced Product'}</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Portable Solar Power Bank"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pre-Order Price (NGN)</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Images (upload or paste URL)</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFiles}
                    className="w-full p-2.5 border rounded-xl text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-[#0070DC] file:text-white file:text-xs file:font-bold file:cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pImageUrlInput}
                      placeholder="https://…/image.jpg"
                      onChange={(e) => setPImageUrlInput(e.target.value)}
                      className="flex-1 p-2.5 border rounded-xl text-xs"
                    />
                    <button
                      type="button"
                      onClick={addImageFromUrl}
                      className="px-3 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl transition"
                    >
                      Add
                    </button>
                  </div>
                  {pImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {pImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Product image ${idx + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 bg-[#0070DC] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">Primary</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">First image is the primary thumbnail. Add more for the product gallery.</p>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                {pFormError && (
                  <div className="col-span-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2">
                    {pFormError}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { setShowAddProductModal(false); resetProductForm(); }}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0070DC] text-white font-bold rounded-xl"
                >
                  {editingProduct ? 'Save Changes' : 'Publish to Catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

