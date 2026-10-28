import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  Info, 
  ShieldCheck, 
  AlertTriangle,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildCartWhatsAppMessage, WHATSAPP_URL } from '../lib/whatsappMessages';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, formatPrice } = useApp();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'HELEN1688') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "HELEN1688" for 5% launch discount.');
      setCouponApplied(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0070DC] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Your Pre-Order Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Discover high-demand products directly sourced from 1688 manufacturers and place your pre-order today.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          Explore Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your selected pre-order items before proceeding to checkout.
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold text-[#0070DC] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List matching design mockup */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs divide-y divide-slate-100">
          {cart.map((item) => {
            const variantText = Object.entries(item.selectedVariants)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' | ');

            return (
              <div key={`${item.productId}-${variantText}`} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-sm font-bold text-slate-900 hover:text-[#0070DC] transition line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs font-bold text-[#0070DC]">
                      {formatPrice(item.unitPrice)}
                    </p>
                    {variantText && (
                      <p className="text-[11px] text-slate-500 font-medium">
                        Variant: {variantText}
                      </p>
                    )}
                    <span className="inline-block text-[10px] bg-blue-50 text-[#0070DC] font-semibold px-2 py-0.5 rounded">
                      Pre-Order Sourcing
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.selectedVariants, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-800 bg-white py-1.5">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.selectedVariants, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedVariants)}
                      className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1 mt-0.5 justify-end"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card matching reference mockup */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Shipping Cost</span>
              <span className="font-semibold text-amber-600">Not included</span>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promo Discount (5%)</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">Total</span>
              <span className="text-xl font-extrabold text-[#0070DC]">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (HELEN1688)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0070DC]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-lg transition"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
            {couponApplied && <p className="text-[11px] text-emerald-600 font-semibold">Coupon HELEN1688 applied!</p>}
          </form>

          {/* Prominent Red Disclaimer Box matching mockup */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-[11px] text-red-700 leading-relaxed font-medium">
            Shipping, customs and other delivery fees are not included. They will be shared separately after order confirmation.
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-[#0070DC] hover:bg-[#005BB5] text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          {/* WhatsApp ordering — opens a conversation; does not submit or confirm an order */}
          <a
            href={
              (() => {
                const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                const text = buildCartWhatsAppMessage({ cartItems: cart, baseUrl });
                return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
              })()
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" /> Continue Order on WhatsApp
          </a>
          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            WhatsApp enquiries are confirmed manually by our team; product prices exclude shipping unless explicitly stated.
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure 256-bit Encrypted Pre-Order</span>
          </div>
        </div>
      </div>
    </div>
  );
};

