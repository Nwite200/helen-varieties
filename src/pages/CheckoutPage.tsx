import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  PackageCheck,
  Building2,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutPage: React.FC = () => {
  const { cart, formatPrice, createOrder, user } = useApp();
  const navigate = useNavigate();

  // Multi-step: 1. Shipping Details, 2. Review Order, 3. Payment, 4. Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Lagos');
  const [state, setState] = useState(user?.state || 'Lagos State');
  const [selectedPayment, setSelectedPayment] = useState<'paystack' | 'flutterwave' | 'bank_transfer'>('paystack');
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  if (cart.length === 0 && currentStep !== 4) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 px-4">
        <h2 className="text-xl font-bold text-slate-800">No items to checkout</h2>
        <p className="text-xs text-slate-500">Your cart is currently empty.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-[#0070DC] text-white text-xs font-bold rounded-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !address) {
      alert('Please fill in all delivery details.');
      return;
    }
    setCurrentStep(2);
  };

  const handleCompleteOrder = () => {
    if (!agreeDisclaimer) {
      alert('You must acknowledge that international shipping is excluded from this pre-order charge.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
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

      const newOrder = createOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress: {
          fullName,
          phone,
          email,
          address,
          city,
          state
        },
        items: orderItems,
        subtotal,
        shippingNote: 'Not included. Will be calculated based on measured weight upon landing.',
        totalAmount: subtotal,
        paymentMethod: selectedPayment === 'paystack' 
          ? 'Paystack (Card/USSD/Transfer)' 
          : selectedPayment === 'flutterwave' 
          ? 'Flutterwave Gateway' 
          : 'Direct Bank Transfer',
        paymentReference: `PAY_${Math.floor(100000 + Math.random() * 900000)}`
      });

      setCreatedOrderNumber(newOrder.orderNumber);
      setIsSubmitting(false);
      setCurrentStep(4);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Indicator Header matching reference mockup */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6 text-center sm:text-left">
          Checkout
        </h1>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 1 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 1 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span className="hidden sm:inline">Shipping Details</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 2 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 2 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span className="hidden sm:inline">Review Order</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 3 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 3 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span className="hidden sm:inline">Payment</span>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 pb-2 border-b-2 ${currentStep >= 4 ? 'border-[#0070DC] text-[#0070DC]' : 'border-slate-200 text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 4 ? 'bg-[#0070DC] text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
            <span className="hidden sm:inline">Confirmation</span>
          </div>
        </div>
      </div>

      {/* STEP 1: SHIPPING DETAILS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Shipping & Customer Details
          </h2>

          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
              />
              <p className="text-[10px] text-slate-400 mt-1">Sourcing status updates & tracking emails will be sent here.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Address *</label>
              <textarea
                required
                rows={2}
                placeholder="123 Main Street, Victoria Island..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">City / Town *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold text-xs rounded-xl shadow-md transition mt-4"
            >
              Continue to Review Order
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: REVIEW ORDER */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Review Your Pre-Order</h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-[#0070DC] hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Edit Details
            </button>
          </div>

          {/* Delivery destination summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
            <p className="font-bold text-slate-800">{fullName} ({phone})</p>
            <p className="text-slate-600">{address}, {city}, {state}</p>
            <p className="text-slate-500">{email}</p>
          </div>

          {/* Items review */}
          <div className="divide-y divide-slate-100">
            {cart.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.product.primaryImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-slate-800">{item.product.name}</p>
                    <p className="text-slate-500">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-xs space-y-2">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Total Product Cost</span>
              <span className="text-base text-[#0070DC]">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              * International shipping & clearing fees are not included now and will be communicated when parcel arrives in Lagos.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="w-1/3 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-2/3 py-2.5 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT & MANDATORY DISCLAIMER */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Select Payment Method</h2>
            <span className="text-xs font-bold text-[#0070DC]">Payable: {formatPrice(subtotal)}</span>
          </div>

          {/* Payment providers options */}
          <div className="space-y-3">
            <label className={`block border p-4 rounded-xl cursor-pointer transition ${selectedPayment === 'paystack' ? 'border-[#0070DC] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
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
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Fastest</span>
              </div>
            </label>

            <label className={`block border p-4 rounded-xl cursor-pointer transition ${selectedPayment === 'flutterwave' ? 'border-[#0070DC] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
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
                    <h4 className="text-xs font-bold text-slate-900">Flutterwave Payment Gateway</h4>
                    <p className="text-[11px] text-slate-500">Cards, Apple Pay, Barter, mobile money</p>
                  </div>
                </div>
              </div>
            </label>

            <label className={`block border p-4 rounded-xl cursor-pointer transition ${selectedPayment === 'bank_transfer' ? 'border-[#0070DC] bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
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
                    <h4 className="text-xs font-bold text-slate-900">Manual Direct Bank Transfer</h4>
                    <p className="text-[11px] text-slate-500">Submit proof of payment for manual accountant review</p>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Mandatory Shipping Disclaimer Acknowledgement */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-900 leading-relaxed">
                <strong className="block text-red-800 mb-1">MANDATORY PRE-ORDER SOURCING AGREEMENT:</strong>
                “Product price excludes international shipping, customs charges, and other applicable delivery fees unless explicitly stated. Final shipping and additional charges will be communicated according to the order's sourcing and delivery arrangements.”
              </div>
            </div>

            <label className="flex items-center gap-2 pt-2 border-t border-red-200 text-xs font-bold text-red-900 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeDisclaimer}
                onChange={(e) => setAgreeDisclaimer(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 accent-red-600"
              />
              <span>I understand and agree that shipping will be billed separately upon cargo arrival.</span>
            </label>
          </div>

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
                <span>Securing Pre-Order...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Confirm & Pay {formatPrice(subtotal)}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ORDER CONFIRMATION */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto text-center space-y-5 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Pre-Order Submitted!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Thank you, <span className="font-bold text-slate-800">{fullName}</span>. Your sourcing request is being queued with our Guangzhou procurement team.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Reference:</span>
              <span className="font-mono font-bold text-[#0070DC]">{createdOrderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-bold text-amber-600">Pending Payment Verification</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount:</span>
              <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-500">International Shipping:</span>
              <span className="font-medium text-slate-700">Calculated after cargo landing</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/dashboard"
              className="flex-1 py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-bold text-xs rounded-xl shadow-md transition text-center"
            >
              Track in Customer Dashboard
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

