import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShieldCheck, 
  CreditCard, 
  Headphones, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Globe2,
  Plane,
  Heart
} from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Top Value Badges Section matching bottom of reference mockup */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Pre-Order Products</h4>
              <p className="text-xs text-slate-500">From Trusted Suppliers</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Transparent Process</h4>
              <p className="text-xs text-slate-500">No hidden charges</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Global Delivery</h4>
              <p className="text-xs text-slate-500">To your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Support</h4>
              <p className="text-xs text-slate-500">We're here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" theme="light" />
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Helen Varieties Venture is your premier international sourcing partner. 
              We connect Nigerian consumers and businesses directly with verified factories on 1688 and global manufacturers with transparent pre-order tracking.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Plane className="w-4 h-4 text-blue-400" /> Air & Sea Cargo
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <CreditCard className="w-4 h-4 text-emerald-400" /> Secure Payments
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/pre-order" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> How Pre-Order Works
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> Track Sourcing Status
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> About Helen Varieties
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> Sourcing Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Sourcing & Policies */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Sourcing & Policies</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/pre-order#shipping-policy" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> Shipping & Waybill Notice
                </Link>
              </li>
              <li>
                <Link to="/pre-order#exchange-rates" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> 1688 Exchange Rates
                </Link>
              </li>
              <li>
                <Link to="/pre-order#returns" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> Inspection & Return Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-blue-500" /> Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h5>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Lagos Mainland Logistics Hub & Pickup Point, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>+234 (0) 801 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>orders@helenvarieties.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-slate-300 mb-1.5">Weekly 1688 Hot Deals:</p>
              <div className="flex rounded-lg overflow-hidden border border-slate-700">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="bg-slate-800 text-xs text-white px-3 py-1.5 focus:outline-none flex-1 placeholder-slate-500"
                />
                <button className="bg-[#0070DC] hover:bg-[#005BB5] text-white px-3 text-xs font-bold transition">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Shipping Disclaimer Bar */}
      <div className="bg-slate-950 py-4 px-4 border-t border-slate-800 text-center">
        <div className="max-w-5xl mx-auto text-[11px] text-slate-500 leading-normal">
          <span className="font-bold text-amber-400">Important Shipping Notice: </span>
          Product price excludes international shipping, customs charges, and other applicable delivery fees unless explicitly stated. Final shipping and additional charges will be communicated according to the order's sourcing and delivery arrangements.
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 flex flex-col md:flex-row items-center md:items-start justify-between text-xs text-slate-400 gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <p>© 2026 · HELEN’S VARIETIES All rights reserved.</p>
          <p className="flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" aria-label="love" /> for healthy Nigerian families nationwide &amp; beyond
          </p>
          <p>
            Maintained by TK Software Solutions —{' '}
            <a href="tel:07062129563" className="hover:text-white transition">07062129563</a>
            {' '}•{' '}
            <a
              href="https://wa.me/2347062129563"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              WhatsApp
            </a>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition">Terms</Link>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/25 text-slate-200 hover:text-white hover:border-white/60 hover:bg-white/10 font-semibold transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
};

