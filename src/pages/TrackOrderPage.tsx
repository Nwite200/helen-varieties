import React, { useState } from 'react';
import { Search, Clock, ShieldCheck, ArrowRight, Package, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const TrackOrderPage: React.FC = () => {
  const { orders, formatPrice } = useApp();
  const [orderQuery, setOrderQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const q = orderQuery.trim().toUpperCase();
    if (!q) return;

    const found = orders.find(
      o => o.orderNumber.toUpperCase() === q || o.orderNumber.replace('#', '').toUpperCase() === q.replace('#', '')
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMsg(`No order found matching "${orderQuery}". Try demo order #HV00123 or check your confirmation email.`);
    }
  };

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
          Enter your unique Helen Varieties Order Number to view real-time sourcing, China warehouse inspection, and air cargo flight milestones.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-4">
          <input
            type="text"
            placeholder="e.g. #HV00123"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="flex-1 text-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0070DC] shadow-xs"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            Track Order
          </button>
        </form>

        <p className="text-[11px] text-slate-400">
          Tip: Test with active demo orders <button type="button" onClick={() => setOrderQuery('#HV00123')} className="text-[#0070DC] font-mono underline font-bold">#HV00123</button> or <button type="button" onClick={() => setOrderQuery('#HV00122')} className="text-[#0070DC] font-mono underline font-bold">#HV00122</button>
        </p>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Searched Order Display */}
      {searchedOrder && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-400 font-medium">Order Number:</span>
              <h3 className="text-xl font-extrabold text-slate-900 font-mono text-[#0070DC]">
                {searchedOrder.orderNumber}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Placed on {searchedOrder.date}</p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Sourcing Milestone</span>
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
                  <span className="text-[10px] text-slate-400 font-semibold">{note.date}</span>
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

