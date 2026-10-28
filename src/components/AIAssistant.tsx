import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Play, 
  Pause, 
  ChevronRight, 
  ShoppingBag, 
  Headphones,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useJazzAudio } from '../context/JazzAudioContext';
import { Link, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  links?: { text: string; url: string }[];
  time: string;
  isSpoken?: boolean;
}

export const AIAssistant: React.FC = () => {
  const { products, orders, user, formatPrice, addToCart } = useApp();
  const { 
    isPlaying: jazzPlaying, 
    isMuted: jazzMuted, 
    volume: jazzVolume, 
    isDucked, 
    togglePlay: toggleJazz, 
    toggleMute: toggleJazzMute, 
    setVolume: setJazzVolume, 
    setSpeechDucking 
  } = useJazzAudio();

  const navigate = useNavigate();

  // Assistant UI States
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [showMusicControls, setShowMusicControls] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'ai',
      text: "Hello and welcome to Helen's Varieties Venture! 💙\n\nI'm Helen, your voice-enabled AI shopping assistant. I can help you discover products, explain pre-orders from 1688 and global suppliers, track your orders, or guide you through checkout.\n\nTap the microphone to speak, or enable the soft jazz lounge music below for a relaxing shopping experience!",
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          handleSend(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }

      if ('speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Voice Speaking Function with Automatic Jazz Ducking Synchronization
  const speakText = (text: string) => {
    if (!synthRef.current || !isVoiceEnabled) return;

    // Cancel ongoing speech
    synthRef.current.cancel();

    // Clean markdown/symbols for clean voice reading
    const cleanText = text
      .replace(/[•*#_`]/g, '')
      .replace(/₦\s?([\d,]+)/g, '$1 Naira')
      .replace(/https?:\/\/\S+/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick warm natural English voice
    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Victoria')) && v.lang.startsWith('en'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechDucking(true); // Automatically ducks jazz music down to 10-15%
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechDucking(false); // Smoothly restores music volume
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechDucking(false);
    };

    synthRef.current.speak(utterance);
  };

  const handleToggleVoice = () => {
    const next = !isVoiceEnabled;
    setIsVoiceEnabled(next);
    if (!next && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setSpeechDucking(false);
    } else if (next) {
      // Natural spoken greeting on enabling voice
      speakText("Voice enabled! I'm Helen, your AI shopping assistant. How may I help you today?");
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can still type in the chat!');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Pause speech if AI is currently talking before listening
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
        setSpeechDucking(false);
      }
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  // Natural query processing grounded on real product & order data
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

    setTimeout(() => {
      let reply = "";
      let links: { text: string; url: string }[] | undefined = undefined;

      const lower = query.toLowerCase();

      // Product recommendation queries
      if (lower.includes('smart watch') || lower.includes('watch')) {
        const item = products.find(p => p.sku === 'HV-SMW-002') || products[1];
        reply = `We have the ${item.name} available for pre-order at ${formatPrice(item.price)}. It features an AMOLED display, heart rate and SpO2 tracking, and 7 days battery life. Would you like to view its details?`;
        links = [{ text: `View ${item.name}`, url: `/product/${item.id}` }];
      } else if (lower.includes('earbud') || lower.includes('headphone') || lower.includes('sound')) {
        const item = products.find(p => p.sku === 'HV-WBR-001') || products[0];
        reply = `Our top-rated audio pick is the ${item.name} at ${formatPrice(item.price)}. It features Active Noise Cancellation, Bluetooth 5.3, and up to 30 hours battery life with the charging case.`;
        links = [{ text: `View ${item.name}`, url: `/product/${item.id}` }];
      } else if (lower.includes('bag') || lower.includes('handbag')) {
        const item = products.find(p => p.sku === 'HV-LHB-006') || products[5];
        reply = `We source the ${item.name} at ${formatPrice(item.price)}. Crafted in luxury vegan leather with gold hardware and multiple interior compartments.`;
        links = [{ text: `View ${item.name}`, url: `/product/${item.id}` }];
      } else if (lower.includes('under') || lower.includes('below') || lower.includes('cheap') || lower.includes('budget')) {
        const affordable = products.filter(p => p.price <= 20000).slice(0, 3);
        const listText = affordable.map(p => `• ${p.name} (${formatPrice(p.price)})`).join('\n');
        reply = `Here are verified quality sourcing options under ₦20,000:\n${listText}\n\nNotice: Product prices exclude international shipping and customs clearing, which are communicated upon arrival in Lagos.`;
        links = [{ text: 'Explore All Products', url: '/shop' }];
      } else if (lower.includes('track') || lower.includes('order status') || lower.includes('where is my order')) {
        if (user) {
          const userOrders = orders.filter(o => o.customerEmail === user.email);
          if (userOrders.length > 0) {
            const latest = userOrders[0];
            reply = `Hello ${user.name}! Your order ${latest.orderNumber} is currently: ${latest.status}. Items: ${latest.items[0]?.productName}.`;
            links = [{ text: 'View Order in Dashboard', url: '/account/orders' }];
          } else {
            reply = `Hello ${user.name}, you do not have any active pre-orders right now. Can I help you find something from 1688?`;
            links = [{ text: 'Browse Catalogue', url: '/shop' }];
          }
        } else {
          reply = "To check your order progress, you can paste your order reference on our Track Order page, or sign in to your customer account.";
          links = [
            { text: 'Track Order Page', url: '/track' },
            { text: 'Sign In', url: '/login' }
          ];
        }
      } else if (lower.includes('how does pre-order') || lower.includes('how it works') || lower.includes('sourcing')) {
        reply = "Pre-ordering with Helen's Varieties is straightforward:\n1. Choose your item and pay the product manufacturing cost.\n2. Our China office inspects and packages the item from 1688.\n3. Your order flies down via air cargo (10-15 days).\n4. When it lands in Lagos, cargo weight waybill is settled and it is dispatched to your doorstep.";
        links = [{ text: 'Pre-Order Guide', url: '/pre-order' }];
      } else if (lower.includes('shipping') || lower.includes('fee') || lower.includes('cost') || lower.includes('delivery')) {
        reply = "Important notice: Product prices do not include international shipping, customs charges, or local delivery unless explicitly stated. International air cargo is billed per kg upon landing in Lagos so you only pay for actual measured weight.";
        links = [{ text: 'Shipping Policy', url: '/pre-order#shipping-policy' }];
      } else if (lower.includes('human') || lower.includes('agent') || lower.includes('complaint') || lower.includes('support')) {
        reply = "I've flagged this for human assistance. You can reach our logistics desk directly via WhatsApp at 07032583937 or submit a sourcing ticket.";
        links = [{ text: 'Contact Logistics Desk', url: '/contact' }];
      } else {
        reply = `I'm here to assist with Helen's Varieties Venture international sourcing catalogue. We source directly from 1688 at wholesale factory prices. Would you like to explore electronics, fashion, or kitchen appliances?`;
        links = [{ text: 'View All Categories', url: '/shop' }];
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

      // Speak response if voice enabled
      if (isVoiceEnabled) {
        speakText(reply);
      }
    }, 450);
  };

  return (
    <>
      {/* 1. FLOATING AI ASSISTANT LAUNCHER BUTTON */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Quick Jazz Audio Toggle Button */}
          <button
            onClick={toggleJazz}
            className={`p-3 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center ${
              jazzPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
            title={jazzPlaying ? 'Pause Gentle Jazz Music' : 'Play Gentle Lounge Jazz'}
            aria-label="Toggle Jazz Music"
          >
            <Music className="w-5 h-5" />
          </button>

          {/* Main Floating Voice Agent Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group bg-[#0070DC] hover:bg-[#005BB5] text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Open AI Voice Shopping Assistant"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-6 h-6" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>

            <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
              <span className="text-xs font-extrabold flex items-center gap-1">
                Helen AI Voice Agent
                <Sparkles className="w-3 h-3 text-amber-300" />
              </span>
              <span className="text-[10px] text-blue-100 font-medium">
                {isSpeaking ? 'Speaking...' : jazzPlaying ? 'Jazz Lounge Active' : 'Tap to talk'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* 2. EXPANDED VOICE-ENABLED CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[94vw] sm:w-[410px] h-[580px] bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Assistant Header */}
          <div className="bg-gradient-to-r from-blue-900 via-[#0070DC] to-blue-800 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-6 h-6 text-white" />
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-blue-900 animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  Helen Voice Shopping Agent
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-blue-100 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    Live Grounded AI
                  </span>
                  {jazzPlaying && (
                    <span className="text-amber-300 flex items-center gap-0.5 text-[10px]">
                      • 🎷 Jazz Lounge {isDucked && '(Ducked)'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Header Control Buttons */}
            <div className="flex items-center gap-1.5 text-white/90">
              {/* Voice On/Off Toggle */}
              <button
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl transition ${
                  isVoiceEnabled ? 'bg-emerald-500/30 text-emerald-300' : 'hover:bg-white/10 text-white/70'
                }`}
                title={isVoiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
                aria-label="Toggle Voice"
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Music Settings Toggle */}
              <button
                onClick={() => setShowMusicControls(!showMusicControls)}
                className={`p-2 rounded-xl transition ${
                  jazzPlaying ? 'bg-amber-500/30 text-amber-300' : 'hover:bg-white/10 text-white/70'
                }`}
                title="Jazz Music Atmosphere Settings"
                aria-label="Jazz Music Settings"
              >
                <Music className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. PERSISTENT JAZZ MUSIC BAR (WHEN ACTIVE OR EXPANDED) */}
          {(showMusicControls || jazzPlaying) && (
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-800 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleJazz}
                  className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center font-bold transition"
                  aria-label={jazzPlaying ? 'Pause Jazz' : 'Play Jazz'}
                >
                  {jazzPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                </button>
                <div className="leading-tight">
                  <p className="font-bold text-[11px] text-amber-300">Gentle Lounge Jazz</p>
                  <p className="text-[9px] text-slate-400">
                    {isDucked ? 'Volume ducked for voice' : 'Relaxing shopping ambience'}
                  </p>
                </div>
              </div>

              {/* Volume Slider & Mute */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={jazzMuted ? 0 : jazzVolume}
                  onChange={(e) => setJazzVolume(parseFloat(e.target.value))}
                  className="w-16 accent-amber-400 cursor-pointer h-1"
                />
                <button
                  onClick={toggleJazzMute}
                  className="text-slate-400 hover:text-white"
                >
                  {jazzMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Speaking Waveform Indicator Banner */}
          {isSpeaking && (
            <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-1 bg-emerald-600 rounded-full animate-bounce h-2" />
                  <span className="w-1 bg-emerald-600 rounded-full animate-bounce h-3 delay-75" />
                  <span className="w-1 bg-emerald-600 rounded-full animate-bounce h-1.5 delay-150" />
                </span>
                <span className="font-bold text-[11px]">Helen is speaking...</span>
              </div>
              <button
                onClick={() => {
                  synthRef.current?.cancel();
                  setIsSpeaking(false);
                  setSpeechDucking(false);
                }}
                className="text-[10px] font-bold text-red-600 hover:underline"
              >
                Stop Voice
              </button>
            </div>
          )}

          {/* Listening Audio Indicator Banner */}
          {isListening && (
            <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex items-center justify-between text-xs text-red-800 animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-red-600" />
                <span className="font-bold text-[11px]">Listening to your voice... Speak now</span>
              </div>
              <button
                onClick={toggleListening}
                className="text-[10px] font-bold text-red-700 underline"
              >
                Done
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F7F8]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs whitespace-pre-wrap leading-relaxed shadow-xs ${
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

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              "Do you have smart watches?",
              "Recommend products under ₦20,000",
              "Where is my order?",
              "How does pre-order work?"
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1 text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-[#0070DC] text-slate-600 rounded-full transition font-medium flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input & Microphone Voice Controls Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              {/* Spoken Voice Input Mic Trigger */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition ${
                  isListening
                    ? 'bg-red-500 text-white animate-bounce shadow-md shadow-red-500/30'
                    : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#0070DC]'
                }`}
                title="Speak to Assistant"
                aria-label="Microphone"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                placeholder={isListening ? "Listening..." : "Ask Helen anything or tap mic..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#0070DC] focus:bg-white focus:outline-none transition"
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
