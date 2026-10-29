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
          How Pre-Ordering Works with Helen’s Varieties
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          We bring 1688 and Chinese factory wholesale pricing directly to Nigerian shoppers and retail entrepreneurs with complete transparency, quality inspection, and zero hidden markups.
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
            Browse our catalogue or request custom 1688 item sourcing. Pay the product manufacturing price at checkout.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070DC] font-extrabold flex items-center justify-center">
            02
          </div>
          <h3 className="font-bold text-sm text-slate-900">Guangzhou Inspection</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our China team receives the goods, verifies color/size/function, and packages them safely for international cargo transit.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0070DC] font-extrabold flex items-center justify-center">
            03
          </div>
          <h3 className="font-bold text-sm text-slate-900">Air / Sea Cargo Flight</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Consolidated air freight arrives in Lagos within 10-15 working days. Real-time updates reflect in your dashboard.
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

      {/* Exchange Rates & Pricing transparency */}
      <section id="exchange-rates" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#0070DC]" /> 1688 RMB Exchange Rate Calculation
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          We benchmark our Chinese Yuan (RMB) procurement daily against verified China-Nigeria trade settlement rates. No artificial hidden margins are concealed inside the conversion.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold block">Current Benchmark Rate</span>
            <span className="text-xl font-extrabold text-[#0070DC]">¥1 RMB = ₦220.00</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold block">Air Freight Timeline</span>
            <span className="text-xl font-extrabold text-slate-800">10 - 15 Days</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold block">Consolidation Hub</span>
            <span className="text-xl font-extrabold text-slate-800">Guangzhou, CN</span>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-extrabold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-xs divide-y divide-slate-100">
          <div className="pt-3 first:pt-0 space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Can I submit my own 1688 product link?</h4>
            <p className="text-slate-600 leading-relaxed">
              Yes! Use our Contact Concierge form or our floating AI Assistant to paste any 1688, Taobao, or Made-in-China link. Our procurement desk will verify factory credentials and quote you within 24 hours.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">What happens if an item arrives defective or damaged?</h4>
            <p className="text-slate-600 leading-relaxed">
              We perform primary inspection at our China warehouse prior to shipping. If a defective or wrong specification is identified, it is returned directly to the supplier before flying to Nigeria.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">How do I track my parcel?</h4>
            <p className="text-slate-600 leading-relaxed">
              Every pre-order generates a unique reference code (e.g., #HV482915). You can paste this code on our Track Order page at any time to see the live milestone log.
            </p>
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

