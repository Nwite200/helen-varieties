import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Printer, ArrowLeft, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { openInvoice, buildInvoiceHtml, WHATSAPP_LINK } from '../lib/invoice';

export const InvoicePage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { orders, formatPrice } = useApp();

  const order = orders.find(
    (o) => o.orderNumber === orderNumber || o.orderNumber.replace(/^#/, '') === (orderNumber || '').replace(/^#/, '')
  );

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Invoice not found</h2>
        <p className="text-xs text-slate-500">We could not find an order with reference {orderNumber}.</p>
        <Link to="/track" className="inline-block px-6 py-2.5 bg-[#0070DC] text-white text-xs font-bold rounded-lg">
          Track an order
        </Link>
      </div>
    );
  }

  const handlePrint = () => openInvoice(order);
  const waText = `Hello Helen's Varieties Venture. Here is my order ${order.orderNumber} (total ${formatPrice(order.totalAmount)}). Please confirm and advise on shipping.`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/track" className="text-xs font-bold text-[#0070DC] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-[#0070DC] hover:bg-[#005BB5] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
          <a
            href={`${WHATSAPP_LINK}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" /> Send to WhatsApp
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <iframe
          title="Invoice preview"
          srcDoc={buildInvoiceHtml(order)}
          className="w-full h-[720px] border-0"
        />
      </div>
    </div>
  );
};