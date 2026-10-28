import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import logoImg from '../assets/helen-varieties-logo.png';

export const LogoIntroAnimation: React.FC = () => {
  const location = useLocation();

  // 1. Initial full logo intro:
  // Starts visibly at entering, moves to holding, then fades out over 700ms to reveal the homepage.
  const [animStage, setAnimStage] = useState<'entering' | 'holding' | 'leaving' | 'hidden'>('entering');
  const [routeTransitionActive, setRouteTransitionActive] = useState<boolean>(false);
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    // Stage 1: Entrance (0ms -> 600ms)
    // Stage 2: Hold visibly for 500ms (600ms -> 1100ms)
    const holdTimer = setTimeout(() => {
      setAnimStage('holding');
    }, 600);

    // Stage 3: Fade out overlay over 700ms (1100ms -> 1800ms)
    const exitTimer = setTimeout(() => {
      setAnimStage('leaving');
    }, 1100);

    // Complete at 1.8 seconds (1800ms)
    const finishTimer = setTimeout(() => {
      setAnimStage('hidden');
    }, 1800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  // 2. Subsequent client-side route changes: subtle 250ms fade
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (animStage === 'hidden') {
      setRouteTransitionActive(true);
      const timer = setTimeout(() => {
        setRouteTransitionActive(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, animStage]);

  // Full 1.8s Intro Overlay
  if (animStage !== 'hidden') {
    return (
      <aside
        aria-label="Helen's Varieties Venture"
        className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-gradient-to-b from-white via-[#F7F7F8] to-[#E6F0FA]"
        style={{
          transition: animStage === 'leaving' ? 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)' : 'opacity 200ms ease-out',
          opacity: animStage === 'leaving' ? 0 : 1
        }}
      >
        <div className="relative flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Subtle ambient lighting */}
          <div className="absolute w-52 h-52 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo Card with scale/fade in */}
          <div
            className="relative transform"
            style={{
              transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: animStage === 'entering' ? 0.3 : 1,
              transform: animStage === 'entering' ? 'scale(0.88) translateY(6px)' : 'scale(1) translateY(0px)'
            }}
          >
            <div className="w-32 h-32 sm:w-44 sm:h-44 bg-white rounded-3xl p-3.5 shadow-2xl shadow-blue-500/20 border border-blue-50 flex items-center justify-center">
              <img
                src={logoImg}
                alt="Helen Varieties Venture Logo"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>

          {/* Wordmark typography */}
          <div
            className="mt-5 space-y-1"
            style={{
              transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: animStage === 'entering' ? 0.4 : 1,
              transform: animStage === 'entering' ? 'translateY(4px)' : 'translateY(0px)'
            }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Helen<span className="text-[#0070DC]"> Varieties</span>
            </h1>
            <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Discover More • Pre-Order with Confidence
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // Subtle 250ms route transition
  if (routeTransitionActive) {
    return (
      <div
        className="fixed inset-0 z-[9990] pointer-events-none bg-white/40 backdrop-blur-[1px]"
        style={{
          transition: 'opacity 250ms ease-out'
        }}
      />
    );
  }

  return null;
};
