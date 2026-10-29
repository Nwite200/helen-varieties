import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutPage: React.FC = () => {
  const { cart, formatPrice, createOrder, user } = useApp();
  const navigate = useNavigate();

  // Mode: Guest Checkout vs Login / Register Account
  const [checkoutMode, setCheckoutMode] = useState<'guest' | 'authenticated'>(user ? 'authenticated' : 'guest');

  // Multi-step: 1. Customer & Shipping Details, 2. Review Order, 3. Payment, 4. Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const defaultAddress = user?.addresses && user.addresses.length > 0 ? user.addresses[0] : null;
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(defaultAddress?.street || '');
  const [city, setCity] = useState(defaultAddress?.city || 'Lagos');
  const [state, setState] = useState(defaultAddress?.state || 'Lagos State');
  const [selectedPayment, setSelectedPayment] = useState<'paystack' | 'flutterwave' | 'bank_transfer'>('paystack');
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [trackingSecret, setTrackingSecret] = useState('');
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
      const isGuest = !user || checkoutMode === 'guest';

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
        paymentMethod: selectedPayment === 'paystack' 
          ? 'Paystack (Card/USSD/Transfer)' 
          : selectedPayment === 'flutterwave' 
          ? 'Flutterwave Gateway' 
          : 'Direct Bank Transfer',
        paymentReference: `PAY_${Math.floor(100000 + Math.random() * 900000)}`,
        paymentStatus: 'Unpaid',
        source: 'website'
      });

      setCreatedOrderNumber(newOrder.orderNumber);
      setTrackingSecret(secret);
      setIsSubmitting(false);
      setCurrentStep(4);
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
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 1 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 1 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span className="hidden sm:inline">Details & Shipping</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 2 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 2 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span className="hidden sm:inline">Review Order</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 3 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 3 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span className="hidden sm:inline">Payment Option</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 4 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 4 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
            <span className="hidden sm:inline">Confirmation</span>
          </div>
        </div>
      </div>

      {/* STEP 1: GUEST VS AUTHENTICATED & DELIVERY DETAILS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          {/* Checkout Mode Selector */}
          {!user ? (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0070DC] block">
                Choose Checkout Preference
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCheckoutMode('guest')}
                  className={`p-3 rounded-xl border text-left transition ${
                    checkoutMode === 'guest'
                      ? 'border-[#0070DC] bg-white text-[#0070DC] font-bold shadow-xs'
                      : 'border-slate-200 bg-white/50 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-xs">Continue as Guest</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-1">No account creation required.</p>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login?redirect=/checkout')}
                  className="p-3 rounded-xl border border-slate-200 bg-white/50 hover:bg-white text-slate-600 text-left transition"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#0070DC]" />
                    <span className="text-xs font-bold text-slate-800">Sign In</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-1">Access saved addresses & history.</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between">
              <span>Checking out as <strong>{user.name}</strong> ({user.email})</span>
              <Link to="/account" className="font-bold underline text-emerald-900">
                Manage Account
              </Link>
            </div>
          )}

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
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Email Address <span className="font-normal text-slate-400">(Required if no phone)</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="johndoe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  WhatsApp Phone Number <span className="font-normal text-slate-400">(Required if no email)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="07032583937 or +234..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Street Delivery Address *</label>
              <textarea
                required
                rows={2}
                placeholder="123 Main Street, Victoria Island..."
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
            <h2 className="text-lg font-bold text-slate-900">Payment Option</h2>
            <span className="text-xs font-bold text-[#0070DC]">Payable Now: {formatPrice(subtotal)}</span>
          </div>

          <div className="space-y-3">
            <label className={`block border p-4 rounded-2xl cursor-pointer transition ${selectedPayment === 'paystack' ? 'border-[#0070DC] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'paystack'}
                    onChange={() => setSelectedPayment('paystack')}
                    className="accent-[#0070DC]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Paystack (Debit Card / USSD / Bank Transfer)</h4>
                    <p className="text-[11px] text-slate-500">Instant verification with 3D-secure authentication</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Verified</span>
              </div>
            </label>

            <label className={`block border p-4 rounded-2xl cursor-pointer transition ${selectedPayment === 'flutterwave' ? 'border-[#0070DC] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'flutterwave'}
                    onChange={() => setSelectedPayment('flutterwave')}
                    className="accent-[#0070DC]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Flutterwave Gateway</h4>
                    <p className="text-[11px] text-slate-500">Cards, Apple Pay, Barter, mobile money</p>
                  </div>
                </div>
              </div>
            </label>

            <label className={`block border p-4 rounded-2xl cursor-pointer transition ${selectedPayment === 'bank_transfer' ? 'border-[#0070DC] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'bank_transfer'}
                    onChange={() => setSelectedPayment('bank_transfer')}
                    className="accent-[#0070DC]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Direct Bank Transfer</h4>
                    <p className="text-[11px] text-slate-500">Submit proof of payment for manual accountant reconciliation</p>
                  </div>
                </div>
              </div>
            </label>
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
                <span>Generating Pre-Order...</span>
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

          {/* Optional Guest Account Conversion */}
          {checkoutMode === 'guest' && !user && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0070DC]" />
                <h4 className="text-xs font-bold text-slate-900">Want to track this order seamlessly?</h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Convert this guest pre-order into a permanent customer account to view live air cargo flight milestones and save delivery addresses.
              </p>
              <Link
                to={`/register?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(fullName)}`}
                className="inline-block px-4 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-[11px] font-bold rounded-xl shadow-xs transition"
              >
                Create Free Account (Optional)
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/invoice/${createdOrderNumber}`}
              className="flex-1 py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold text-xs rounded-xl shadow-sm transition text-center flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> View & Print Receipt
            </Link>
            <Link
              to="/track"
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
    </div>
  );
};
