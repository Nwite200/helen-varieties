import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0070DC] bg-blue-50 px-3.5 py-1.5 rounded-full">
          Sourcing Concierge Desk
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Get in Touch with Helen Varieties
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have an inquiry, bulk order request, or want our team to source a specific 1688 product link? Reach out below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-extrabold text-slate-900">Operational Contacts</h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0070DC] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800">Lagos Logistics Hub & Pickup Point</h4>
                  <p className="mt-0.5">Mainland Consolidations, Victoria Island / Ikeja, Lagos State, Nigeria.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0070DC] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800">Direct WhatsApp / Call Line</h4>
                  <p className="mt-0.5">+234 (0) 801 234 5678</p>
                  <p className="text-slate-500 text-[10px]">Monday - Saturday, 8:00 AM - 6:00 PM WAT</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0070DC] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800">Procurement & Sourcing Email</h4>
                  <p className="mt-0.5">orders@helenvarieties.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-[#0070DC]">China Office & Consolidation</h4>
            <p>
              Guangzhou Baiyun Logistics District, Guangdong Province, China.
              Quality inspections and container consolidation happen daily before cargo boarding.
            </p>
          </div>
        </div>

        {/* 1688 Custom Sourcing Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Request Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Our Guangzhou sourcing officer will inspect the supplier, calculate current exchange-rates and message you on WhatsApp within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-[#0070DC] text-white text-xs font-bold rounded-xl"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-2">
                Custom 1688 Link Sourcing Ticket
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 801 234 5678"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Paste 1688 or Product URL</label>
                <input
                  type="url"
                  placeholder="https://detail.1688.com/offer/..."
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity & Specification Notes</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Need 50 units of Model B in black color. Need estimated delivery time to Abuja."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0070DC]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0070DC] hover:bg-[#005BB5] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Sourcing Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

