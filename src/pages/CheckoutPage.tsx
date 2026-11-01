import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  User,
  UserCheck,
  Mail,
  Phone,
  Info,
  FileText,
  Loader2,
  Printer,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildInvoiceHtml, openInvoice, WHATSAPP_PHONE } from '../lib/invoice';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, formatPrice, createOrder } = useApp();
  const navigate = useNavigate();

  // Mode: Guest Checkout vs Login / Register Account
  const [checkoutMode, setCheckoutMode] = useState<'guest' | 'authenticated'>('guest');

  // Multi-step: 1. Customer & Shipping Details, 2. Review Order, 3. Payment, 4. Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
    const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [trackingSecret, setTrackingSecret] = useState('');
  // The finished order, kept so the receipt can pop up right after checkout
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Let the customer close the receipt with the Escape key
  useEffect(() => {
    if (!showReceipt) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowReceipt(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showReceipt]);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  if (cart.length === 0 && currentStep !== 4) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 px-4">
        <h2 className="text-xl font-bold text-slate-900">No items in your Pre-Order Cart</h2>
        <p className="text-xs text-slate-500">Your cart is currently empty. Explore our 1688 catalogue to add items.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl shadow-md transition">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    // MANDATORY GUEST CHECKOUT RULE:
    // Email and phone number must not both be mandatory.
    // At least one valid contact method (email OR phone) is required.
    const hasValidEmail = email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const hasValidPhone = phone.trim() && phone.replace(/\D/g, '').length >= 10;

    if (!hasValidEmail && !hasValidPhone) {
      setErrorMessage('Please provide at least one valid contact method: Email address or Phone number.');
      return;
    }

    // If both are provided, both must be syntactically valid
    if (email.trim() && !hasValidEmail) {
      setErrorMessage('The email address provided is invalid.');
      return;
    }
    if (phone.trim() && !hasValidPhone) {
      setErrorMessage('The phone number provided must have at least 10 digits.');
      return;
    }

    if (!address.trim() || !city.trim() || !state.trim()) {
      setErrorMessage('Please provide your complete delivery destination (street, city, state).');
      return;
    }

    setCurrentStep(2);
  };

  const handleCompleteOrder = () => {
    if (!agreeDisclaimer) {
      setErrorMessage('You must acknowledge that international shipping is excluded from this initial pre-order manufacturing payment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(async () => {
      const orderItems = cart.map(i => ({
        productId: i.productId,
        productName: i.product.name,
        productImage: i.product.primaryImage,
        sku: i.product.sku,
        selectedVariants: i.selectedVariants,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.unitPrice * i.quantity
      }));

      const secret = Math.random().toString(36).substring(2, 9);
      const isGuest = true;

      const newOrder = await createOrder({
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        isGuest,
        trackingSecret: secret,
        deliveryAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim()
        },
        items: orderItems,
        subtotal,
        shippingNote: 'Not included. Calculated based on actual measured weight upon landing at Lagos consolidation.',
        totalAmount: subtotal,
        paymentMethod: 'Bank transfer (details sent on WhatsApp)',
        paymentReference: '',
        paymentStatus: 'Unpaid',
        source: 'website'
      });

      setCreatedOrderNumber(newOrder.orderNumber);
      // Show the secret the server actually saved (it generates its own), falling back to the local one
      setTrackingSecret(newOrder.trackingSecret || secret);
      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setCurrentStep(4);
      setShowReceipt(true); // pop the receipt up immediately
      window.scrollTo({ top: 0 });
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Indicator Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6 text-center sm:text-left">
          Helen's Varieties Venture — Pre-Order Checkout
        </h1>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 1 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 1 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span className="hidden sm:inline">Details & Shipping</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 2 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 2 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span className="hidden sm:inline">Review Order</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 3 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 3 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span className="hidden sm:inline">Payment Option</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 4 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 4 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
            <span className="hidden sm:inline">Confirmation</span>
          </div>
        </div>
      </div>

      {/* STEP 1: GUEST VS AUTHENTICATED & DELIVERY DETAILS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <User className="w-4 h-4 text-[#0070DC] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-[#0070DC]">Guest checkout.</strong> No account is needed. You will get an order number and a tracking secret to follow your order.
            </p>
          </div>

          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Customer & Delivery Destination
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Please enter your name and at least one contact method (email or phone).
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleStep1Submit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Email Address <span className="font-normal text-slate-500">(Required if no phone)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  WhatsApp Phone Number <span className="font-normal text-slate-500">(Required if no email)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 080 1234 5678 (WhatsApp preferred)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Street Delivery Address *</label>
              <textarea
                required
                rows={2}
                placeholder="House number, street, landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">City / Town *</label>
                <input
                  type="text"
                  required
                  value={city}
                  placeholder="e.g. Ikeja"
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  placeholder="e.g. Lagos"
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0070DC] hover:bg-[#005BB5] text-white font-extrabold text-xs rounded-xl shadow-md transition-all mt-4"
            >
              Continue to Review Pre-Order
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: REVIEW ORDER & SHIPPING EXCLUSION */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Review Your Sourcing Items</h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-[#0070DC] hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Edit Details
            </button>
          </div>

          {/* Delivery destination summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">{fullName}</span>
              {checkoutMode === 'guest' && (
                <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  Guest Order
                </span>
              )}
            </div>
            <p className="text-slate-600">{address}, {city}, {state}</p>
            <p className="text-slate-500 font-mono">
              Contact: {email || 'No email provided'} • {phone || 'No phone provided'}
            </p>
          </div>

          {/* Items review */}
          <div className="divide-y divide-slate-100">
            {cart.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.product.primaryImage} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                  <div>
                    <p className="font-bold text-slate-800">{item.product.name}</p>
                    <p className="text-slate-500">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Subtotal & Mandatory Notice */}
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 text-xs space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Manufacturing Procurement Total</span>
              <span className="text-base text-[#0070DC]">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              * International air freight and clearing charges are calculated separately once parcel lands in Lagos.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="w-1/3 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-2/3 py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Proceed to Payment Method
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT & MANDATORY DISCLAIMER ACKNOWLEDGEMENT */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Payment</h2>
            <span className="text-xs font-bold text-[#0070DC]">Products total: {formatPrice(subtotal)}</span>
          </div>

          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-extrabold text-[#0070DC] uppercase tracking-wider">How payment works</h4>
            <ol className="text-xs text-slate-700 leading-relaxed list-decimal pl-4 space-y-1">
              <li>Submit your pre-order. Nothing is charged online.</li>
              <li>Our team confirms availability and the exact amount with you on WhatsApp ({WHATSAPP_PHONE}).</li>
              <li>We send the account details for a bank transfer. Your order starts once payment is confirmed.</li>
            </ol>
          </div>

          {/* Mandatory Shipping Disclaimer Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-900 leading-relaxed">
                <strong className="block text-red-800 mb-1">MANDATORY PRE-ORDER SOURCING AGREEMENT:</strong>
                “Product prices exclude international shipping, customs charges, and other applicable delivery fees unless explicitly stated. Additional charges will be communicated according to the order's sourcing and delivery arrangements.”
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 border-t border-red-200 text-xs font-bold text-red-900 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeDisclaimer}
                onChange={(e) => setAgreeDisclaimer(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600"
              />
              <span>I understand that international shipping and customs clearing are billed separately upon arrival.</span>
            </label>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-1/3 py-3 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              type="button"
              disabled={isSubmitting || !agreeDisclaimer}
              onClick={handleCompleteOrder}
              className="w-2/3 py-3 bg-[#0070DC] hover:bg-[#005BB5] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Pre-Order...</>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Submit Pre-Order ({formatPrice(subtotal)})
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER CONFIRMATION & GUEST CONVERSION */}
      {currentStep === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-xl mx-auto text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold px-3 py-1 bg-blue-100 text-[#0070DC] rounded-full uppercase tracking-wider inline-block mb-2">
              {checkoutMode === 'guest' ? 'Guest Pre-Order Submitted' : 'Pre-Order Confirmed'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Thank You, {fullName}!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your sourcing ticket is registered with our Guangzhou factory procurement office.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Reference:</span>
              <span className="font-mono font-bold text-[#0070DC] text-sm">{createdOrderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tracking Secret Token:</span>
              <span className="font-mono font-bold text-slate-700">{trackingSecret}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-bold text-amber-600">Pending Payment Verification</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Product Procurement Cost:</span>
              <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-slate-600">
              <span>Waybill Notice:</span>
              <span className="font-semibold text-amber-700">Excluded now; calculated upon landing</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowReceipt(true)}
              className="flex-1 py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold text-xs rounded-xl shadow-sm transition text-center flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> View & Print Receipt
            </button>
            <Link
              to={`/track?order=${encodeURIComponent(createdOrderNumber)}&secret=${encodeURIComponent(trackingSecret)}`}
              className="flex-1 py-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition text-center"
            >
              Track Sourcing Progress
            </Link>
            <Link
              to="/shop"
              className="flex-1 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition text-center"
            >
              Continue Sourcing
            </Link>
          </div>
        </div>
      )}

      {/* Receipt pop-up shown right after the order is placed */}
      {showReceipt && createdOrder && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/70 flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Order receipt"
          onClick={() => setShowReceipt(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[94vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-200">
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900">Your Receipt</h3>
                <p className="text-[11px] text-slate-500 truncate">Order {createdOrder.orderNumber} — keep this for your records</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => openInvoice(createdOrder)}
                  className="px-3 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowReceipt(false)}
                  aria-label="Close receipt"
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <iframe
              title="Order receipt"
              srcDoc={buildInvoiceHtml(createdOrder)}
              className="w-full flex-1 min-h-[60vh] border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};
