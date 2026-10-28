import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, Product } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { products, orders, updateOrderStatus, addProduct, deleteProduct, formatPrice } = useApp();
  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'products' | 'customers' | 'settings'>('overview');
  
  // Status update modal state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Sourcing in Progress');
  const [statusNote, setStatusNote] = useState('');

  // New product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Electronics & Gadgets');
  const [newProductPrice, setNewProductPrice] = useState(15000);
  const [newProductSku, setNewProductSku] = useState('HV-SRC-' + Math.floor(100 + Math.random() * 900));
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80');

  // Stats calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status.includes('Pending')).length;
  const sourcingOrders = orders.filter(o => o.status.includes('Sourcing') || o.status.includes('Purchased')).length;
  const transitOrders = orders.filter(o => o.status === 'In Transit').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

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
      sku: newProductSku,
      name: newProductName,
      category: newProductCategory,
      description: newProductDesc || 'Quality verified international sourcing product.',
      price: Number(newProductPrice),
      rating: 5.0,
      reviewsCount: 1,
      primaryImage: newProductImage,
      images: [newProductImage],
      variants: [{ name: 'Standard', options: ['Default'] }],
      specifications: { 'Sourcing Partner': '1688 Verified Supplier' },
      isFeatured: true,
      isPreOrder: true,
      sourcingTimeframe: '10 - 15 working days'
    });
    setShowAddProductModal(false);
    setNewProductName('');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex flex-col md:flex-row">
      {/* Admin Sidebar matching bottom right preview of reference mockup */}
      <aside className="w-full md:w-64 bg-[#191919] text-white flex-shrink-0 p-5 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-lg bg-[#0070DC] flex items-center justify-center font-bold text-white">
            HV
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight">Helen Varieties</h2>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">Admin Portal</span>
          </div>
        </div>

        <nav className="space-y-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${
              activeSection === 'overview' ? 'bg-[#0070DC] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>

          <button
            onClick={() => setActiveSection('orders')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${
              activeSection === 'orders' ? 'bg-[#0070DC] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Pre-Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveSection('products')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${
              activeSection === 'products' ? 'bg-[#0070DC] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" /> Sourcing Catalogue ({products.length})
          </button>

          <button
            onClick={() => setActiveSection('customers')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${
              activeSection === 'customers' ? 'bg-[#0070DC] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" /> Customers
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${
              activeSection === 'settings' ? 'bg-[#0070DC] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" /> Store Settings
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400">
          <p className="font-bold text-white mb-1">Exchange Rate Setting</p>
          <p>1 RMB = ₦220.00</p>
          <p className="text-[10px] text-slate-500 mt-1">Updated today from Guangzhou Bureau</p>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Operations Overview</h1>
              <p className="text-xs text-slate-500 mt-0.5">Live monitoring of 1688 procurement and customer order pipeline.</p>
            </div>

            {/* 4 Stats Cards matching admin widget in mockup */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">Total Orders</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-extrabold text-slate-900">{totalOrders}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12%</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">Pending Sourcing</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-extrabold text-amber-600">{sourcingOrders + pendingOrders}</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Action</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">In Transit (Air Cargo)</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-extrabold text-blue-600">{transitOrders + 1}</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">En Route</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">Delivered Success</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-extrabold text-emerald-600">{deliveredOrders}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">100%</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Recent Orders Pipeline</h3>
                <button
                  onClick={() => setActiveSection('orders')}
                  className="text-xs text-[#0070DC] font-bold hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100">
                      <th className="pb-3 font-semibold">Order #</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-mono font-bold text-[#0070DC]">{order.orderNumber}</td>
                        <td className="py-3 font-semibold text-slate-800">{order.customerName}</td>
                        <td className="py-3 font-bold text-slate-900">{formatPrice(order.totalAmount)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'In Transit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">{order.date}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setEditingOrderId(order.id);
                              setNewStatus(order.status);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#0070DC] hover:text-white rounded text-[11px] font-bold transition"
                          >
                            Update Status
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

        {/* ORDERS SECTION */}
        {activeSection === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Pre-Order Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage statuses and dispatch updates to customers.</p>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="p-4 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0070DC]">{order.orderNumber}</span>
                      <span className="text-xs font-semibold text-slate-700">• {order.customerName} ({order.customerPhone})</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Items: {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                    </p>
                    <p className="text-xs font-bold text-slate-900">Total: {formatPrice(order.totalAmount)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                      {order.status}
                    </span>
                    <button
                      onClick={() => {
                        setEditingOrderId(order.id);
                        setNewStatus(order.status);
                      }}
                      className="px-3 py-1.5 bg-[#0070DC] text-white text-xs font-bold rounded-lg hover:bg-[#005BB5] transition"
                    >
                      Update Sourcing
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS SECTION */}
        {activeSection === 'products' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Product Sourcing Catalogue</h2>
                <p className="text-xs text-slate-500 mt-0.5">Publish new 1688 products and set Nigerian customer pricing.</p>
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Sourcing Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border border-slate-200 rounded-xl p-3 flex gap-3 items-center justify-between bg-white">
                  <img src={product.primaryImage} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                    <p className="text-[11px] text-[#0070DC] font-extrabold">{formatPrice(product.price)}</p>
                    <span className="text-[10px] text-slate-400 font-mono">SKU: {product.sku}</span>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS SECTION */}
        {activeSection === 'customers' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900">Registered Sourcing Clients</h2>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">John Doe</p>
                  <p className="text-slate-500">johndoe@example.com • +234 801 234 5678</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active Client</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Sarah K.</p>
                  <p className="text-slate-500">sarah.k@example.com • +234 802 345 6789</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active Client</span>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS SECTION */}
        {activeSection === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-xl">
            <h2 className="text-xl font-extrabold text-slate-900">Platform Settings</h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Name</label>
                <input type="text" readOnly value="Helen Varieties Venture" className="w-full p-2.5 bg-slate-50 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sourcing Exchange Rate (RMB to NGN)</label>
                <input type="text" readOnly value="1 CNY = ₦220.00" className="w-full p-2.5 bg-slate-50 border rounded-lg" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Default International Shipping Notice</label>
                <textarea readOnly rows={3} value="Product price excludes international shipping, customs charges, and other applicable delivery fees unless explicitly stated. Final shipping and additional charges will be communicated according to the order's sourcing and delivery arrangements." className="w-full p-2.5 bg-slate-50 border rounded-lg text-slate-600" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* UPDATE STATUS MODAL */}
      {editingOrderId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Update Pre-Order Sourcing Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full p-2.5 border rounded-lg font-bold"
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
                <label className="block font-bold text-slate-700 mb-1">Log Sourcing Progress Message (visible to customer)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Cleared Guangzhou customs. Air freight flight AF-902 departed for Lagos MMA airport."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOrderId(null)}
                  className="px-4 py-2 border rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0070DC] text-white font-bold rounded-lg"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add 1688 / Sourcing Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (NGN)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Phones & Accessories">Phones & Accessories</option>
                    <option value="Fashion & Accessories">Fashion & Accessories</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Shoes & Bags">Shoes & Bags</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0070DC] text-white font-bold rounded-lg"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

