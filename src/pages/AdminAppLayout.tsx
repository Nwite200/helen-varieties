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
import { OrderStatus, Product } from '../types';
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
    deleteProduct,
    formatPrice 
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
  else if (path.includes('/settings')) activeSection = 'settings';
  else if (path.includes('/audit-logs')) activeSection = 'audit-logs';

  // State for order status modal
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Sourcing in Progress');
  const [statusNote, setStatusNote] = useState('');

  // State for product modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Electronics & Gadgets');
  const [pPrice, setPPrice] = useState(18500);
  const [pSku, setPSku] = useState('HV-SRC-' + Math.floor(100 + Math.random() * 900));
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80');

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
    addProduct({
      sku: pSku,
      name: pName,
      category: pCategory,
      description: 'Verified 1688 wholesale product sourced directly from Guangzhou.',
      price: Number(pPrice),
      rating: 5.0,
      reviewsCount: 1,
      primaryImage: pImage,
      images: [pImage],
      variants: [{ name: 'Option', options: ['Default'] }],
      specifications: { 'Procurement Origin': '1688 Verified Supplier' },
      isFeatured: true,
      isPreOrder: true,
      sourcingTimeframe: '10 - 15 working days'
    });
    setShowAddProductModal(false);
    setPName('');
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
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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
            <p className="text-[10px] text-slate-400 truncate">{adminUser.email}</p>
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
                <span className="text-[10px] text-slate-400 font-medium">Excludes unpaid</span>
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
                    <tr className="text-slate-400 border-b border-slate-100">
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
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-2">
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
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{conv.lastTimestamp}</span>
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
                          <span className="text-xs text-slate-400 font-mono">({activeConv.customerPhone})</span>
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
                          <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
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
                  <div className="text-center py-20 text-slate-400 text-xs">Select a conversation to inspect.</div>
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
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 border border-slate-200 rounded-2xl flex gap-3 items-center justify-between bg-white hover:border-[#0070DC] transition">
                  <img src={p.primaryImage} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                    <p className="text-xs text-[#0070DC] font-extrabold">{formatPrice(p.price)}</p>
                    <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                  </div>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
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
              {orders.map((o) => (
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
                  <tr className="text-slate-400 border-b border-slate-100">
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
                      <td className="py-3 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
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
                  <span className="text-[10px] text-slate-400">({c.itemCount || 40})</span>
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
            <h3 className="text-base font-extrabold text-slate-900">Add 1688 Sourced Product</h3>
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
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0070DC] text-white font-bold rounded-xl"
                >
                  Publish to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
