import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle, 
  FileText, 
  AlertCircle, 
  User, 
  CreditCard,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const CustomerDashboardPage: React.FC = () => {
  const { user, orders, formatPrice, loginAs } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'support'>('orders');
  const [orderFilter, setOrderFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Delivered' | 'Cancelled'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders for logged-in user or demo fallback
  const userOrders = orders.filter((o) => !user || o.customerEmail === user.email);

  const displayedOrders = userOrders.filter((o) => {
    if (orderFilter === 'All') return true;
    if (orderFilter === 'Pending') return o.status.includes('Pending');
    if (orderFilter === 'In Progress') return o.status.includes('Sourcing') || o.status.includes('Purchased') || o.status.includes('Transit');
    if (orderFilter === 'Delivered') return o.status === 'Delivered';
    if (orderFilter === 'Cancelled') return o.status === 'Cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header matching reference layout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0070DC] font-extrabold text-xl flex items-center justify-center border-2 border-blue-200">
            {user ? user.name[0] : 'J'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {user ? user.name : 'John Doe'}
            </h1>
            <p className="text-xs text-slate-500">
              Customer Account • {user ? user.email : 'johndoe@example.com'}
            </p>
          </div>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-2">
          <Link
            to="/shop"
            className="px-4 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-lg transition shadow-xs"
          >
            New Pre-Order
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Switch to Admin Demo
          </Link>
        </div>
      </div>

      {/* Main Layout: Sidebar navigation + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-1">
          <button
            onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'orders' ? 'bg-[#0070DC] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" /> My Pre-Orders ({userOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'profile' ? 'bg-[#0070DC] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" /> Profile & Addresses
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
              activeTab === 'support' ? 'bg-[#0070DC] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Sourcing Helpdesk
          </button>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {activeTab === 'orders' && !selectedOrder && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Pre-Order History</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Track sourcing milestones from 1688 to Nigeria doorstep.</p>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1.5 overflow-x-auto text-xs font-semibold no-scrollbar">
                  {(['All', 'Pending', 'In Progress', 'Delivered'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                        orderFilter === f
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List matching design mockup */}
              <div className="space-y-4">
                {displayedOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No pre-orders found in this filter category.
                  </div>
                ) : (
                  displayedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-[#0070DC] transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                          <img
                            src={order.items[0]?.productImage || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-[#0070DC]">
                              {order.orderNumber}
                            </span>
                            <span className="text-[11px] text-slate-400">• {order.date}</span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {order.items[0]?.productName || 'Pre-Order Sourced Product'}
                            {order.items.length > 1 && (
                              <span className="text-slate-500 font-normal"> + {order.items.length - 1} more items</span>
                            )}
                          </h4>

                          <p className="text-xs font-extrabold text-slate-800">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#0070DC] hover:text-white text-slate-700 text-xs font-bold rounded-lg transition"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Single Order Detail Modal / View */}
          {selectedOrder && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-xs text-[#0070DC] font-bold hover:underline mb-1"
                  >
                    ← Back to all orders
                  </button>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Order Details: {selectedOrder.orderNumber}
                  </h3>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  {selectedOrder.status}
                </span>
              </div>

              {/* Timeline of Sourcing Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Sourcing Progress Log
                </h4>
                <div className="border-l-2 border-[#0070DC] pl-4 space-y-3 text-xs">
                  {(selectedOrder.sourcingNotes || []).map((note, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0070DC]" />
                      <span className="text-[10px] text-slate-400 font-semibold">{note.date}</span>
                      <p className="text-slate-800 font-medium mt-0.5">{note.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in this order */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Items Ordered
                </h4>
                <div className="divide-y divide-slate-100 text-xs">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center">
                      <span>{item.productName} (x{item.quantity})</span>
                      <span className="font-bold">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
                <strong>Shipping Waybill Note:</strong> {selectedOrder.shippingNote}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Delivery Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Full Name</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.name || 'John Doe'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Email</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.email || 'johndoe@example.com'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.phone || '+234 801 234 5678'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Default Destination</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">123 Main Street, Victoria Island, Lagos</p>
                </div>
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Sourcing Concierge Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Need to submit custom 1688 product links or request emergency order cancellation? Contact our Guangzhou / Lagos logistics desk directly.
              </p>
              <div className="flex gap-3 text-xs">
                <a
                  href="tel:+2348012345678"
                  className="px-4 py-2 bg-[#0070DC] text-white font-bold rounded-lg hover:bg-[#005BB5] transition"
                >
                  Call Logistics Desk
                </a>
                <Link
                  to="/contact"
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition"
                >
                  Submit Sourcing Ticket
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

