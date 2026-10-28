import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { getWhatsAppLink, whatsappConfig } = useApp();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {/* Tooltip on hover/click */}
      {showTooltip && (
        <div className="bg-slate-900 text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
          <span>Chat with WhatsApp AI ({whatsappConfig.phoneNumber})</span>
          <button onClick={() => setShowTooltip(false)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="relative group bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 duration-200"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
        </span>
        <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
      </a>
    </div>
  );
};
