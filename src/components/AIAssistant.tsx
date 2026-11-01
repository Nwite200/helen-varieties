import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronRight,
  ShoppingBag,
  Clock,
  Phone,
  MessageCircle,
  Sliders,
  AlertCircle,
  Headphones,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAssistantAudio } from '../context/AssistantAudioContext';
import { generateAIReply, SHIPPING_DISCLAIMER } from '../lib/aiResponses';
import { buildProductWhatsAppMessage, WHATSAPP_URL } from '../lib/whatsappMessages';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  links?: { text: string; url: string }[];
  time: string;
  spoken?: boolean;
}

const WELCOME_STORAGE_KEY = 'hv_ai_welcome_dismissed';
const WELCOME_DELAY_MS = 2000;

export const AIAssistant: React.FC = () => {
  const { products, orders, cart, formatPrice, addToCart, getWhatsAppLink, aiConfig } = useApp();
  const user = null; // guests only: the assistant never has a customer profile
  const {
    speak,
    pause,
    resume,
    replay,
    stop,
    toggleMute,
    isMuted,
    voiceVolume,
    setVoiceVolume,
    isSpeaking,
    isPaused,
    toggleBackground,
    isBackgroundEnabled,
    backgroundVolume,
    setBackgroundVolume,
    backgroundSoundConfigured,
    backgroundError,
  } = useAssistantAudio();

  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'home' | 'chat'>('home');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [welcomeVoiceEnabled, setWelcomeVoiceEnabled] = useState(false);

  // Refs
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const speakingMsgRef = useRef<string | null>(null);

  const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // --- Session-aware welcome card (shown once per session, not on every route change) ---
  useEffect(() => {
    if (!aiConfig.aiEnabled || aiConfig.greetingBehavior === 'none') return;
    if (sessionStorage.getItem(WELCOME_STORAGE_KEY) === 'true') return;
    const timer = setTimeout(() => setWelcomeShown(true), aiConfig.greetingBehavior === 'immediate' ? 0 : WELCOME_DELAY_MS);
    return () => clearTimeout(timer);
  }, [aiConfig.aiEnabled, aiConfig.greetingBehavior]);

  const dismissWelcome = () => {
    sessionStorage.setItem(WELCOME_STORAGE_KEY, 'true');
    setWelcomeShown(false);
    stop();
  };

  const openChat = () => {
    dismissWelcome();
    setIsOpen(true);
    setMode('chat');
  };

  const addUserMessage = (text: string) => {
    const msg: Message = { id: `u-${Date.now()}`, sender: 'user', text, time: timeNow() };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const addAiMessage = useCallback(
    (text: string, links?: { text: string; url: string }[], speakIt = true) => {
      const msg: Message = { id: `a-${Date.now()}`, sender: 'ai', text, time: timeNow(), links, spoken: speakIt && !isMuted };
      setMessages((prev) => [...prev, msg]);
      if (speakIt && !isMuted) {
        speakingMsgRef.current = msg.id;
        speak(text);
      }
      return msg;
    },
    [isMuted, speak]
  );

  const orderByNumber = (ref: string) => {
    const norm = (s: string) => String(s).replace(/^#/, '');
    return orders.find((o) => norm(o.orderNumber) === norm(ref) || norm(o.id) === norm(ref));
  };

  const handleSend = useCallback(
    (text?: string) => {
      const value = (text || input || '').trim();
      if (!value) return;
      setInput('');
      addUserMessage(value);
      setTyping(true);
      scrollToBottom();

      // Simulate thinking so the UI feels conversational, then answer from real catalogue data
      const timer = setTimeout(() => {
        setTyping(false);
        const reply = generateAIReply({ message: value, products, cart, user, orderByNumber });
        addAiMessage(reply.text, reply.links, true);
        scrollToBottom();
      }, 600);
      return () => clearTimeout(timer);
    },
    [input, products, cart, user, addUserMessage, addAiMessage]
  );

  const handleQuickAction = useCallback(
    (label: string) => {
      const mapped: Record<string, string> = {
        'Find a Product': 'Help me find a product in the catalogue',
        'Browse Categories': 'Show me product categories',
        'Help Me Pre-Order': 'How does pre-order work?',
        'Track My Order': 'How do I track my order?',
        'Explain Shipping': 'Explain shipping charges and delivery',
        'Contact Support': 'I want to speak with human support on WhatsApp',
      };
      handleSend(mapped[label] || label);
    },
    [handleSend]
  );

  const handleWhatsApp = (prefilled?: string) => {
    const link = prefilled ? getWhatsAppLink(prefilled) : WHATSAPP_URL;
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleProductWhatsApp = (productId: string, selectedVariants: Record<string, string>, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = buildProductWhatsAppMessage({ product, selectedVariants, quantity, baseUrl });
    handleWhatsApp(text);
  };

  // Speech recognition (best effort, browser-native)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      recognitionRef.current = null;
      handleSend(transcript);
    };
    recognition.onerror = () => {
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    return () => {
      try { recognition.abort(); } catch {}
      recognitionRef.current = null;
    };
  }, [handleSend]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if ((recognitionRef.current as any)._listening) {
      recognitionRef.current.abort();
      (recognitionRef.current as any)._listening = false;
      return;
    }
    (recognitionRef.current as any)._listening = true;
    recognitionRef.current.start();
  };

  const renderMessage = (msg: Message) => {
    const isAi = msg.sender === 'ai';
    return (
      <div key={msg.id} className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-3`}>
        <div
          className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm break-words shadow-sm ${
            isAi
              ? 'bg-[#0070DC] text-white rounded-tr-none'
              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
          }`}
        >
          <div className="whitespace-pre-line">{msg.text}</div>
          {msg.links && msg.links.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-t-white/30 flex flex-col gap-1">
              {msg.links.map((link, idx) => (
                <Link
                  key={idx}
                  to={link.url}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E6F0FA] underline hover:text-white"
                >
                  <ChevronRight className="w-3 h-3" /> {link.text}
                </Link>
              ))}
            </div>
          )}
          {isAi && msg.spoken && !isPaused && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); replay(); }}
              className="mt-1.5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[9px] transition"
              title="Replay audio"
              aria-label="Replay assistant audio"
            >
              <Play className="w-2.5 h-2.5" />
            </button>
          )}
          <span className={`block mt-1 text-[8px] ${isAi ? 'text-blue-200' : 'text-slate-500'}`}>{msg.time}</span>
        </div>
      </div>
    );
  };

  const typingBubble = () => (
    <div className="flex justify-start mb-3">
      <div className="bg-white border border-slate-200 text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs sm:text-sm shadow-sm flex items-center gap-2">
        <span className="flex h-3 w-3 rounded-full bg-blue-600 animate-pulse" />{' '}
        <span>Helen's Varieties Assistant is typing…</span>
      </div>
    </div>
  );

  const quickChips = () => (
    <div className="px-3 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
      {aiConfig.suggestedQuestions.map((q, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleQuickAction(q)}
          className="whitespace-nowrap px-3 py-1 text-[10px] bg-slate-100 hover:bg-[#E6F0FA] hover:text-[#0070DC] text-slate-600 rounded-full transition font-medium flex-shrink-0"
        >
          {q}
        </button>
      ))}
    </div>
  );

  const voiceControls = () => (
    <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={isMuted}
          aria-label={isMuted ? 'Unmute assistant' : 'Mute assistant'}
          className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-[#0070DC] transition"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={voiceVolume}
          onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
          className="w-24 accent-[#0070DC] h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Voice volume"
        />
      </div>
      <div className="flex items-center gap-2 text-[10px]">
        <span className={isSpeaking ? 'text-[#0070DC] font-medium animate-pulse' : 'text-slate-500'}>
          {isSpeaking ? (isPaused ? 'Paused' : 'Speaking…') : 'Voice ready'}
        </span>
        {!backgroundSoundConfigured && (
          <button
            type="button"
            onClick={toggleBackground}
            className="text-slate-500 hover:text-[#0070DC] underline"
            title="Background ambience not configured"
          >
            Ambience not set up
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {backgroundSoundConfigured && (
          <button
            type="button"
            onClick={toggleBackground}
            aria-pressed={isBackgroundEnabled}
            className={`p-1.5 rounded-full transition ${isBackgroundEnabled ? 'bg-blue-50 text-[#0070DC]' : 'text-slate-500 hover:bg-slate-100'}`}
            title={isBackgroundEnabled ? 'Pause background ambience' : 'Play background ambience'}
          >
            <Headphones className="w-3 h-3" />
          </button>
        )}
        <button
          type="button"
          onClick={isSpeaking ? (isPaused ? resume : pause) : replay}
          disabled={!isSpeaking && !lastSpokenText()}
          className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-[#0070DC] transition disabled:opacity-40"
          aria-label={isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Replay last response'}
          title={isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Replay last response'}
        >
          {isSpeaking ? (isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />) : <Play className="w-3 h-3" />}
        </button>
        <button
          type="button"
          onClick={stop}
          className="p-1.5 rounded-full text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
          aria-label="Stop speech"
          title="Stop speech"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  const lastSpokenText = () => {
    const last = messages.slice().reverse().find((m) => m.sender === 'ai');
    return last ? last.text : '';
  };

  const homeScreen = () => {
    const whatsAppText =
      `Hello Helen's Varieties Venture. I'd like to order or ask about products via WhatsApp. Please guide me on available items and how to place a pre-order.`;
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-6 space-y-4">
        <div className="relative w-20 h-20 rounded-full bg-[#0070DC] flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
          <span className="text-3xl">💙</span>
          <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-[#10B981] rounded-full border-2 border-white ring-1 ring-[#0070DC]" />
        </div>
        <h3 className="font-extrabold text-slate-900 text-lg">{aiConfig.assistantName}</h3>
        <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
          "Hello! How can I help you today?"
        </p>
        <div className="grid w-full grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { setMode('chat'); }}
            className="py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E6F0FA] hover:text-[#0070DC] transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" /> Chat with AI
          </button>
          <a
            href={getWhatsAppLink(whatsAppText)}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 bg-[#10B981] hover:bg-[#059669] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" /> WhatsApp
          </a>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 mt-1">
          <Link
            to="/shop"
            onClick={() => setIsOpen(false)}
            className="py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E6F0FA] hover:text-[#0070DC] transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Browse Products
          </Link>
          <Link
            to="/track"
            onClick={() => setIsOpen(false)}
            className="py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E6F0FA] hover:text-[#0070DC] transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" /> Track Order
          </Link>
        </div>
        <p className="text-[9px] text-slate-500 max-w-xs leading-relaxed">
          Opening WhatsApp starts a conversation with our team — it does not place an order on the website until confirmed.
        </p>
      </div>
    );
  };

  const welcomeCard = () => (
    <div
      className="fixed z-[60] w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl px-4 py-3.5 animate-in fade-in duration-300 sm:bottom-[92px] sm:right-24 bottom-[80px] right-4 sm:rounded-3xl"
    >
      <button
        type="button"
        onClick={dismissWelcome}
        className="absolute top-2 right-2 text-slate-500 hover:text-slate-600 transition"
        aria-label="Dismiss welcome message"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
        {aiConfig.welcomeMessage}
      </p>
      <div className="mt-2.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setWelcomeVoiceEnabled((prev) => !prev)}
          aria-pressed={welcomeVoiceEnabled}
          className={`p-1.5 rounded-full transition ${welcomeVoiceEnabled ? 'bg-[#0070DC] text-white' : 'bg-slate-100 text-slate-600 hover:bg-[#E6F0FA] hover:text-[#0070DC]'}`}
          aria-label={welcomeVoiceEnabled ? 'Turn off welcome voice' : 'Play welcome message aloud'}
          title={welcomeVoiceEnabled ? 'Turn off welcome voice' : 'Play welcome message aloud'}
        >
          {welcomeVoiceEnabled ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
        <span className="text-[10px] text-slate-500">{welcomeVoiceEnabled ? 'Voice on' : 'Tap to hear welcome'}</span>
        <button
          type="button"
          onClick={openChat}
          className="ml-auto text-xs font-bold text-[#0070DC] hover:underline"
        >
          Open chat <ChevronRight className="w-3 h-3 inline ml-0.5" />
        </button>
      </div>
    </div>
  );

  // Speak the welcome card once when the visitor turns voice on
  useEffect(() => {
    if (!welcomeShown || !welcomeVoiceEnabled) return;
    speak(aiConfig.welcomeMessage);
  }, [welcomeShown, welcomeVoiceEnabled, aiConfig.welcomeMessage, speak]);

  const chatScreen = () => (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0070DC] flex items-center justify-center text-white text-xs font-bold shadow-md">
            HV
          </div>
          <div>
            <div className="font-heading text-sm font-bold text-slate-900">{aiConfig.assistantName}</div>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition"
            aria-label="Minimise assistant"
            title="Minimise"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="px-4 py-1.5 shrink-0 bg-[#E6F0FA] border-b border-blue-100 flex items-center gap-2 text-[10px] font-bold text-[#005BB5] animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0070DC] animate-pulse" />
          {isPaused ? 'Voice paused' : "Helen's Varieties Assistant is speaking"}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={messagesEndRef}>
        {messages.map(renderMessage)}
        {typing && typingBubble()}
        {messages.length === 0 && !typing && (
          <div className="text-center py-4">
            <p className="text-[11px] text-slate-500">Start a conversation below</p>
          </div>
        )}
      </div>

      {quickChips()}

      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-slate-100 bg-white shrink-0">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-[#E6F0FA] hover:text-[#0070DC] transition"
            aria-label="Speak your message"
            title="Speak"
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about products, prices, pre-orders…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#0070DC] focus:bg-white focus:outline-none transition"
            aria-label="Your message"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-[#0070DC] hover:bg-[#005BB5] disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {voiceControls()}
    </div>
  );

  const launcher = () => (
    <div className="fixed z-[55] bottom-6 right-6 md:bottom-6 md:right-6">
      <button
        type="button"
        onClick={openChat}
        className="relative w-14 h-14 rounded-full bg-[#0070DC] flex items-center justify-center shadow-2xl shadow-blue-500/40 ring-4 ring-white ring-offset-2 ring-offset-[#0070DC] transition-all hover:scale-105 active:scale-95"
        aria-label="Open Helen's Varieties Assistant"
        title="Open shopping assistant"
      >
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0070DC] text-xl font-bold shadow-md">
          HV
        </div>
        <span className="absolute -right-1 -bottom-1 w-3 h-3 bg-[#10B981] rounded-full border-2 border-white ring-1 ring-[#0070DC]" />
        {/* Pulse ring when assistant is ready */}
        {!welcomeShown && !prefersReducedMotion && (
          <span className="absolute inset-0 rounded-full border border-[#0070DC]/40 shadow-[0_0_12px_rgba(0,112,220,0.4)] animate-pulse pointer-events-none" />
        )}
      </button>
    </div>
  );

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      {welcomeShown && welcomeCard()}
      {launcher()}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed z-[60] right-6 bottom-6 md:bottom-4 md:right-4 w-[420px] h-[70vh] md:h-auto max-h-[85vh] rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col animate-in zoom-in duration-200 sm:rounded-[1rem] md:rounded-3xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-title"
        >
          {mode === 'home' ? homeScreen() : chatScreen()}
        </div>
      )}
    </>
  );
};
