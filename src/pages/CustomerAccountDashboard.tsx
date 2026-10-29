import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, 
  MapPin, 
  User, 
  Heart, 
  LogOut, 
  Plus, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  Check, 
  Phone, 
  Mail,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const CustomerAccountDashboard: React.FC = () => {
  const { user, orders, wishlist, products, customerLogout, formatPrice, addCustomerAddress, deleteCustomerAddress, getWhatsAppLink } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Subpath tab determination
  const path = location.pathname;
  let activeTab: 'overview' | 'orders' | 'pre-orders' | 'addresses' | 'profile' | 'wishlist' = 'overview';
  if (path.includes('/orders')) activeTab = 'orders';
  else if (path.includes('/pre-orders')) activeTab = 'pre-orders';
  else if (path.includes('/addresses')) activeTab = 'addresses';
  else if (path.includes('/profile')) activeTab = 'profile';
  else if (path.includes('/wishlist')) activeTab = 'wishlist';

  // Address modal form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Lagos');
  const [state, setState] = useState('Lagos State');

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Authentication Required</h2>
        <p className="text-xs text-slate-500">Please sign in to access your personal dashboard, orders, and addresses.</p>
        <Link to="/login" className="inline-block px-6 py-2.5 bg-[#0070DC] text-white text-xs font-bold rounded-xl shadow-md">
          Sign In Now
        </Link>
      </div>
    );
  }

  // Filter orders
  const userOrders = orders.filter(o => o.customerEmail === user.email || !o.customerEmail);
  const activePreOrders = userOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city) return;
    addCustomerAddress({
      fullName,
      phone,
      street,
      city,
      state
    });
    setShowAddressModal(false);
    setStreet('');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/account', icon: Package, id: 'overview' },
    { name: 'Order History', path: '/account/orders', icon: Clock, id: 'orders', count: userOrders.length },
    { name: 'Active Pre-Orders', path: '/account/pre-orders', icon: ShieldCheck, id: 'pre-orders', count: activePreOrders.length },
    { name: 'Delivery Addresses', path: '/account/addresses', icon: MapPin, id: 'addresses', count: user.addresses?.length || 0 },
    { name: 'Saved Wishlist', path: '/account/wishlist', icon: Heart, id: 'wishlist', count: wishlist.length },
    { name: 'Account Profile', path: '/account/profile', icon: User, id: 'profile' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-[#0070DC] to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white font-extrabold text-2xl flex items-center justify-center border-2 border-white/30 shadow-inner">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">{user.name}</h1>
              {user.isEmailVerified && (
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs text-blue-100 flex items-center gap-3">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.phone}</span>
            </p>
          </div>
        </div>

        {/* WhatsApp direct assistance quick trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={getWhatsAppLink(`Hello Helen's Varieties, I am checking my account profile (${user.email}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Assistant
          </a>
          <button
            onClick={() => {
              customerLogout();
              navigate('/login');
            }}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar nav + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Nav */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-blue-50 p-4 shadow-sm space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#0070DC] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-[#0070DC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </aside>

        {/* Content Tabs */}
        <main className="lg:col-span-9 space-y-6">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick stats banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-blue-50 shadow-xs">
                  <span className="text-xs text-slate-500 font-semibold">Total Orders Placed</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">{userOrders.length}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-blue-50 shadow-xs">
                  <span className="text-xs text-slate-500 font-semibold">In Sourcing / Transit</span>
                  <div className="text-2xl font-extrabold text-[#0070DC] mt-2">{activePreOrders.length}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-blue-50 shadow-xs">
                  <span className="text-xs text-slate-500 font-semibold">Saved in Wishlist</span>
                  <div className="text-2xl font-extrabold text-rose-500 mt-2">{wishlist.length}</div>
                </div>
              </div>

              {/* Active pre-order quick cards */}
              <div className="bg-white rounded-3xl border border-blue-50 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">Active Pre-Orders</h3>
                  <Link to="/account/pre-orders" className="text-xs text-[#0070DC] font-bold hover:underline">
                    View All →
                  </Link>
                </div>

                {activePreOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No active sourcing pre-orders at this moment.</p>
                ) : (
                  <div className="space-y-3">
                    {activePreOrders.slice(0, 2).map((order) => (
                      <div key={order.id} className="p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="font-mono text-xs font-extrabold text-[#0070DC]">{order.orderNumber}</span>
                          <h4 className="text-xs font-bold text-slate-900">{order.items[0]?.productName}</h4>
                          <p className="text-xs text-slate-500">{order.date} • {formatPrice(order.totalAmount)}</p>
                        </div>
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 text-[#0070DC] self-start sm:self-auto">
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. ORDERS & PRE-ORDERS */}
          {(activeTab === 'orders' || activeTab === 'pre-orders') && (
            <div className="bg-white rounded-3xl border border-blue-50 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {activeTab === 'orders' ? 'Order History' : 'Active Pre-Orders'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live updates from factory procurement to Nigeria customs clearance.
                  </p>
                </div>
              </div>

              {(activeTab === 'orders' ? userOrders : activePreOrders).length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                  <p>No orders found under this category.</p>
                  <Link to="/shop" className="inline-block text-[#0070DC] font-bold hover:underline">
                    Start a New Pre-Order →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(activeTab === 'orders' ? userOrders : activePreOrders).map((order) => (
                    <div key={order.id} className="border border-slate-200 rounded-2xl p-5 hover:border-[#0070DC] transition space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <span className="font-mono text-xs font-extrabold text-[#0070DC]">{order.orderNumber}</span>
                          <span className="text-xs text-slate-500 ml-2">Placed on {order.date}</span>
                        </div>
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#0070DC] border border-blue-200 self-start sm:self-auto">
                          {order.status}
                        </span>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <img src={it.productImage} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                              <div>
                                <p className="font-bold text-slate-800">{it.productName}</p>
                                <p className="text-slate-500">Qty: {it.quantity} × {formatPrice(it.unitPrice)}</p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900">{formatPrice(it.totalPrice)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-normal">
                        <strong>Shipping Status:</strong> {order.shippingNote}
                      </div>

                      {order.sourcingNotes && order.sourcingNotes.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                            Latest Logistics Note:
                          </span>
                          <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            {order.sourcingNotes[order.sourcingNotes.length - 1].message}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl border border-blue-50 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Delivery Addresses</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage destinations for your air and sea cargo arrivals.</p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user.addresses || []).map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 relative space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="bg-blue-100 text-[#0070DC] text-[10px] font-bold px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600">{addr.street}</p>
                    <p className="text-slate-600 font-semibold">{addr.city}, {addr.state}</p>
                    <p className="text-slate-500 font-mono">{addr.phone}</p>
                    <button
                      onClick={() => deleteCustomerAddress(addr.id)}
                      className="text-red-500 hover:text-red-700 text-[11px] font-semibold pt-2 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-3xl border border-blue-50 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900">Saved Wishlist ({wishlist.length})</h2>
              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Your wishlist is empty. Tap the heart icon on any product to save it here.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-blue-50 p-6 sm:p-8 shadow-sm space-y-6 max-w-xl">
              <h2 className="text-xl font-extrabold text-slate-900">Personal Profile</h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input type="text" readOnly value={user.name} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" readOnly value={user.email} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Phone Number</label>
                  <input type="tel" readOnly value={user.phone} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Add New Delivery Address</h3>
            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street name, house number, area..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0070DC] text-white font-bold rounded-xl"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

