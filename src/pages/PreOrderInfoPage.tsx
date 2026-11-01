import React from 'react';
import { 
  Plane, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight,
  Calculator,
  Globe2,
  PackageCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PreOrderInfoPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0070DC] bg-blue-50 px-3.5 py-1.5 rounded-full">
          Wholesale Direct Sourcing Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          How Ordering Works with Helen’s Varieties
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          We source quality products from trusted suppliers and bring them to Nigerian shoppers and retail entrepreneurs with transparent pricing and quality inspection.
        </p>
      </div>

      {/* 4 Step Process Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070DC] font-extrabold flex items-center justify-center">
            01
          </div>
          <h3 className="font-bold text-sm text-slate-900">Select & Place Order</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Browse our catalogue or ask us to source a specific item. Place your order, then pay by bank transfer using the details shown.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070DC] font-extrabold flex items-center justify-center">
            02
          </div>
          <h3 className="font-bold text-sm text-slate-900">Quality Inspection</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our team receives the goods, verifies color, size and function, and packages them safely for shipping.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070DC] font-extrabold flex items-center justify-center">
            03
          </div>
          <h3 className="font-bold text-sm text-slate-900">Air / Sea Cargo Flight</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your goods are shipped to Lagos. We confirm the expected timeline with you on WhatsApp, and you can follow progress on the Track Order page.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070DC] font-extrabold flex items-center justify-center">
            04
          </div>
          <h3 className="font-bold text-sm text-slate-900">Clearance & Delivery</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upon customs clearance, parcel weight is weighed, waybill settled, and dispatched to your door across Nigeria.
          </p>
        </div>
      </div>

      {/* Prominent Mandatory Shipping Policy Notice */}
      <section id="shipping-policy" className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-[#C90016] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-red-900">
            Transparent Shipping & Duty Policy
          </h2>
        </div>

        <blockquote className="text-xs sm:text-sm text-red-900 font-semibold bg-white/70 p-4 rounded-xl border border-red-100 leading-relaxed">
          “Product price excludes international shipping, customs charges, and other applicable delivery fees unless explicitly stated. Final shipping and additional charges will be communicated according to the order's sourcing and delivery arrangements.”
        </blockquote>

        <p className="text-xs text-red-800 leading-relaxed">
          <strong>Why is shipping separated?</strong> Because international air cargo rates are determined purely by gross weight (or volumetric weight if bulky), calculating an arbitrary shipping fee beforehand causes either overcharging or loss. By billing actual weight when cargo lands in Nigeria, you only pay for what you actually ship.
        </p>
      </section>

      {/* Pricing transparency */}
      <section id="exchange-rates" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3 shadow-xs">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#0070DC]" /> How our prices work
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          All prices are shown in Naira (₦) and are fixed when you place your order. The price you see is the price of the product. International shipping, customs and delivery fees are not included and are confirmed with you separately before anything further is charged.
        </p>
      </section>

      {/* Frequently Asked Questions */}
      <section id="returns" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-xs divide-y divide-slate-100">
          <div className="pt-3 first:pt-0 space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Can I send you a product link to source?</h4>
            <p className="text-slate-600 leading-relaxed">
              Yes! Use our Contact Concierge form or our floating AI Assistant to paste a link to the product you want. Our procurement desk will verify factory credentials and quote you within 24 hours.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">What happens if an item arrives defective or damaged?</h4>
            <p className="text-slate-600 leading-relaxed">
              We inspect goods before shipping. If a defective or wrong specification is identified, it is returned directly to the supplier before flying to Nigeria.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">How do I track my parcel?</h4>
            <p className="text-slate-600 leading-relaxed">
              Every order generates a unique reference code (e.g., #HV482915). You can enter it, together with the tracking secret shown at checkout, on our Track Order page at any time to see the live milestone log.</p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="text-center py-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0070DC] hover:bg-[#005BB5] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition"
        >
          Start Exploring Sourcing Catalogue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

