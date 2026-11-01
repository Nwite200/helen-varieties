import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock, ShieldCheck, ArrowRight, Package, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

// Order numbers look like #HV123456. People often type them without the # or in lower case.
const normaliseOrderNumber = (raw: string): string => {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '').replace(/^#/, '');
  return cleaned ? `#${cleaned}` : '';
};

export const TrackOrderPage: React.FC = () => {
  const { orders, formatPrice } = useApp();
  const [params] = useSearchParams();
  const [orderQuery, setOrderQuery] = useState(params.get('order') || '');
  const [secretQuery, setSecretQuery] = useState(params.get('secret') || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const lookup = async (rawOrder: string, rawSecret: string) => {
    setErrorMsg('');
    setSearchedOrder(null);
    const orderNumber = normaliseOrderNumber(rawOrder);
    if (!orderNumber) return;

    // An order placed in this browser already has its secret saved here
    const local = orders.find((o) => o.orderNumber.toUpperCase() === orderNumber);
    const secret = rawSecret.trim() || local?.trackingSecret || '';
    if (!secret) {
      setErrorMsg('Please enter the tracking secret that was shown when you placed the order.');
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}?secret=${encodeURIComponent(secret)}`);
      const data = await res.json().catch(() => ({} as any));
      if (res.ok && data.order) {
        setSearchedOrder(data.order as Order);
      } else if (res.status === 404 || res.status === 403) {
        setErrorMsg('We could not find an order with that number and tracking secret. Please check both and try again, or message us on WhatsApp.');
      } else if (local && secret === local.trackingSecret) {
        setSearchedOrder(local); // server unavailable: show the copy saved on this device
      } else {
        setErrorMsg('We could not reach the server right now. Please try again in a moment.');
      }
    } catch {
      if (local && secret === local.trackingSecret) setSearchedOrder(local);
      else setErrorMsg('We could not reach the server right now. Please check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookup(orderQuery, secretQuery);
  };

  // Arriving from the checkout confirmation: look the order up straight away
  useEffect(() => {
    if (params.get('order') && params.get('secret')) lookup(params.get('order')!, params.get('secret')!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0070DC] bg-blue-50 px-3 py-1 rounded-full">
          Live 1688 Sourcing Tracker
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Track Your Pre-Order Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your order number and the tracking secret you received at checkout to view sourcing, warehouse inspection, and cargo milestones.
        </p>

        {/* Search form */}
        <form onSubmit={handleSearch} className="space-y-2 max-w-md mx-auto pt-4">
          <input
            type="text"
            required
            aria-label="Order number"
            placeholder="Order number, e.g. #HV482915"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0070DC] shadow-xs"
          />
          <input
            type="text"
            aria-label="Tracking secret"
            placeholder="Tracking secret"
            autoComplete="off"
            value={secretQuery}
            onChange={(e) => setSecretQuery(e.target.value)}
            className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0070DC] shadow-xs font-mono"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="w-full px-6 py-3 bg-[#0070DC] hover:bg-[#005BB5] disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {isSearching ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching...</> : 'Track Order'}
          </button>
        </form>

        {errorMsg && (
          <div role="alert" className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Searched Order Display */}
      {searchedOrder && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-500 font-medium">Order Number:</span>
              <h3 className="text-xl font-extrabold text-slate-900 font-mono text-[#0070DC]">
                {searchedOrder.orderNumber}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Placed on {searchedOrder.date}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Sourcing Milestone</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#0070DC] inline-block mt-1">
                {searchedOrder.status}
              </span>
            </div>
          </div>

          {/* Sourcing Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Real-Time Sourcing Timeline
            </h4>
            <div className="border-l-2 border-[#0070DC] pl-4 space-y-4">
              {(searchedOrder.sourcingNotes || []).map((note, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0070DC]" />
                  <span className="text-[10px] text-slate-500 font-semibold">{note.date}</span>
                  <p className="text-xs text-slate-800 font-medium mt-0.5">{note.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered items brief */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Package Contents
            </h4>
            <div className="space-y-2">
              {searchedOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <span>{it.productName} (Qty: {it.quantity})</span>
                  <span className="font-bold text-slate-800">{formatPrice(it.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900">
            <strong>Waybill Status:</strong> {searchedOrder.shippingNote}
          </div>
        </div>
      )}
    </div>
  );
};

