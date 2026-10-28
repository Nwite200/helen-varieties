import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  HelpCircle, 
  ChevronRight, 
  ExternalLink,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  links?: { text: string; url: string }[];
  time: string;
}

export const AIAssistant: React.FC = () => {
  const { products, orders, user, formatPrice } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I'm Helen, your AI Sourcing Assistant. I can help you with:\n• Product recommendations\n• How to pre-order products\n• Shipping and delivery policies\n• Order status tracking\n• Pricing & 1688 details",
      time: 'Just now'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "How does pre-order work?",
    "Are shipping fees included?",
    "Track my latest pre-order",
    "Recommend electronics under ₦25,000"
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Process grounded answers without hallucinating
    setTimeout(() => {
      let reply = "";
      let links: { text: string; url: string }[] | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes('how does pre-order') || lower.includes('how to pre-order') || lower.includes('how it works')) {
        reply = "Pre-ordering with Helen Varieties is simple and safe:\n1. Choose your product & variant\n2. Pay for the product at checkout to secure procurement\n3. Our procurement team in Guangzhou inspects and purchases the item from 1688\n4. Upon air/sea cargo arrival in Lagos, intl shipping & waybill are settled and your order is dispatched!";
        links = [{ text: "View Pre-Order Guide", url: "/pre-order" }];
      } else if (lower.includes('shipping') || lower.includes('fee') || lower.includes('cost') || lower.includes('cargo')) {
        reply = "Notice on Shipping:\nProduct prices EXCLUDE international shipping and customs clearance unless explicitly marked. Because weight and dimensions vary, cargo shipping (air 10-15 days, sea 35-45 days) is calculated once received at our consolidation hub and communicated prior to final delivery.";
        links = [{ text: "View Shipping Policy", url: "/pre-order#shipping-policy" }];
      } else if (lower.includes('track') || lower.includes('status') || lower.includes('my order')) {
        if (!user) {
          reply = "To check your order progress, please log in with your customer account or enter your order number on our Track Order page.";
          links = [
            { text: "Sign In", url: "/auth/login" },
            { text: "Track Order Page", url: "/track" }
          ];
        } else {
          const userOrders = orders.filter(o => o.customerEmail === user.email);
          if (userOrders.length === 0) {
            reply = `Hello ${user.name}, you have no active pre-orders right now. Check out our catalogue to place your first order!`;
            links = [{ text: "Browse Shop", url: "/shop" }];
          } else {
            const latest = userOrders[0];
            reply = `Found your latest order ${latest.orderNumber} placed on ${latest.date}.\nCurrent Status: ${latest.status}.\nItem: ${latest.items[0]?.productName || 'Pre-order item'}.`;
            links = [{ text: "View Order Details", url: "/dashboard" }];
          }
        }
      } else if (lower.includes('recommend') || lower.includes('under') || lower.includes('electronics') || lower.includes('gadget') || lower.includes('watch') || lower.includes('earbud')) {
        const matches = products.filter(p => p.price <= 35000).slice(0, 3);
        const listText = matches.map(m => `• ${m.name} (${formatPrice(m.price)})`).join('\n');
        reply = `Here are verified top-rated recommendations under ₦35,000 from our 1688 catalog:\n${listText}\n\nWould you like to open any of these items?`;
        links = [{ text: "View All Electronics", url: "/shop?category=Electronics%20%26%20Gadgets" }];
      } else {
        reply = "Thank you for asking! Helen Varieties Ventures sources quality products directly from 1688 and global manufacturers at wholesale prices. If you have an inquiry for a custom item link not in our catalog, our human concierge team is available to assist you.";
        links = [{ text: "Contact Sourcing Team", url: "/contact" }];
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: reply,
          links,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 450);
  };

  return (
    <>
      {/* Floating Launcher Button matching design in mockup */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#0070DC] hover:bg-[#005BB5] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open Helen Varieties AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="hidden md:inline text-xs font-bold pr-1">Helen AI Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[390px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#0070DC] text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold flex items-center gap-1.5">
                  Helen Varieties AI Assistant
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Online • Grounded Knowledge</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Grounding Notice */}
          <div className="bg-blue-50 px-3 py-1.5 border-b border-blue-100 text-[10px] text-[#0070DC] flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Answers strictly grounded on Helen Varieties verified policies.</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F7F8]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-wrap leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0070DC] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}

                  {msg.links && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1">
                      {msg.links.map((link, idx) => (
                        <Link
                          key={idx}
                          to={link.url}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0070DC] hover:underline"
                        >
                          <ChevronRight className="w-3 h-3" /> {link.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-[#0070DC] text-slate-600 rounded-full transition font-medium flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-[#0070DC] hover:bg-[#005BB5] disabled:opacity-40 text-white p-2.5 rounded-xl transition"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

