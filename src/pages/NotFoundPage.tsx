import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0070DC] flex items-center justify-center mx-auto">
      <Compass className="w-8 h-8" />
    </div>
    <p className="text-xs font-bold uppercase tracking-wider text-[#0070DC]">Error 404</p>
    <h1 className="text-3xl font-extrabold text-slate-900">We couldn’t find that page</h1>
    <p className="text-sm text-slate-500">
      The link may be old or mistyped. You can head back to the shop or track an order you have already placed.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
      <Link
        to="/shop"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl shadow-md transition"
      >
        Browse products <ArrowRight className="w-4 h-4" />
      </Link>
      <Link
        to="/track"
        className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl transition"
      >
        Track an order
      </Link>
    </div>
  </div>
);
