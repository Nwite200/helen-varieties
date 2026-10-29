import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import logoImg from '../assets/helen-varieties-logo.png';

/**
 * Helen's Varieties Logo Animation System:
 * Plays the official branded logo animation on EVERY navigation / click on the site:
 * - Runs on initial site load
 * - Runs every time a user clicks a route, category, product, cart, checkout, or nav link
 * - Smooth fade and scale in (250ms), hold visibly (350ms), and smooth fade out (350ms)
 * - Total duration is snappy (~950ms) so interaction feels responsive and never blocked
 * - pointer-events-none ensures buttons & clicks never get stuck
 */
export const LogoIntroAnimation: React.FC = () => {
  const location = useLocation();
  const [animStage, setAnimStage] = useState<'entering' | 'holding' | 'leaving' | 'hidden'>('entering');
  const [activeKey, setActiveKey] = useState<number>(0);

  // Trigger animation on initial mount AND on every route change / link click
  useEffect(() => {
    // Increment key to reset animation smoothly on every navigation
    setActiveKey(prev => prev + 1);
    setAnimStage('entering');

    // 1. Entrance -> Hold visibly (at 280ms)
    const holdTimer = setTimeout(() => {
      setAnimStage('holding');
    }, 280);

    // 2. Hold -> Fade out (at 600ms)
    const exitTimer = setTimeout(() => {
      setAnimStage('leaving');
    }, 600);

    // 3. Complete & Hide (at 950ms total)
    const finishTimer = setTimeout(() => {
      setAnimStage('hidden');
    }, 950);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [location.pathname, location.search, location.key]);

  if (animStage === 'hidden') {
    return null;
  }

  return (
    <aside
      key={activeKey}
      aria-label="Helen's Varieties Venture"
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-white/90 backdrop-blur-sm"
      style={{
        transition: animStage === 'leaving' ? 'opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)' : 'opacity 200ms ease-out',
        opacity: animStage === 'leaving' ? 0 : 1
      }}
    >
      <div className="relative flex flex-col items-center justify-center p-6 text-center select-none">
        {/* Ambient blue aura glow */}
        <div className="absolute w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Logo Card with scale/fade animation on every route change */}
        <div
          className="relative transform"
          style={{
            transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: animStage === 'entering' ? 0.2 : 1,
            transform: animStage === 'entering' ? 'scale(0.85) translateY(6px)' : 'scale(1) translateY(0px)'
          }}
        >
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white rounded-3xl p-3 shadow-2xl shadow-blue-500/25 border border-blue-50 flex items-center justify-center">
            <img
              src={logoImg}
              alt="Helen’s Varieties Venture Logo"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
        </div>

        {/* Wordmark typography */}
        <div
          className="mt-4 space-y-1"
          style={{
            transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: animStage === 'entering' ? 0.3 : 1,
            transform: animStage === 'entering' ? 'translateY(4px)' : 'translateY(0px)'
          }}
        >
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Helen’s<span className="text-[#0070DC]"> Varieties</span>
          </h2>
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Discover More • Pre-Order with Confidence
          </p>
        </div>
      </div>
    </aside>
  );
};
