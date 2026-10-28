import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Centrally integrated Logo Intro & Route Transition Overlay.
 * Plays on initial site load and smoothly on client-side route transitions
 * without flickering, unmounting pages, or causing full-page reloads.
 */
export const LogoIntroAnimation: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [animState, setAnimState] = useState<'entering' | 'holding' | 'leaving' | 'hidden'>('entering');

  useEffect(() => {
    // When route changes or on initial mount
    setIsVisible(true);
    setAnimState('entering');

    // Quick entrance (100ms) -> holding state (350ms) -> smooth exit (250ms)
    const holdTimer = setTimeout(() => {
      setAnimState('leaving');
    }, isInitialLoad ? 650 : 380);

    const finishTimer = setTimeout(() => {
      setAnimState('hidden');
      setIsVisible(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }, isInitialLoad ? 950 : 650);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(finishTimer);
    };
  }, [location.pathname]);

  if (!isVisible && animState === 'hidden') {
    return null;
  }

  return (
    <aside
      aria-label="Loading Helen Varieties"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center transition-all duration-300 ease-out ${
        animState === 'leaving' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      } ${
        isInitialLoad 
          ? 'bg-gradient-to-b from-white via-[#F7F7F8] to-[#E6F0FA]' 
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="relative flex flex-col items-center justify-center p-6 text-center select-none">
        {/* Glow ambient background behind logo */}
        <div className="absolute w-44 h-44 bg-blue-400/20 rounded-full blur-2xl animate-pulse pointer-events-none" />

        {/* Logo Card with Smooth Entrance Animation */}
        <div className={`relative transition-all duration-500 ease-out transform ${
          animState === 'entering' 
            ? 'scale-90 opacity-0 translate-y-3' 
            : animState === 'holding' 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-105 opacity-0 -translate-y-2'
        }`}>
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white rounded-3xl p-3 shadow-2xl shadow-blue-500/20 border border-blue-50 flex items-center justify-center">
            <img
              src="/images/helen-varieties-logo.png"
              alt="Helen Varieties Venture"
              className="w-full h-full object-contain animate-in zoom-in-95 duration-300"
            />
          </div>

          {/* Glowing Animated Ring */}
          <div className="absolute -inset-1.5 rounded-3xl border-2 border-[#0070DC]/30 animate-ping pointer-events-none opacity-40" />
        </div>

        {/* Text Branding & Loading Pulse */}
        <div className={`mt-5 space-y-1 transition-all duration-300 delay-75 ${
          animState === 'leaving' ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
        }`}>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Helen<span className="text-[#0070DC]"> Varieties</span>
          </h2>
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Discover More • Pre-Order with Confidence
          </p>

          {/* Micro animated progress line */}
          <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden mx-auto mt-3">
            <div className="w-full h-full bg-[#0070DC] rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    </aside>
  );
};
